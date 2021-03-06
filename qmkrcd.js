const HID = require('node-hid')

const PACKET_PADDING = 64

const dataToBytes = (data) => typeof data === 'string' ? strToBytes(data) : data

const strToBytes = (str) => [...str.split('').map(c => c.charCodeAt(0)), 0]

const lengthToBytes = exports.lengthToBytes = (length) => {
    const lengthBuffer = new ArrayBuffer(4)
    const lengthDataView = new DataView(lengthBuffer)
    lengthDataView.setUint32(0, length, true)
    return new Uint8Array(lengthBuffer)
}

const commandToBytes = exports.commandToBytes = (command) => {
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
let connect = {}
let kbd = {}

const DEFAULT_USAGE = {
    usage: 0x61,
    usagePage: 0xFF60
}

const deviceId = (device) => `${device.manufacturer}-${device.product}-${device.vendorId}-${device.productId}`

const getKBD = (device) => HID.devices().find(d =>
    (device ?
        (d.manufacturer === device.manufacturer &&
            d.product === device.product &&
            d.vendorId === device.vendorId &&
            d.productId === device.productId) : false) &&
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
)

const getKBDList = () => HID.devices().filter(d =>
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
).sort((a, b) => `${a.manufacturer}${a.product}` > `${b.manufacturer}${b.product}` ? 1 : -1)

const start = (device) => {
    const d = getKBD(device)
    if (d && d.path) {
        const id = deviceId(device)
        if(!kbd[id]){
            kbd[id] = new HID.HID(d.path)
            kbd[id].on('error', (err) => {
                console.log(err)
                stop(device)
            })
            kbd[id].on('data', data => {
                const str = data.toString()
                if (str.match(/is_oled/)) isOledOn = /is_oled_on/.test(str)
            })
        }
        connect[id] = true
    }
}
const stop = (device) => {
    const id = deviceId(device)
    if (kbd[id]) {
        kbd[id].removeAllListeners("data")
        if(process.platform === "darwin") kbd[id].close()
        kbd[id] = undefined
        connect[id] = false
    }
}

const writeCommand = (device, command) => {
    const id = deviceId(device)
    if (kbd[id]) {
        const bytes = commandToBytes(command)
        kbd[id].write(bytes)
    }
}

module.exports.isOledOn = () => isOledOn
module.exports.connect = (type) => connect[type]
module.exports.getKBD = getKBD
module.exports.getKBDList = getKBDList
module.exports.start = start
module.exports.stop = stop
module.exports.writeCommand = writeCommand
module.exports.deviceId = deviceId
