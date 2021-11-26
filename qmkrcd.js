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
  const { id, data } = command
  const bytes = data ? dataToBytes(data) : []
  const unpadded = [
    0, id,
    ...lengthToBytes(bytes.length),
    ...bytes
  ]
  const padding = new Array(PACKET_PADDING - (unpadded.length % PACKET_PADDING)).fill(0)
  return [ ...unpadded, ...padding ]
}


let isOledOn = false
let connect = false
let kbd

const DEFAULT_USAGE = {
  usage: 0x61,
  usagePage: 0xFF60
}

const getKBD = (device) => HID.devices().find(d =>
    (device ?
        (d.manufacturer === device.manufacturer &&
            d.product === device.product &&
            d.vendorId === device.vendor_id &&
            d.productId === device.product_id) : false) &&
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
)

const start = (device) => {
    kbd = new HID.HID(device.path)
    kbd.on('error', (err) => {
      console.log(err)
      stop(kbd)
    })
    kbd.on('data', data => {
      const str = data.toString()
      if(str.match(/is_oled/)) isOledOn = /is_oled_on/.test(str)
    })
    connect = true
}

const stop = () => {
  kbd.removeAllListeners("data")
  kbd.close()
  connect = false
}

const writeCommand = (command) => {
  if(kbd){
    const bytes = commandToBytes(command)
    kbd.write(bytes)
  }
}

module.exports.isOledOn = () => isOledOn
module.exports.connect = () => connect
module.exports.getKBD = getKBD
module.exports.start = start
module.exports.stop = stop
module.exports.writeCommand = writeCommand
