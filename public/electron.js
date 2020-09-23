const {app, Menu, BrowserWindow, Tray} = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

let tray = null;
let mainWindow = null;
let electronReady = false;
let daemonReady = false;
let execHandle = null;

let daemonPath = path.resolve(path.join(
    app.getAppPath(),
    "../../bin/",
    "pi-tool-daemon"
));

let trayIconPath = path.join(
    app.getAppPath(),
    "../../public/cm_logo_outline.png"
);

checkRunning((isRunning) => {
	if (isRunning) {
		daemonReady = true;
	} else {
		execHandle = spawn("pkexec", [daemonPath], {detached: true});
		execHandle.stdout.on('data', (data) => {
			const output = data.toString();

			console.log(output);
			if (output.includes("Cooler Master Pi Tool Watcher")) {
				daemonReady = true;
			}
		});
	}
});

function checkRunning(callback) {
	exec('ps -A', (err, stdout, stderr) => {
		callback(stdout.toString().indexOf('pi-tool-daemon') > -1);
	});
}


function createWindow () {
    let mainWindow = new BrowserWindow({
	icon: trayIconPath,
	width: 600,
	height: 800,
	minWidth: 600,
	minHeight: 800,
	show: true,
	resizable: false
    })

    mainWindow.setMenu(null);
    mainWindow.loadFile('build/index.html');

    mainWindow.on('close', (event) => {
	if (!app.isQuitting) {
	    event.preventDefault();
	    mainWindow.hide();
	}

	return false;
    });

    mainWindow.on('minimize', (event) => {
	event.preventDefault();
	mainWindow.hide();
    });

    mainWindow.on('closed', () => {
	mainWindow = null;
    });

    return mainWindow;
}

function launchApplication() {
    mainWindow = createWindow();
    
    const contextMenu = Menu.buildFromTemplate([
	{ label: 'Open', click: () => {
	    mainWindow.show();
	}},
	{ label: 'Separator', type: 'separator' },
	{ label: 'Quit', click: () => {
	    app.isQuitting = true;
	    //execHandle.kill();
	    app.quit();
	}}
    ]);
    tray = new Tray(trayIconPath);
    tray.setToolTip('Cooler Master Pi Tool');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
	mainWindow.show();
    });
}

function checkStart() {
   if (electronReady && daemonReady) {
	   launchApplication();
   } else {
	   setTimeout(checkStart, 100);
   }
}

app.on('ready', () => {
    electronReady = true;
    checkStart();
});
