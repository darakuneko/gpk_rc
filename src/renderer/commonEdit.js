const {api} = window

export const handleTextChange = (state, setState, id, propName, layer, layerIndex) => (e) => {
    const value = propName === "layer" ? parseInt(e.currentTarget.getAttribute("data-value")) : e.currentTarget.value.trim()

    state.devices = state.devices.map(d => {
        if (id === d.id) {
            if (propName === "manufacturer") d.manufacturer = value
            if (propName === "product") d.product = value
            if (propName === "vendorId") d.vendorId = parseInt(value)
            if (propName === "productId") d.productId = parseInt(value)
            if (propName === "layer") d.layers = d.layers.map((l, i) => l.layer === layer && i === layerIndex ? {layer: value, name: l.name} : l)
            if (propName === "layer_name") d.layers = d.layers.map((l, i) => l.layer === layer && i === layerIndex ? {
                layer: layer,
                name: value
            } : l)
        }
        return d
    })
    setState(state, true)
}

export const handleSwitchChange = (state, setState, device, isChecked) => {
    const deviceId = api.deviceId(device)
    state.devices = state.devices.map(d => {
        if (api.deviceId(d) === deviceId) isChecked ? d.onSwitchButton = 1 : d.onSwitchButton = 0
        return d
    })

    const devices = state.devices.filter(d => d.onSwitchButton === 1 && d.id === device.id)
    if(devices.length > 0){
        state.connectDevice[deviceId] = device
        api.start(device)
    } else {
        delete state.connectDevice[deviceId]
        delete state.connect[deviceId]
        api.stop(device)
    }
    setState(state, true)
}

export const handleDelete = (state, setState, id) => () => {
    state.devices = state.devices.filter(d => d.id !== id)
    setState(state, true)
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