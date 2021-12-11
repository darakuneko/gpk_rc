import React, {  useEffect, useRef, useState } from 'react'
import Layer from "./renderer/layer"
import ActiveWindow from "./renderer/activeWindow"
import OledClock from "./renderer/oledClock"
import KeyboardList from "./renderer/keyboardList"

import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

const {api} = window

import {useStateContext} from "./context"

import useStyles from "./style";

const Content = () => {
    const { state, setState, setKbdList} = useStateContext()
    const [ tab, setTab] = useState(0)
    const classes = useStyles()
    const loadingRef = useRef()

    useEffect( () => {
        api.send("setAppVersion")
        const fn = () => {
            if(state.mainWindowShow) setKbdList(api.getKBDList())
            api.keyboardSendLoop()
        }
        try{
            setInterval(fn, 600)
        } catch (e) {
            console.log("error timer")
        }
        api.initStore()
    }, [loadingRef])

    useEffect( () => {
        const connectDevices = Object.values(api.deviceType).map(type => api.getConnectDevices(type)).flat()
        connectDevices.forEach(d => {
            if(d) state.connectDevice[api.deviceId(d)] = d
        })
        const devices = api.getDevices()
        if(devices) state.devices = devices
        state.init = false
        setState(state, true)
    }, [])

    useEffect(() => {
        const set = (type, obj) => {
            const kbd = obj.kbd
            const id = api.deviceId(kbd)
            state.connect[id] = obj.isConnected
            api.getConnectDevices(type).map(d => state.connectDevice[api.deviceId(d)] = d)
            state.devices = api.getDevices()
            setState(state, true)
        }
        api.on("isConnectSwitchLayer", (dat) => set(api.deviceType.switchLayer, dat))
        api.on("isConnectOledClock", (dat) =>  set(api.deviceType.oledClock, dat))
        return () => {}
    }, [])

    useEffect(() => {
        api.on("activeWindow", (dat) => {
            if(!state.activeWindow.includes(dat)) {
                const activeWindows = state.activeWindow.concat(dat)
                if(activeWindows.length > 10) activeWindows.shift()
                state.activeWindow = activeWindows
                setState(state)
            }
        })
        return () => {}
    }, [])

    useEffect(() => {
        api.on("mainWindowShow", (bool) => {
            state.mainWindowShow = bool
            setState(state)
        })
        return () => {}
    }, [])

    useEffect( () => {
        api.on("getAppVersion", (v) => {
            state.appVersion = v
            setState(state)})
    }, [])

    const handleChange = (event, newValue) => {
        setTab(newValue)
    }

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={classes.tabs}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs">
                    <Tab label="Auto Switch Layer" />
                    <Tab label="Oled Clock" />
                    <Tab label="View Active Window" />
                    <Tab label="Registerable Keyboard List" />
                </Tabs>
            </Box>
            {tab === 0 && <Layer />}
            {tab === 1 && <OledClock />}
            {tab === 2 && <ActiveWindow />}
            {tab === 3 && <KeyboardList />}
        </div>
    )
}
export default Content