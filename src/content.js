import React, {  useEffect, useRef, useState } from 'react'
import Header from "./renderer/header"
import Settings from "./renderer/settings"
import ActiveWindow from "./renderer/activeWindow"

import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

const { api } = window

import {useStateContext} from "./context"

import useStyles from "./style";

const Content = () => {
    const { state, setState } = useStateContext()
    const [ tab, setTab] = useState(0)
    const classes = useStyles()
    const loadingRef = useRef()

    useEffect( () => {
        try{
            setInterval(api.keyboardSendLoop, 500)
        } catch (e) {
            console.log("error")
        }
        api.initStore()
    }, [loadingRef])

    useEffect( () => {
        const connectDevice = api.getConnectDevice()
        const devices = api.getDevices()
        if(connectDevice) state.connectDevice = connectDevice
        if(devices) state.devices = devices
        state.init = false
        setState(state)
    }, [])

    useEffect(() => {
        api.on("isConnect", (isConnect) => {
            state.connect = isConnect
            state.connectDevice = api.getConnectDevice()
            state.devices = api.getDevices()
            setState(state)
        })
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
            <Header />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={classes.tabs}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs">
                    <Tab label="Setting" />
                    <Tab label="Active Window" />
                </Tabs>
            </Box>
            {tab === 0 ? (<Settings />) : (<ActiveWindow />)}
        </div>
    )
}
export default Content