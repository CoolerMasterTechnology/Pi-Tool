use serde_derive::{Serialize, Deserialize};
use crate::mapping::{Mapping, ButtonAction, ButtonPress};
use std::result::Result;

#[derive(Serialize, Deserialize, Debug)]
pub struct ButtonActionRepr {
    pub identifier: u32,
    #[serde(default)] 
    pub url: Option<String>,
    #[serde(default)] 
    #[serde(rename = "scriptPath")] 
    pub script_path: Option<String>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MappingRepr {
    #[serde(rename = "buttonPresses")] 
    pub button_presses: Vec<u8>,
    #[serde(rename = "buttonAction")] 
    pub button_action: ButtonActionRepr,
    pub active: bool
}

impl ButtonActionRepr {
    pub fn to_action(&self) -> Result<ButtonAction, String> {
	match self.identifier {
	    0 => Ok(ButtonAction::Shutdown),
	    1 => Ok(ButtonAction::Reboot),
	    2 => Ok(ButtonAction::LaunchScript {
		path: self.script_path.as_ref().expect("could not find script path").clone()
	    }),
	    3 => Ok(ButtonAction::OpenBrowser {
		url: self.url.as_ref().expect("could not find URL").clone()
	    }),
	    _ => Err("Failed to parse action".to_string())
	}
    }
}

impl MappingRepr {
    pub fn to_mapping(&self, id: &str) -> Mapping {
	let presses = self.button_presses.iter().map(|x| ButtonPress::from_num(*x)).collect();
	let action = self.button_action.to_action().unwrap();

	Mapping {
	    id: id.to_string(),
	    button_presses: presses,
	    button_action: action,
	    active: self.active
	}
    }
}
