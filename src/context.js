import React from 'react'
import {createContext, useState, useContext} from 'react'
import {v4 as uuidv4} from "uuid";

const {api} = window

const stateContext = createContext({})

export function useStateContext() {
    return useContext(stateContext)
}

export function StateProvider({children}) {
    const [state, _setState] = useState({
        init: true,
        devices: [],
        connectDevice: {},
        connect: {},
        activeWindow: [],
        mainWindowShow: false,
        storePath: "",
        appVersion: ""
    })

    const [kbdListState, setKbdList] = useState([])

    const setState = (obj, isSetDevice) => {
        if(isSetDevice) api.setDevices(obj.devices)
        _setState({
            init: obj.init,
            devices: obj.devices,
            connect: obj.connect,
            connectDevice: obj.connectDevice,
            activeWindow: obj.activeWindow,
            mainWindowShow: obj.mainWindowShow,
            storePath: obj.storePath,
            appVersion: obj.appVersion
        })
    }

    const value = {
        state,
        setState,
        kbdListState,
        setKbdList
    }

    return (
        <stateContext.Provider value={value}>{children}</stateContext.Provider>
    )
}

export const createLayerObj = () => {
    return {
        id: uuidv4(),
        onSwitchButton: 0,
        type: api.deviceType.switchLayer,
        manufacturer: "",
        product: "",
        vendorId: "",
        productId: "",
        layers: [{name: "", layer: 1}]
    }
}

export const createOledClockObj = () => {
    return {
        id: uuidv4(),
        onSwitchButton: 0,
        manufacturer: "",
        type: api.deviceType.oledClock,
        product: "",
        vendorId: "",
        productId: "",
    }
}