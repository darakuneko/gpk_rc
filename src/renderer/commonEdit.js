export const handleTextChange = (state, setState, id, propName, layer) => (e) => {
    const value = propName === "layer" ? parseInt(e.currentTarget.getAttribute("data-value")) : e.currentTarget.value.trim()

    state.devices = state.devices.map(d => {
        if (id === d.id) {
            if (propName === "manufacturer") d.manufacturer = value
            if (propName === "product") d.product = value
            if (propName === "vendorId") d.vendorId = parseInt(value)
            if (propName === "productId") d.productId = parseInt(value)
            if (propName === "layer") d.layers = d.layers.map(l => l.layer === layer ? {layer: value, name: l.name} : l)
            if (propName === "layer_name") d.layers = d.layers.map(l => l.layer === layer ? {
                layer: layer,
                name: value
            } : l)
        }
        return d
    })
    setState(state)
}

export const handleSwitchChange = (state, setState, id, isChecked, type) => {
    state.devices = state.devices.map(d => {
        if (d.type === type && d.id === id) {
            if(type === api.deviceType.switchLayer) isChecked ? d.onSwitchLayer = 1 : d.onSwitchLayer = 0
            if(type === api.deviceType.oledClock) isChecked ? d.onOledClock = 1 : d.onOledClock = 0
        }
        return d
    })
    const device = state.devices.find(d => d.id === id)
    const getDevice = (type) => {
        if(type === api.deviceType.switchLayer) {
            return state.devices.find(d => d.onSwitchLayer === 1 && d.type === type && d.id === id)
        }
        return state.devices.find(d => d.onOledClock === 1 && d.type === type && d.id === id)
    }
    const typeId = api.typeId(type, device)
    const startDevice = getDevice(type)
    startDevice ? state.connectDevice[typeId] = startDevice : delete state.connectDevice[typeId]
    setState(state)

    return {
        isStart: !!startDevice,
        device: device
    }
}

export const handleDelete = (state, setState, id) => () => {
    state.devices = state.devices.filter(d => d.id !== id)
    setState(state)
}

export const toHex = (number) => {
    let hex = 0x0000
    try {
        hex = '0x' + (('0000' + number.toString(16).toUpperCase()).substr(-4))
    } catch (e) {
        console.log(e)
    }
    return hex
}