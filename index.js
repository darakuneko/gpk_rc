const {app, BrowserWindow, ipcMain, Tray, Menu} = require("electron")
const activeWindows = require('active-win')

let mainWindow
let tray = null
let timer
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
        event.preventDefault()
        mainWindow.hide()
    })

    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault()
            mainWindow.hide()
        }
        return false
    })
}

const doubleBoot = app.requestSingleInstanceLock()
if (!doubleBoot) app.quit()

app.on('ready', () => {
    if (process.platform === 'darwin') app.dock.hide()
    tray = new Tray(`${__dirname}/icons/icon-72x72.${process.platform === 'win32' ? 'ico' : 'png'}`)
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'settings',
            click: () => {
                mainWindow.show()
                mainWindow.focus()
            }
        }, {
            type: 'separator'
        }, {
            label: 'Exit',
            click: () => {
                app.isQuiting = true
                clearInterval(timer)
                app.quit()
            }
        }
    ]))

    createWindow()
    //mainWindow.webContents.openDevTools()
})

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
    const result = await activeWindows()
    mainWindow.webContents.send("getActiveWindow", result ? result.owner.name : "")
})

ipcMain.on("setTimer", async (e, data) => {
    timer = data
})