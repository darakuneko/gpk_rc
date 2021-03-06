const {app, BrowserWindow, ipcMain, Tray, Menu} = require("electron")
const activeWindows = require('active-win')
const { windowManager } = require("node-window-manager");
windowManager.requestAccessibility()

let mainWindow
let tray = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: `${__dirname}/icons/icon-256x256.png`,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
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
        }
        return false
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
                app.quit()
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

ipcMain.on("connectSwitchLayer", (e, data) => {
    mainWindow.webContents.send("isConnectSwitchLayer", data)
})

ipcMain.on("connectOledClock", (e, data) => {
    mainWindow.webContents.send("isConnectOledClock", data)
})

ipcMain.on("changeActiveWindow", (e, data) => {
    mainWindow.webContents.send("activeWindow", data)
})

ipcMain.on("setActiveWindow", async () => {
    const getWindowName = async () => {
        if (process.platform === 'darwin') {
            const window = windowManager.getActiveWindow();
            return window.path.replaceAll(/.*\/|.app$/g,"")
        } else {
            const result = await activeWindows()
            if(result) return result.owner.name
        }
        return ""
    }
    mainWindow.webContents.send("getActiveWindow", await getWindowName())
})

ipcMain.on("onWindowShow", async () => {
    mainWindow.webContents.send("windowShow", true)
})

ipcMain.on("setAppVersion", async () => {
    mainWindow.webContents.send("getAppVersion", app.getVersion())
})
