const { contextBridge, ipcRenderer} = require("electron")
const dayjs = require('dayjs')
const Store = require("electron-store")
const {start, stop, writeCommand, connect, isOledOn, getKBD} = require(`${__dirname}/qmkrcd`)
let store

const params = {
    isQmkrcdStart: false,
    lastLayer: 0,
    connect: false,
    onWindowName: "",
    lastWindowName: "",
    dt: ""
}

const command = {
    start: (kbd) => start(kbd),
    stop: () => stop,
    switchLayer: (n) => writeCommand({ id :34, data :[n]}),
    setOledState: async () => {
        writeCommand({ id :36 })
        await sleep(300)
    },
    oledWrite: (str) => writeCommand({ id :23, data :str }),
    isServerConnect: () => true,
    getConnectDevice: () =>  store && store.get('devices') ? store.get('devices').find(d => d.priority === 0) : undefined,
    getDevices: () => store ? store.get('devices') : undefined,
    setDevices: (obj) =>  store ? store.set('devices', obj) : undefined,
    setActiveWindow: () => ipcRenderer.send("setActiveWindow"),
    changeActiveWindow: () => ipcRenderer.send("changeActiveWindow", params.onWindowName),
    checkingIsConnect: (c) => ipcRenderer.send("checkingIsConnect", c)
}

process.once('loaded', async () => {
    global.ipcRenderer = ipcRenderer
    contextBridge.exposeInMainWorld(
        "api", {
            initStore: initStore,
            qmkrcdStart: qmkrcdStart,
            qmkrcdStop: command.stop,
            keyboardSendLoop: keyboardSendLoop,
            getConnectDevice: command.getConnectDevice,
            getDevices: command.getDevices,
            setDevices: command.setDevices,
            send: (channel, data) => ipcRenderer.send(channel, data),
            on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
        })
})

const sleep = async (msec) => new Promise(resolve => setTimeout(resolve, msec))
const initStore = () => store = new Store()
const qmkrcdStart = (device) => {
    const kbd = getKBD(device)
    if(!!kbd) command.start(kbd)
}

const keyboardSendLoop = async () => {
    const device = command.getConnectDevice()
    await command.setActiveWindow()
    const l = device ? device.layers.find(l => l.name === params.onWindowName) : ""
    const currentLayer = l ? l.layer : 0
    if (params.lastWindowName !== params.onWindowName) await command.changeActiveWindow()

    const c = connect()
    if(params.connect !== c ) await command.checkingIsConnect(c)
    params.connect = c
    const isConnectFn = async () => {
        if (params.lastWindowName !== params.onWindowName && params.lastLayer !== currentLayer) command.switchLayer(currentLayer)
        await oledWriteNow(device)
    }
    c ? await isConnectFn() : qmkrcdStart(device)

    params.lastWindowName = params.onWindowName
    params.lastLayer = currentLayer
}

const oledWriteNow = async (device) => {
    const now = dayjs().format('YYYY/MM/DD ddd HH:mm ')
    if(device && device.oledClock && params.dt !== now) {
        await command.setOledState()
        if(isOledOn()) command.oledWrite(now)
        params.dt = now
    }
}

ipcRenderer.on("getActiveWindow",  (e, data) => {
    if(data) params.onWindowName = data
})
