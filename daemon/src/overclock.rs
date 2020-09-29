use serde_derive::{Serialize, Deserialize};
use std::collections::HashSet;
use regex::Regex;
use std::{
    fs::OpenOptions,
    io::{prelude::*, BufReader, LineWriter, SeekFrom},
};

/// Defines `config.txt` parameters for overclocking
#[derive(Debug, Serialize, Deserialize)]
pub struct OverclockParameters {
    arm_freq: u32,
    gpu_freq: u32,
    over_voltage: u32
}

impl OverclockParameters {
    fn get_line(&self, key: &str) -> String {
	let value = match key {
	    "arm_freq" => self.arm_freq,
	    "gpu_freq" => self.gpu_freq,
	    "over_voltage" => self.over_voltage,
	    _ => 0
	};

	format!("{}={}", key, value)
    }
}

/// Checks if the Pi was overclocked previously
fn check_previous_run(lines: &Vec<String>) -> bool {
    let mut check_flag = false;
    let re = Regex::new(r"^(# Pi Tool)").unwrap();
    
    for l in lines {
	if re.is_match(&l) {
	    check_flag = true;
	}
    }

    check_flag
}

/// Formats a previous user-defined config value
fn format_user_value(line: &str) -> String {
    format!("# Pi Tool stored your previous config: {}", line)
}

/// Overclocks the system by setting values in `/boot/config.txt`
pub fn overclock(params: OverclockParameters) {
    // Reads config file
    let mut config_file = OpenOptions::new()
	.read(true)
	.write(true)
	.open("/boot/config.txt").unwrap();
    let config_reader = BufReader::new(&config_file);
    let config_lines = config_reader
	.lines()
	.map(|l| l.expect("Failed to read line"))
        .collect();

    // Initializes hash set for already updated values
    let mut updated = HashSet::new();
    updated.insert("arm_freq");
    updated.insert("gpu_freq");
    updated.insert("over_voltage");

    // Defines regex and checks for previous runs
    let re = Regex::new(r"^(arm_freq|gpu_freq|over_voltage)").unwrap();
    let previous_run = check_previous_run(&config_lines);
    let mut new_config = vec![]; 

    // First run
    if !previous_run {
	new_config.push("# Pi Tool adjusted the overclocking values in this file".to_string());
    }

    // Updates existing fields
    for line in config_lines {
	match re.captures(&line) {
	    Some(cap) => {
		let entry_key = cap.get(1).map_or("", |m| m.as_str());

		if previous_run {
		    let config_entry = params.get_line(entry_key);
		    new_config.push(config_entry);
		    updated.remove(entry_key);
		} else {
		    let user_config_entry = format_user_value(&line);
		    let config_entry = params.get_line(entry_key);
		    new_config.push(user_config_entry);
		    new_config.push(config_entry);
		    updated.remove(entry_key);
		}
	    },
	    None => {
		new_config.push(line);
	    }
	}
    }

    // Insert previously non-existent fields
    for entry_key in updated.iter() {
	let config_entry = params.get_line(entry_key);
	new_config.push(config_entry);
    }

    // Clears config and writes updated one
    config_file.seek(SeekFrom::Start(0)).unwrap();
    config_file.set_len(0).unwrap();
    let mut writer = LineWriter::new(config_file);
    for line in new_config {
	writer.write_all(line.as_bytes()).unwrap();
	writer.write_all(b"\n").unwrap();
    }
}
