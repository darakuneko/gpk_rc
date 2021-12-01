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
        if (d.type === type) {
            d.id === id && isChecked ? d.priority = 0 : d.priority = 1
        }
        return d
    })
    const startDevice = state.devices.find(d => d.priority === 0 && d.type === type)
    state.connectDevice = startDevice
    setState(state)
    return startDevice
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

export const variant = (device) => device.priority === 0 ? "standard" : "filled"
