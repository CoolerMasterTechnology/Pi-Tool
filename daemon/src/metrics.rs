use std::process::Command;
use serde_derive::{Serialize, Deserialize};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use std::thread;
use std::collections::HashSet;
use std::result::Result;
use std::sync::{Arc, Mutex};
use regex::Regex;
use lazy_static::lazy_static;
use sysinfo::SystemExt;
use crate::command_handler::Event;

type SystemInformation = Arc<Mutex<sysinfo::System>>;
type MetricSubscriptions = Arc<Mutex<HashSet<MetricIdentifier>>>;

lazy_static! {
    static ref CPU_FREQ_REGEX: Regex = Regex::new(r"^frequency\(.*\)=(\d*)").unwrap();
    static ref CPU_TEMP_REGEX: Regex = Regex::new(r"^temp=(.*)'C").unwrap();

    static ref SYS_INFO: SystemInformation = Arc::new(Mutex::new(
	sysinfo::System::new_all()
    ));
}

// Monitoring interval in milliseconds
const METRIC_COLLECTION_INTERVAL: u64 = 1000;

/// Defines the possible monitoring metrics
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum MetricIdentifier {
    CpuTemp,
    CpuFreq,
    RamUsage,
    SysLoad
}

/// Holds a measurement point
#[derive(Debug, Serialize, Deserialize)]
pub struct Measurement {
    metric: MetricIdentifier,
    value: i64,
    timestamp: u64
}

/// Gets the timestamp in milliseconds
fn get_timestamp() -> u64 {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");

    since_the_epoch.as_secs()
}

/// Measures the CPU temperature
fn measure_cpu_temp() -> Result<Measurement, String> {
    let output = if cfg!(feature = "raspberry") {
	  let stdout = Command::new("vcgencmd")
            .args(&["measure_temp"])
            .output()
            .expect("failed to execute process")
	    .stdout;
	String::from_utf8(stdout).unwrap()
    } else {
	"temp=42.8'C".to_string()
    };

    let caps = CPU_TEMP_REGEX.captures(&output).unwrap();
    let temp_str = caps.get(1).map_or("", |m| m.as_str());
    let temp_f = temp_str.parse::<f32>().unwrap();
    let temp = (temp_f * 10.0) as i64;

    let measurement = Measurement {
	metric: MetricIdentifier::CpuTemp,
	value: temp,
	timestamp: get_timestamp() 
    };
	
    Ok(measurement)
}

/// Measures the CPU frequency
fn measure_cpu_freq() -> Result<Measurement, String> {
    let output = if cfg!(feature = "raspberry") {
	  let stdout = Command::new("vcgencmd")
            .args(&["measure_clock", "arm"])
            .output()
            .expect("failed to execute process")
	    .stdout;
	String::from_utf8(stdout).unwrap()
    } else {
	"frequency(34)=825240256".to_string()
    };

    let caps = CPU_FREQ_REGEX.captures(&output).unwrap();
    let freq_str = caps.get(1).map_or("", |m| m.as_str());
    let freq = freq_str.parse::<i64>().unwrap();

    let measurement = Measurement {
	metric: MetricIdentifier::CpuFreq,
	value: freq,
	timestamp: get_timestamp() 
    };
	
    Ok(measurement)
}


/// Measures system load
fn measure_sys_load() -> Result<Measurement, String> {
    let sys_info = SYS_INFO.lock().unwrap();
    let sys_load = (sys_info.get_load_average().one * 10.0) as i64;

    let measurement = Measurement {
	metric: MetricIdentifier::SysLoad,
	value: sys_load,
	timestamp: get_timestamp() 
    };
	
    Ok(measurement)
}


/// Measures RAM usage
fn measure_ram_usage() -> Result<Measurement, String> {
    let mut sys_info = SYS_INFO.lock().unwrap();
    sys_info.refresh_memory();
    
    let measurement = Measurement {
	metric: MetricIdentifier::RamUsage,
	value: sys_info.get_used_memory() as i64,
	timestamp: get_timestamp() 
    };
	
    Ok(measurement)
}

/// Measures the given metric
fn measure(metric: &MetricIdentifier) -> Result<Measurement, String> {

    match metric {
	MetricIdentifier::CpuFreq => measure_cpu_freq(),
	MetricIdentifier::CpuTemp => measure_cpu_temp(),
	MetricIdentifier::SysLoad => measure_sys_load(),
	MetricIdentifier::RamUsage => measure_ram_usage()
    }
}

pub struct Collector {
    subscriptions: MetricSubscriptions
}

impl Collector {
    /// Creates a new metric collector
    pub fn new() -> Self {
	Collector {
	    subscriptions: Arc::new(Mutex::new(HashSet::new()))
	}
    }

    /// Starts metric collector
    pub fn start(&self, peer_map: crate::PeerMap) {
	let subs = Arc::clone(&self.subscriptions);

	thread::spawn(move || {
	    let sleep_duration = Duration::from_millis(METRIC_COLLECTION_INTERVAL);

	    loop {
		Self::run_measurements(&subs, &peer_map);
		thread::sleep(sleep_duration);
	    }
	});
    }

    /// Subscribes to `metric`
    pub fn subscribe(&mut self, metric: MetricIdentifier) {
	let mut subs = self.subscriptions.lock().unwrap();
	subs.insert(metric);
    }

    /// Unsubscribes from `metric`
    pub fn unsubscribe(&mut self, metric: MetricIdentifier) {
	let mut subs = self.subscriptions.lock().unwrap();
	subs.remove(&metric);
    }

    /// Runs measurements of all subscribed metrics
    fn run_measurements(subs_mtx: &MetricSubscriptions, peers: &crate::PeerMap) {
	let subs = subs_mtx.lock().unwrap();

	for metric in subs.iter() {
	    let measurement = measure(metric).unwrap();
	    let event = Event::Measurement { measurement };
	    crate::command_handler::broadcast(peers, event);
	}
    }
}
