const {contextBridge, ipcRenderer} = require("electron")
const dayjs = require('dayjs')
const Store = require("electron-store")
const {start, stop, writeCommand, connect, isOledOn, getKBDList} = require(`${__dirname}/qmkrcd`)
let store

const deviceType = {
    switchLayer: "switchLayer",
    oledClock: "oledClock"
}

const params = {
    lastLayer: 0,
    connect: false,
    onWindowName: "",
    lastWindowName: "",
    dt: ""
}

const command = {
    switchLayerStart: (kbd) => start(deviceType.switchLayer, kbd),
    switchLayerStop: () => stop(deviceType.switchLayer),
    oledClockStart: (kbd) => start(deviceType.oledClock, kbd),
    oledClockStop: () => stop(deviceType.oledClock),
    switchLayer: (n) => writeCommand(deviceType.switchLayer, {id: 34, data: [n]}),
    setOledState: async () => {
        writeCommand(deviceType.oledClock, {id: 36})
        await sleep(300)
    },
    oledWrite: (str) => writeCommand(deviceType.oledClock, {id: 23, data: str}),
    isServerConnect: () => true,
    getConnectDevice: (type) => store && store.get('devices') ? store.get('devices').find(d => d.priority === 0 && d.type === type) : undefined,
    getDevices: () => store ? store.get('devices') : undefined,
    setDevices: (obj) => store ? store.set('devices', obj) : undefined,
    setActiveWindow: () => ipcRenderer.send("setActiveWindow"),
    changeActiveWindow: () => ipcRenderer.send("changeActiveWindow", params.onWindowName),
    connectSwitchLayer: (c) => ipcRenderer.send("connectSwitchLayer", c),
    connectOledClock: (c) => ipcRenderer.send("connectOledClock", c)
}

process.once('loaded', async () => {
    global.ipcRenderer = ipcRenderer
    contextBridge.exposeInMainWorld(
        "api", {
            initStore: initStore,
            deviceType: deviceType,
            switchLayerStart: command.switchLayerStart,
            switchLayerStop: command.switchLayerStop,
            oledClockStart: command.oledClockStart,
            oledClockStop: command.oledClockStop,
            keyboardSendLoop: keyboardSendLoop,
            getConnectDevice: command.getConnectDevice,
            getDevices: command.getDevices,
            setDevices: command.setDevices,
            getKBDList: getKBDList,
            send: (channel, data) => ipcRenderer.send(channel, data),
            on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
        })
})

const sleep = async (msec) => new Promise(resolve => setTimeout(resolve, msec))
const initStore = () => store = new Store()

const keyboardSendLoop = async () => {
    const switchLayerFn = async () => {
        const switchLayerDevice = command.getConnectDevice(deviceType.switchLayer)
        const l = switchLayerDevice ? switchLayerDevice.layers.find(l => l.name === params.onWindowName) : ""
        const currentLayer = l ? l.layer : 0
        await command.setActiveWindow()
        if (params.lastWindowName !== params.onWindowName) await command.changeActiveWindow()
        const connectSwitchLayer = connect(deviceType.switchLayer)
        if (params.connect[deviceType.switchLayer] !== connectSwitchLayer) await command.connectSwitchLayer(connectSwitchLayer)
        params.connect[deviceType.switchLayer] = connectSwitchLayer

        if (connectSwitchLayer) {
            if (params.lastWindowName !== params.onWindowName && params.lastLayer !== currentLayer) {
                command.switchLayer(currentLayer)
            }
        } else {
            command.switchLayerStart(switchLayerDevice)
        }
        params.lastLayer = currentLayer
    }

    const oledClockFn = async () => {
        const oledClockDevice = command.getConnectDevice(deviceType.oledClock)
        const connectOledClock = connect(deviceType.oledClock)
        if (params.connect[deviceType.oledClock] !== connectOledClock) await command.connectOledClock(connectOledClock)
        params.connect[deviceType.oledClock] = connectOledClock
        connectOledClock ? await oledWriteNow() : command.oledClockStart(oledClockDevice)
    }

    await switchLayerFn()
    await oledClockFn()
    params.lastWindowName = params.onWindowName
}

const oledWriteNow = async () => {
    const now = dayjs().format('YYYY/MM/DD ddd HH:mm ')
    if (params.dt !== now) {
        await command.setOledState()
        if (isOledOn()) command.oledWrite(now)
        params.dt = now
    }
}

ipcRenderer.on("getActiveWindow", (e, data) => {
    if (data) params.onWindowName = data
})

ipcRenderer.on("quit", () => command.stop())
