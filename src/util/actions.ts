import isElectron from 'is-electron';

export const launchScript = (path: string) => {
    console.log("Launching script");

    if (isElectron()) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('launch-script', path)
    }
}

export const openBrowser = (url: string) => {
    console.log("Opening browser");

    if (isElectron()) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('open-browser', url)
    }
}
