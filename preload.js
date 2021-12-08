const {contextBridge, ipcRenderer} = require("electron")
const dayjs = require('dayjs')
const Store = require("electron-store")
const {start, stop, writeCommand, connect, isOledOn, getKBDList, typeId} = require(`${__dirname}/qmkrcd`)
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
    switchLayerStart: (kbd) => start(deviceType.switchLayer, kbd),
    switchLayerStop: (kbd) => stop(deviceType.switchLayer, kbd),
    oledClockStart: (kbd) => start(deviceType.oledClock, kbd),
    oledClockStop: (kbd) => stop(deviceType.oledClock, kbd),
    switchLayer: (kbd, n) => writeCommand(deviceType.switchLayer, kbd, {id: 34, data: [n]}),
    setOledState: async (kbd) => {
        writeCommand(deviceType.oledClock, kbd, {id: 36})
        await sleep(300)
    },
    oledWrite: (kbd, str) => writeCommand(deviceType.oledClock, kbd, {id: 23, data: str}),
    getConnectDevices: (type) => {
        if(store) {
            if(type === deviceType.switchLayer) return store.get('devices').filter(d => d.onSwitchLayer === 1 && d.type === type)
            return store.get('devices').filter(d => d.onOledClock === 1 && d.type === type)
        }
        return undefined
    },
    getConnectDevice: (type) => {
        if(store) {
            if(type === deviceType.switchLayer) return store.get('devices').find(d => d.onSwitchLayer === 1 && d.type === type)
            return store.get('devices').find(d => d.onOledClock === 1 && d.type === type)
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
            typeId: typeId,
            switchLayerStart: command.switchLayerStart,
            switchLayerStop: command.switchLayerStop,
            oledClockStart: command.oledClockStart,
            oledClockStop: command.oledClockStop,
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

const keyboardSendLoop = async () => {
    const switchLayerFn = async () => {
        const allDevice = command.getDevices().filter(d => d.type === deviceType.switchLayer)
        const switchLayerDevices = command.getConnectDevices(deviceType.switchLayer)
        switchLayerDevices.map( async device => {
            const l = device ? device.layers.find(l => l.name === params.onWindowName) : ""
            const currentLayer = l ? l.layer : 0
            await command.setActiveWindow()
            if (params.lastWindowName !== params.onWindowName) await command.changeActiveWindow()
            const id = typeId(deviceType.switchLayer, device)

            const connectSwitchLayer = connect(id)
            if (params.connect[id] !== connectSwitchLayer) {
                await command.connectSwitchLayer({kbd: device, isConnected:connectSwitchLayer})
                if(connectSwitchLayer) {
                    const l = device.layers.find(l => osSwitchKeys.includes(l.name))
                    const os = process.platform
                    if(l && l.name === "os:win" && os === "win32") command.switchLayer(device, l.layer)
                    if(l && l.name === "os:mac" && os === "darwin") command.switchLayer(device, l.layer)
                    if(l && l.name === "os:linux" && os === "linux") command.switchLayer(device, l.layer)
                }
            }
            params.connect[id] = connectSwitchLayer

            if (connectSwitchLayer) {
                if (params.lastWindowName !== params.onWindowName && params.lastLayer[id] !== currentLayer) {
                    command.switchLayer(device, currentLayer)
                }
            } else {
                command.switchLayerStart(device)
            }
            params.lastLayer[id] = currentLayer
        })
        allDevice
            .filter(d => !switchLayerDevices.find(s => s.id === d.id))
            .map(d => delete params.connect[typeId(deviceType.switchLayer, d)])
    }

    const oledClockFn = async () => {
        const oledClockDevices = command.getConnectDevices(deviceType.oledClock)
        oledClockDevices.map( async device => {
            const id = typeId(deviceType.oledClock, device)
            const connectOledClock = connect(id)
            if (params.connect[id] !== connectOledClock) await command.connectOledClock({kbd: device, isConnected: connectOledClock})
            params.connect[id] = connectOledClock
            connectOledClock ? await oledWriteNow(device) : command.oledClockStart(device)
        })
    }

    await switchLayerFn()
    await oledClockFn()
    params.lastWindowName = params.onWindowName
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
