import React, {  useEffect, useRef, useState } from 'react'
import Layer from "./renderer/layer"
import ActiveWindow from "./renderer/activeWindow"
import OledClock from "./renderer/oledClock"

import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

const {api} = window

import {useStateContext} from "./context"

import useStyles from "./style";

const Content = () => {
    const { state, setState } = useStateContext()
    const [ tab, setTab] = useState(0)
    const classes = useStyles()
    const loadingRef = useRef()

    useEffect( () => {
        try{
            setInterval(api.keyboardSendLoop, 300)
        } catch (e) {
            console.log("error timer")
        }
        api.initStore()
    }, [loadingRef])

    useEffect( () => {
        Object.values(api.deviceType).map(type => {
            const connectDevice = api.getConnectDevice(type)
            if(connectDevice) state.connectDevice[type] = connectDevice
        })
        const devices = api.getDevices()
        if(devices) state.devices = devices
        state.init = false
        setState(state)
    }, [])

    useEffect(() => {
        const set = (type, isConnect) => {
            state.connect[type] = isConnect
            state.connectDevice[type] = api.getConnectDevice(type)
            state.devices = api.getDevices()
            setState(state)
        }
        api.on("isConnectSwitchLayer", (isConnect) => set(api.deviceType.switchLayer, isConnect))
        api.on("isConnectOledClock", (isConnect) =>  set(api.deviceType.oledClock, isConnect))
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
                </Tabs>
            </Box>
            {tab === 0 && <Layer />}
            {tab === 1 && <OledClock />}
            {tab === 2 && <ActiveWindow />}
        </div>
    )
}
export default Content