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

/// Launches a custom script located at `path`
pub fn launch_script(path: &str) -> Result<(), String> {
    info!("Launching script {}", &path);

    if cfg!(feature="raspberry") {
	if let Err(_e) = Command::new(path).spawn() {
	    warn!("Failed to launch script");
	} 
    }

    Ok(())
}

/// Opens the given `url` in the browser
pub fn open_browser(url: &str) -> Result<(), String> {
    info!("Opening URL {} in browser", &url);

    if cfg!(feature="raspberry") {
	if let Err(_e) = Command::new("chromium-browser").args(&[url]).spawn() {
	    warn!("Failed to open URL in browser");
	} 
    }

    Ok(())
}
