use log::*;
use serde_derive::{Serialize, Deserialize};
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};
use std::thread::sleep;
use std::time::Duration;
use sysfs_gpio::{Direction, Pin};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use crate::command_handler::Event;
use crate::actions;

const BUTTON_PIN_NUM: u64 = 3;
const LONG_PRESS_DURATION: u128 = 300;
const SEQUENCE_DELAY: u128 = 1500;
const DEBOUNCE_DELAY: u128 = 50;

#[derive(Debug, Serialize, Deserialize, Hash)]
#[serde(tag = "type")]
pub enum ButtonAction {
    Shutdown,
    Reboot,
    LaunchScript { path: String },
    OpenBrowser { url: String },
}


#[derive(Clone, Debug, Hash, Eq, PartialEq, Deserialize, Serialize)]
pub enum ButtonPress {
    Short,
    Long
}

impl ButtonPress {
    pub fn from_num(num: u8) -> Self {
	if num >= 1 {
	    ButtonPress::Long
	} else {
	    ButtonPress::Short
	}
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Mapping {
    /// Mapping ID
    pub id: String,
    /// Vector that defines button sequence
    pub button_presses: Vec<ButtonPress>,
    /// Action triggered by button sequence
    pub button_action: ButtonAction,
    /// Indicates if button mapping is active
    pub active: bool,
}

type MappingDirectory = Arc<Mutex<HashMap<Vec<ButtonPress>, Mapping>>>;

pub struct ButtonListener {
    mappings: MappingDirectory,
}

impl ButtonListener {
    /// Creates a new `ButtonListener`
    pub fn new() -> Self{
	ButtonListener {
	    mappings: Arc::new(Mutex::new(HashMap::new()))
	}
    }

    /// Starts the button listener
    pub fn start(&mut self, peer_map: crate::PeerMap) {
	let mappings_local = self.mappings.clone();
	
	thread::spawn(move || {
	    if cfg!(feature="raspberry") {
		let _res = poll(mappings_local, peer_map);
	    }
	});
    }

    /// Syncs button mappings
    pub fn sync(&mut self, mappings: Vec<Mapping>) {
        debug!("Syncing button mappings");
	let mut mappings_dir = self.mappings.lock().unwrap();

	// Clears mapping directory
	mappings_dir.clear();

	// Inserts new mappings into mapping directory
	for map in mappings {
	    if map.active {
		mappings_dir.insert(
		    map.button_presses.clone(),
		    map
		);
	    }
	}
    }
}

/// Looks up button sequence and triggers corresponding action
fn trigger_action(mappings: &MappingDirectory,
		  press_vec: &Vec<ButtonPress>,
		  peers: &crate::PeerMap) {
    let mapping_dir = mappings.lock().unwrap();
    match mapping_dir.get(press_vec) {
	Some(mapping) => {
	    debug!("Triggering action");

	    match &mapping.button_action {
		ButtonAction::Shutdown => {
		    actions::shutdown().unwrap()
		},
		ButtonAction::Reboot => {
		    actions::reboot().unwrap()
		},
		ButtonAction::LaunchScript { path: _ } => {
		    let event = Event::ButtonAction { id: mapping.id.clone() };
		    crate::command_handler::broadcast(peers, event);
		},
		ButtonAction::OpenBrowser { url: _ } => {
		    let event = Event::ButtonAction { id: mapping.id.clone() };
		    crate::command_handler::broadcast(peers, event);
		}
	    }
	},
	None => {
	    warn!("Could not find corresponding button action");
	}
    }
}

/// Gets a timestamp in milliseconds
fn get_timestamp() -> u128 {
   let start = SystemTime::now();
   let since_epoch = start
       .duration_since(UNIX_EPOCH)
       .expect("Time went backwards");

   since_epoch.as_millis()
}

/// Appends button press to recorded sequence
fn push_button_press(press_vec: &mut Vec<ButtonPress>, press_duration: u128) {
    if press_duration >= LONG_PRESS_DURATION {
        press_vec.push(ButtonPress::Long);
    } else {
        press_vec.push(ButtonPress::Short);
    }
}

/// Polls GPIO for new button sequences
fn poll(mappings: MappingDirectory, peer_map: crate::PeerMap) -> sysfs_gpio::Result<()> {
    let input = Pin::new(BUTTON_PIN_NUM);
    let mut last_debounce: u128 = 0;
    let mut pressed_time: u128 = 0;
    let mut released_time: u128 = 0;
    let mut press_duration: u128 = 0;
    let mut button_state: bool = false;
    let mut prev_button_state: bool = false;

    let mut last_press_time: u128 = 0;
    let mut button_press_vec = vec![];

    input.with_exported(|| {
        input.set_direction(Direction::In)?;
        let mut prev_val: u8 = 255;

        loop {
            let val = input.get_value()?;

            // Sets last_debounce timestamp on value change
            if val != prev_val {
                last_debounce = get_timestamp();
            }

            // Changes button state based on debouncing
            if (get_timestamp() - last_debounce) > DEBOUNCE_DELAY {
                 button_state = val == 0;
            }

            // Checks for press/release of button
            match (prev_button_state, button_state) {
                (false, true) => {
                    pressed_time = get_timestamp();
                },
                (true, false) => {
                    released_time = get_timestamp();
                    press_duration = released_time - pressed_time;
                    last_press_time = released_time;
                    push_button_press(&mut button_press_vec, press_duration);
                },
                _ => {}
            }

            // Resets button press sequence timer
            if (get_timestamp() - last_press_time) > SEQUENCE_DELAY &&
		!button_press_vec.is_empty() {
                trigger_action(&mappings, &button_press_vec, &peer_map);
                button_press_vec.clear();
            }

            prev_val = val;
            prev_button_state = button_state;
            sleep(Duration::from_millis(10));
        }
    })
}
