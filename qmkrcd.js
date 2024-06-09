import HID from 'node-hid'

const PACKET_PADDING = 64

const dataToBytes = (data) => typeof data === 'string' ? strToBytes(data) : data

const strToBytes = (str) => [...str.split('').map(c => c.charCodeAt(0)), 0]

const lengthToBytes = (length) => {
    const lengthBuffer = new ArrayBuffer(4)
    const lengthDataView = new DataView(lengthBuffer)
    lengthDataView.setUint32(0, length, true)
    return new Uint8Array(lengthBuffer)
}

const commandToBytes = (command) => {
    const {id, data} = command
    const bytes = data ? dataToBytes(data) : []
    const unpadded = [
        0, id,
        ...lengthToBytes(bytes.length),
        ...bytes
    ]
    const padding = new Array(PACKET_PADDING - (unpadded.length % PACKET_PADDING)).fill(0)
    return [...unpadded, ...padding]
}

let isOledOn = false
let gpkRCVersion = {}
let connect = {}
let kbd = {}

export const getIsOledOn = () => isOledOn
export const getGpkRCVersion = (k) => gpkRCVersion[deviceId(k)]
export const getConnect = (type) => connect[type]

const DEFAULT_USAGE = {
    usage: 0x61,
    usagePage: 0xFF60
}

export const deviceId = (device) => `${device.manufacturer}-${device.product}-${device.vendorId}-${device.productId}`

export const getKBD = (device) => HID.devices().find(d =>
    (device ?
        (d.manufacturer === device.manufacturer &&
            d.product === device.product &&
            d.vendorId === device.vendorId &&
            d.productId === device.productId) : false) &&
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
)

export const getKBDList = () => HID.devices().filter(d =>
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
).sort((a, b) => `${a.manufacturer}${a.product}` > `${b.manufacturer}${b.product}` ? 1 : -1)

export const start = async (device, os) => {
    const d = getKBD(device)
    if (d && d.path) {
        const id = deviceId(device)
        if(!kbd[id]){
            kbd[id] = os === 'linux' ?  await HID.HIDAsync.open(d.path) : new HID.HID(d.path)
            kbd[id].on('error', (err) => {
                console.log(err)
                stop(device)
            })
            kbd[id].on('data', data => {
                const str = data.toString()
                const dId = deviceId(d)
                if (str.match(/is_oled/)) isOledOn = /is_oled_on/.test(str)
                if(
                    !gpkRCVersion[dId] ||
                    (gpkRCVersion[dId] && gpkRCVersion[dId] === 0)
                ) {
                    gpkRCVersion[dId] = str.match(/gpk_rc_1/) ? 1 : 0
                }
            })
        }
        connect[id] = true
    }
}

export const stop = (device) => {
    const id = deviceId(device)
    if (kbd[id]) {
        kbd[id].removeAllListeners("data")
        _close(id)
        kbd[id] = undefined
        connect[id] = false
    }
}

const _close = (id) => {
    try{
        kbd[id].close()
    } catch (e) {
        console.log(`close ${id}`)
    }
}

export const close = () => {
    if(kbd) Object.keys(kbd).map(id => _close(id))
}

export const writeCommand = (device, command) => {
    const id = deviceId(device)
    if (kbd[id]) {
        const bytes = commandToBytes(command)
        kbd[id].write(bytes)
    }
}