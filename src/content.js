import React, {useEffect, useRef, useState} from 'react'
import Layer from "./renderer/layer.js"
import ActiveWindow from "./renderer/activeWindow.js"
import OledClock from "./renderer/oledClock.js"
import KeyboardList from "./renderer/keyboardList.js"
import {css} from "@emotion/react";

import {Box, Tab, Tabs} from "@mui/material"
import {useStateContext} from "./context.js"

const {api} = window

const style = css`paddingTop: "40px"`;

const Content = () => {
    const {state, setState, setKbdList} = useStateContext()
    const [tab, setTab] = useState(0)

    const loadingRef = useRef()

    useEffect(  () => {
        const fn = async () => {
            const checkFn = async () => {
                if(state.mainWindowShow) setKbdList(await api.getKBDList())
                await api.keyboardSendLoop()
            }
            try{
                setInterval(await checkFn, 500)
            } catch (e) {
                console.log("error timer")
            }
        }
        fn()
        return () => {}
    }, [loadingRef])

    useEffect( () => {
        const fn = async () => {
            const connectDevices = Object.values(api.deviceType).map(async type => await api.getConnectDevices(type)).flat()
            await Promise.all(connectDevices.map( async device => {
                const d = await device
                if(d) state.connectDevice[d.id] = d
            }))
            const devices = await api.getDevices()
            if(devices) state.devices = devices
            state.init = false
            await setState(state, true)
        }
        fn()
        return () => {}
    }, [])

    useEffect(() => {
        const set = async (obj) => {
            const kbd = obj.kbd
            const id = kbd.id
            state.connect[id] = obj.isConnected
            const devices = await api.getStoreAllDevices()
            await Promise.all(devices.map(async d => state.connectDevice[id] = d))
            state.devices = await api.getDevices()
            await setState(state, true)
        }
        api.on("isConnectDevice", (dat) => set(dat))
        return () => {}
    }, [])

    useEffect(() => {
        api.on("activeWindow", async (dat) => {
            if(!state.activeWindow.includes(dat)) {
                const activeWindows = state.activeWindow.concat(dat)
                if(activeWindows.length > 10) activeWindows.shift()
                state.activeWindow = activeWindows
                await setState(state)
            }
        })
        return () => {}
    }, [])

    useEffect(() => {
        api.on("mainWindowShow", async(bool) => {
            state.mainWindowShow = bool
            await setState(state)
        })
        return () => {}
    }, [])

    const handleChange = (event, newValue) => {
        setTab(newValue)
    }

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} css={style}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs">
                    <Tab label="Auto Switch Layer" />
                    <Tab label="Oled Clock" />
                    <Tab label="View Active Window" />
                    <Tab label="Registerable Keyboard List" />
                </Tabs>
            </Box>
            {tab === 0 && <Layer/>}
            {tab === 1 && <OledClock />}
            {tab === 2 && <ActiveWindow />}
            {tab === 3 && <KeyboardList />}
        </div>
    )
}
export default Content