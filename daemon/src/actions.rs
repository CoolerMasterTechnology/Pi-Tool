use std::process::Command;
use std::result::Result;
use log::*;

/// Shuts down the system
pub fn shutdown() -> Result<(), String> {
    info!("Shutting down system");

    if cfg!(feature="raspberry") {
	if let Err(_e) = Command::new("sudo").args(&["shutdown", "-h", "now"]).spawn() {
	    warn!("Failed to shut down system");
	}
    }

    Ok(())
}

/// Reboots the system
pub fn reboot() -> Result<(), String> {
    info!("Rebooting system");

    if cfg!(feature="raspberry") {
	if let Err(_e) = Command::new("sudo").args(&["reboot"]).spawn() {
	    warn!("Failed to reboot system");
	} 
    }

    Ok(())
}
