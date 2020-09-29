import isElectron from 'is-electron';
import { persistor } from '../index';

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

export const flushStore = async () => {
    console.log("Flushing store");
    await persistor.flush();

    if (isElectron()) {
        const { session } = window.require('electron');
        session.flushStorageData();
    }
}
