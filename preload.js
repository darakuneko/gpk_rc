const {contextBridge, ipcRenderer} = require("electron")
const dayjs = require('dayjs')
const Store = require("electron-store")
const {start, stop, writeCommand, connect, isOledOn, getKBDList, deviceId} = require(`${__dirname}/qmkrcd`)
let store

const deviceType = {
    switchLayer: "switchLayer",
    oledClock: "oledClock"
}

const params = {
    lastLayer: {},
    connect: {},
    onWindowName: "",
    lastWindowName: "",
    dt: "",
    storePath: ""
}

const osSwitchKeys = ["os:win", "os:mac", "os:linux"]

const command = {
    start: (kbd) => {
        start(kbd)
        switchOSlayer(kbd)
    },
    stop: (kbd) => stop(kbd),
    switchLayer: (kbd, n) => writeCommand(kbd, {id: 34, data: [n]}),
    setOledState: async (kbd) => {
        writeCommand(kbd, {id: 36})
        await sleep(300)
    },
    oledWrite: (kbd, str) => writeCommand(kbd, {id: 23, data: str}),
    getConnectDevices: (type) => {
        const connectDevices = store.get('devices')
        if (connectDevices) {
            if (type === deviceType.switchLayer) {
                return connectDevices.filter(d => d.onSwitchButton === 1 && d.type === type)
            }
            return connectDevices.filter(d => d.onSwitchButton === 1 && d.type === type)
        }

        return undefined
    },
    getConnectDevice: (type) => {
        if (store) {
            if (type === deviceType.switchLayer) return store.get('devices').find(d => d.onSwitchButton === 1 && d.type === type)
            return store.get('devices').find(d => d.onSwitchButton === 1 && d.type === type)
        }
        return undefined
    },
    getDevices: () => store ? store.get('devices') : undefined,
    setDevices: (obj) => store ? store.set('devices', obj) : undefined,
    setActiveWindow: () => ipcRenderer.send("setActiveWindow"),
    changeActiveWindow: () => ipcRenderer.send("changeActiveWindow", params.onWindowName),
    connectSwitchLayer: (dat) => ipcRenderer.send("connectSwitchLayer", dat),
    connectOledClock: (dat) => ipcRenderer.send("connectOledClock", dat)
}

process.once('loaded', async () => {
    global.ipcRenderer = ipcRenderer
    contextBridge.exposeInMainWorld(
        "api", {
            initStore: initStore,
            storePath: () => params.storePath,
            deviceType: deviceType,
            deviceId: deviceId,
            start: command.start,
            stop: command.stop,
            keyboardSendLoop: keyboardSendLoop,
            getConnectDevice: command.getConnectDevice,
            getConnectDevices: command.getConnectDevices,
            getDevices: command.getDevices,
            setDevices: command.setDevices,
            getKBDList: getKBDList,
            send: (channel, data) => ipcRenderer.send(channel, data),
            on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
        })
})

const sleep = async (msec) => new Promise(resolve => setTimeout(resolve, msec))
const initStore = () => {
    store = new Store()
    params.storePath = store.path
    return store
}

const switchOSlayer = (device) => {
    if(device.type === deviceType.switchLayer){
        const l = device.layers.find(l => osSwitchKeys.includes(l.name))
        const os = process.platform
        const isChangeOSLayer = (l && l.name === "os:win" && os === "win32" ||
            l && l.name === "os:mac" && os === "darwin"||
            l && l.name === "os:linux" && os === "linux")

        if(isChangeOSLayer) command.switchLayer(device, l.layer)
    }
}

const switchLayer = (device) => {
    const id = deviceId(device)
    const osLayer = device ? device.layers.find(l => osSwitchKeys.includes(l.name)) : ""
    const appLayer = device ? device.layers.find(l => l.name === params.onWindowName) : ""
    const currentLayer = appLayer ? appLayer.layer : 0
    if (params.lastWindowName !== params.onWindowName && params.lastLayer[id] !== currentLayer) {
        currentLayer === 0 && osLayer ? switchOSlayer(device) : command.switchLayer(device, currentLayer)
    }
    params.lastLayer[id] = currentLayer
}

const keyboardSendLoop = async () => {

    const switchLayerFn = async () => {
        const allDevice = command.getDevices().filter(d => d.type === deviceType.switchLayer)
        const switchLayerDevices = command.getConnectDevices(deviceType.switchLayer)
        switchLayerDevices.map(async device => {
            const id = deviceId(device)
            const connectSwitchLayer = connect(id)
            if (params.connect[id] !== connectSwitchLayer) {
                await command.connectSwitchLayer({kbd: device, isConnected: connectSwitchLayer})
                if (connectSwitchLayer) switchOSlayer(device)
            }
            params.connect[id] = connectSwitchLayer
            connectSwitchLayer ? switchLayer(device) : command.start(device)
        })
        allDevice
            .filter(d => !switchLayerDevices.find(s => s.id === d.id))
            .map(d => delete params.connect[deviceId(d)])
    }

    const oledClockFn = async () => {
        const oledClockDevices = command.getConnectDevices(deviceType.oledClock)
        oledClockDevices.map(async device => {
            const id = deviceId(device)
            const connectOledClock = connect(id)
            if (params.connect[id] !== connectOledClock) await command.connectOledClock({
                kbd: device,
                isConnected: connectOledClock
            })
            params.connect[id] = connectOledClock
            connectOledClock ? await oledWriteNow(device) : command.start(device)
        })
    }

    const activeWindowNameFn = async () => {
        if (params.lastWindowName !== params.onWindowName) await command.changeActiveWindow()
        params.lastWindowName = params.onWindowName
    }

    await command.setActiveWindow()
    await sleep(100)
    await switchLayerFn()
    await oledClockFn()
    await activeWindowNameFn()
}

const oledWriteNow = async (kbd) => {
    const now = dayjs().format('YYYY/MM/DD ddd HH:mm ')
    if (params.dt !== now) {
        await command.setOledState(kbd)
        if (isOledOn()) command.oledWrite(kbd, now)
        params.dt = now
    }
}

ipcRenderer.on("getActiveWindow", (e, data) => {
    if (data) params.onWindowName = data
})

ipcRenderer.on("quit", () => command.stop())
