const {app, Menu, BrowserWindow, Tray} = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;

let daemonPath = path.join(
    app.getAppPath(),
    "../../bin/",
    "pi-tool-daemon"
);

let trayIconPath = path.join(
    app.getAppPath(),
    "../../public/cm_logo_outline.png"
);

let execHandle = spawn(daemonPath);
execHandle.stdout.pipe(process.stdout);

let tray = null;
let mainWindow = null;

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

app.on('ready', () => {
    mainWindow = createWindow();
    
    const contextMenu = Menu.buildFromTemplate([
	{ label: 'Open', click: () => {
	    mainWindow.show();
	}},
	{ label: 'Separator', type: 'separator' },
	{ label: 'Quit', click: () => {
	    app.isQuitting = true;
	    execHandle.kill();
	    app.quit();
	}}
    ]);
    tray = new Tray(trayIconPath);
    tray.setToolTip('Cooler Master Pi Tool');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
	mainWindow.show();
    });
});
