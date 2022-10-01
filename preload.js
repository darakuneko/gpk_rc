const { app, contextBridge, ipcRenderer } = require('electron')

const osSwitchKeys = ["os:win", "os:mac", "os:linux"]

const deviceTypeKeys = {
    switchLayer: "switchLayer",
    oledClock: "oledClock"
}

const params = {
    lastLayer: {},
    connect: {
        switchLayer: {},
        oledClock: {}
    },
    onWindowName: "",
    lastWindowName: "",
    dt: "",
    storePath: "",
    appVersion: ""
}

const storeDevice = {
    exitsStore: async () => await ipcRenderer.invoke('exitsStore'),
    setStoreDevice: async (device) => await ipcRenderer.invoke('setStoreDevice', device),
    getStoreAllDevices: async () => await ipcRenderer.invoke('getStoreAllDevices'),
    getStorePath: async () => await ipcRenderer.invoke('getStorePath'),
}

const command = {
    deviceId: async (device) => await ipcRenderer.invoke('deviceId', device),
    start: async (device) => {
        await ipcRenderer.invoke('start', device)
        await switchOSlayer(device)
    },
    stop: async (device) => await ipcRenderer.invoke('stop', device),
    close: async () => await ipcRenderer.invoke('close'),
    switchLayer: async (device, n) => await ipcRenderer.invoke('switchLayer', {device: device, n: n}),
    isOledOn: async () => await ipcRenderer.invoke('isOledOn'),
    setOledState: async (device) => await ipcRenderer.invoke('setOledState', device),
    oledWrite: async (device, now) => await ipcRenderer.invoke('oledWrite', {device: device, now: now}),
    getKBDList: async () => await ipcRenderer.invoke('getKBDList'),
    connect: async (id) => await ipcRenderer.invoke('connect', id),
    getStoreAllDevices: async () => await storeDevice.getStoreAllDevices(),
    getConnectDevices: async (type) => {
        const connectDevices = await storeDevice.getStoreAllDevices()
        const get = () => {
            if (connectDevices) {
                if (type === deviceTypeKeys.switchLayer) return connectDevices.filter(d => d.onSwitchButton === 1 && d.type === type)
                return connectDevices.filter(d => d.onSwitchButton === 1 && d.type === type)
            }
            return undefined
        }
        return get(connectDevices)
    },
    getConnectDevice: async (type) => {
        const exitsStore = await storeDevice.exitsStore()
        if (exitsStore) {
            const devices = await storeDevice.getStoreAllDevices()
            if (type === deviceTypeKeys.switchLayer) {
                return devices.find(d => d.onSwitchButton === 1 && d.type === type)
            }
            return devices.find(d => d.onSwitchButton === 1 && d.type === type)
        }
        return undefined
    },
    getDevices: async () => {
        const exitsStore = await storeDevice.exitsStore()
        return exitsStore ? await storeDevice.getStoreAllDevices() : undefined
    },
    setDevices: async (device) => {
        const exitsStore = await storeDevice.exitsStore()
        return exitsStore ? await storeDevice.setStoreDevice(device) : undefined
    },
    setActiveWindow: () => ipcRenderer.send("setActiveWindow"),
    changeActiveWindow: () => ipcRenderer.send("changeActiveWindow", params.onWindowName),
    connectDevice: (dat) => ipcRenderer.send("connectDevice", dat),
    sleep: async (msec) => await ipcRenderer.invoke('sleep', msec),
    now: async () => await ipcRenderer.invoke('now'),
    connect: async (id) => await ipcRenderer.invoke('connect', id),
    getAppVersion: async () => await ipcRenderer.invoke('getAppVersion'),
    exitsStore: storeDevice.exitsStore,
    setStoreDevice: storeDevice.setStoreDevice,
    getStoreAllDevices: storeDevice.getStoreAllDevices,
    getStorePath: storeDevice.getStorePath,
}

process.once('loaded', async () => {
    global.ipcRenderer = ipcRenderer
    await getAppVersion()
    await getStorePath()
    contextBridge.exposeInMainWorld(
        "api", {
            appVersion: () => params.appVersion,
            storePath: () => params.storePath,
            deviceType: deviceTypeKeys,
            start: async (device) => await command.start(device),
            stop: async (device) => await command.stop(device),
            keyboardSendLoop: keyboardSendLoop,
            getConnectDevice: command.getConnectDevice,
            getConnectDevices: command.getConnectDevices,
            getStoreAllDevices: command.getStoreAllDevices,
            getDevices: command.getDevices,
            setDevices: command.setDevices,
            getKBDList: command.getKBDList,
            send: (channel, data) => ipcRenderer.send(channel, data),
            on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
        })
})

const getAppVersion = async () => {
    params.appVersion = await command.getAppVersion()
}

const getStorePath = async () => {
    params.storePath = await command.getStorePath()
}

const switchLayer = async (device) => {
    const id = await command.deviceId(device)
    const osLayer = device ? device.layers.find(l => osSwitchKeys.includes(l.name)) : ""
    const appLayer = device ? device.layers.find(l => l.name === params.onWindowName) : ""
    const currentLayer = appLayer ? appLayer.layer : 0
    if (params.lastWindowName !== params.onWindowName && params.lastLayer[id] !== currentLayer) {
        currentLayer === 0 && osLayer ? await switchOSlayer(device) : await command.switchLayer(device, currentLayer)
    }
    params.lastLayer[id] = currentLayer
}

const switchOSlayer = async (device) => {
    if(device.type === deviceTypeKeys.switchLayer){
        const l = device.layers.find(l => osSwitchKeys.includes(l.name))
        const os = process.platform
        const isChangeOSLayer = (l && l.name === "os:win" && os === "win32" ||
            l && l.name === "os:mac" && os === "darwin"||
            l && l.name === "os:linux" && os === "linux")

        if(isChangeOSLayer) await command.switchLayer(device, l.layer)
    }
}

const keyboardSendLoop = async () => {

    const switchLayerFn = async () => {
        const devices = await command.getDevices()
        const switchLayerDevices = await command.getConnectDevices(deviceTypeKeys.switchLayer)
        if(switchLayerDevices) {
            await Promise.all(switchLayerDevices.map(async device => {
                const id = await command.deviceId(device)
                const connectSwitchLayer = await command.connect(id)
                if (params.connect.switchLayer[id] !== connectSwitchLayer) {
                    await command.connectDevice({kbd: device, isConnected: connectSwitchLayer})
                    if (connectSwitchLayer) await switchOSlayer(device)
                }
                params.connect.switchLayer[id] = connectSwitchLayer
                connectSwitchLayer ? await switchLayer(device) : await command.start(device)
            }))
        }
        const allDevice = devices ? devices.filter(d => d.type === deviceTypeKeys.switchLayer) : undefined
        if(allDevice) {
            await Promise.all(allDevice
                .filter(d => !switchLayerDevices.find(s => s.id === d.id))
                .map(async d => delete params.connect.switchLayer[await command.deviceId(d)]))
        }
    }

    const oledClockFn = async () => {
        const oledClockDevices = await command.getConnectDevices(deviceTypeKeys.oledClock)
        if(oledClockDevices) {
            await Promise.all(oledClockDevices.map(async device => {
                const id = await command.deviceId(device)
                const connectOledClock = await command.connect(id)
                if (params.connect.oledClock[id] !== connectOledClock) await command.connectDevice({
                    kbd: device,
                    isConnected: connectOledClock
                })
                params.connect.oledClock[id] = connectOledClock
                connectOledClock ? await oledWriteNow(device) : await command.start(device)
            }))
        }
        const devices = await command.getDevices()
        const allDevice = devices ? devices.filter(d => d.type === deviceTypeKeys.oledClock) : undefined
        if(allDevice) {
            await Promise.all(allDevice
                .filter(d => !oledClockDevices.find(s => s.id === d.id))
                .map(async d => delete params.connect.oledClock[await command.deviceId(d)]))
        }
    }

    const activeWindowNameFn = async () => {
        if (params.lastWindowName !== params.onWindowName) await command.changeActiveWindow()
        params.lastWindowName = params.onWindowName
    }

    await command.setActiveWindow()
    await command.sleep(100)
    await switchLayerFn()
    await oledClockFn()
    await activeWindowNameFn()
}

const oledWriteNow = async (kbd) => {
    const now = await command.now();
    if (params.dt !== now) {
        await command.setOledState(kbd)
        if (await command.isOledOn()) await command.oledWrite(kbd, now)
        params.dt = now
    }
}

ipcRenderer.on("getActiveWindow", (e, data) => {
    if (data) params.onWindowName = data
})
