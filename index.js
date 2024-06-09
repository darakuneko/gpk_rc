import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import ActiveWindow from '@paymoapp/active-window'
import dayjs from 'dayjs'
import Store from 'electron-store'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { start, stop, close, writeCommand, getConnect, getIsOledOn, getGpkRCVersion, getKBDList, deviceId } from './qmkrcd.js'

ActiveWindow.default.initialize()

let store

let mainWindow
let tray = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1000,
        icon: `${__dirname}/icons/icon-256x256.png`,
        webPreferences: {
            preload: __dirname + '/preload.js',
            backgroundThrottling: false,
        },
        show: false,
    })

    mainWindow.loadURL(`file://${__dirname}/public/index.html`)
    mainWindow.setMenu(null)

    mainWindow.on('minimize', (event) => {
        mainWindowHide(event, mainWindow)
    })

    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            mainWindowHide(event, mainWindow)
            return false
        } else {
            try {
                app.quit()
            } catch (e) {
                console.log(e)
                process.exit(1)
            }
        }
    })
}

const doubleBoot = app.requestSingleInstanceLock()
if (!doubleBoot) app.quit()

app.on('ready', () => {
    if (process.platform === 'darwin') app.dock.hide()
    const icon = () => {
        if(process.platform==='win32') return "icon-72x72.ico"
        if(process.platform==='darwin') return "tray.png"
        return "icon-72x72.png"
    }
    store = new Store()
    tray = new Tray(`${__dirname}/icons/${icon()}`)
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'settings',
            click: () => {
                mainWindowShow(mainWindow)
            }
        }, {
            type: 'separator'
        }, {
            label: 'Exit',
            click: () => {
                app.isQuiting = true
                close()
                mainWindow.close()
            }
        }
    ]))
    tray.on('double-click', () => {
        mainWindowShow(mainWindow)
    })
    createWindow()
    //mainWindow.webContents.openDevTools()
})

const mainWindowShow = (mainWindow) => {
    mainWindow.show()
    mainWindow.focus()
    mainWindow.webContents.send("mainWindowShow", true)
}

const mainWindowHide = (event, mainWindow) => {
    event.preventDefault()
    mainWindow.hide()
    mainWindow.webContents.send("mainWindowShow", false)
}

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})


ipcMain.on("connectDevice", (e, data) => {
    mainWindow.webContents.send("isConnectDevice", data)
})

ipcMain.on("changeActiveWindow", (e, data) => {
    mainWindow.webContents.send("activeWindow", data)
})

ipcMain.on("setActiveWindow", async () => {
    const getWindowName = async () => {
        let activeWin
        try {
           activeWin = ActiveWindow.default.getActiveWindow();
        } catch (e) {}
        return Promise.resolve(activeWin ? activeWin.application : "") 
    }
    mainWindow.webContents.send("getActiveWindow", await getWindowName())
})

ipcMain.on("onWindowShow", async () => {
    mainWindow.webContents.send("windowShow", true)
})

const sleep = async (msec) => new Promise(resolve => setTimeout(resolve, msec))

const  commandId = (device) => getGpkRCVersion(device) === 0 ? {
    oledWrite: 23,
    switchLayer:  34,
    setOledState: 36,
    gpkRCVersion: 117
}  : {
    oledWrite: 103,
    switchLayer:  114,
    setOledState: 116,
    gpkRCVersion: 117
}

ipcMain.handle('deviceId', async (event, device) => await deviceId(device))

ipcMain.handle('start', async (event,device) => {
    await start(device, process.platform)
    await writeCommand(device, {id: commandId(device).gpkRCVersion })
})
ipcMain.handle('stop', async (event, device) => {
    await stop(device)
})
ipcMain.handle('getKBDList',  (event) => getKBDList())
ipcMain.handle('connect',  (event, id) => getConnect(id))
ipcMain.handle('switchLayer', async (event, obj) => {
    await writeCommand(obj.device, {id: commandId(obj.device).switchLayer, data: [obj.n]})
})
ipcMain.handle('isOledOn', (event) => getIsOledOn())
ipcMain.handle('setOledState', async (event, device) => {
    await writeCommand(device, {id: commandId(device).setOledState})
    await sleep(300)
})
ipcMain.handle('oledWrite', async (event, obj) => {
    await writeCommand(obj.device, {id: commandId(obj.device).oledWrite, data: obj.now})
})
ipcMain.handle('sleep', async (event, msec) => {
    await sleep(msec)
})
ipcMain.handle('now', async (event) => await dayjs().format('YYYY/MM/DD ddd HH:mm '))
ipcMain.handle('exitsStore',  async (event) => !!store)
ipcMain.handle('setStoreDevice',  async (event, device) => {
    if(store && device) {
        await store.set('devices', device)
    }
})
ipcMain.handle('getStoreAllDevices',  async (event) => {
    if(store) return await store.get('devices')
})

ipcMain.handle('getStorePath',  async (event) => store.path)

ipcMain.handle("getAppVersion", async () => app.getVersion())