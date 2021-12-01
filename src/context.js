import React from 'react'
import {createContext, useState, useContext} from 'react'

const {api} = window

const stateContext = createContext({})

export function useStateContext() {
    return useContext(stateContext)
}

export function StateProvider({children}) {
    const [state, _setState] = useState({init: true, devices: [], connectDevice: {}, connect: {}, activeWindow: []})

    const setState = (obj) => {
        api.setDevices(obj.devices)
        _setState({
            init: obj.init,
            devices: obj.devices,
            connect: obj.connect,
            connectDevice: obj.connectDevice,
            activeWindow: obj.activeWindow
        })
    }
    const value = {
        state,
        setState,
    }

    return (
        <stateContext.Provider value={value}>{children}</stateContext.Provider>
    )
}