import React from 'react'
import {createLayerObj, createOledClockObj, useStateContext} from "../context.js"
import {IconButton, List, ListItem, ListItemText, Paper} from "@mui/material";

import {ActiveWindowTitle} from "../style.js";
import {Add, Done} from "@mui/icons-material";
import {toHex} from "./commonEdit.js";

const {api} = window

const KeyboardList = () => {
    const {state, setState, kbdListState} = useStateContext();
    const storePath = () => api.storePath()
    const appVersion = () => api.appVersion()

    const registered = (type, kbd) => {
        const d = state.devices.filter(d => d.type === type).find(d =>
            d.manufacturer === kbd.manufacturer &&
            d.product === kbd.product &&
            d.vendorId === kbd.vendorId &&
            d.productId === kbd.productId
        )
        return !!d
    }

    const handleAdd = (type, kbd) => async () => {
        const obj = type === api.deviceType.switchLayer ? createLayerObj() : createOledClockObj()
        obj.manufacturer = kbd.manufacturer
        obj.product = kbd.product
        obj.vendorId = kbd.vendorId
        obj.productId = kbd.productId
        state.devices.push(obj)
        await setState(state, true)
    }

    return (
        <Paper elevation={0}>
            <ActiveWindowTitle component="h1" variant="h6" color="inherit">
                <div>Registerable Keyboard List</div>
            </ActiveWindowTitle>
            <List>
                {kbdListState.map((kbd, i) => (
                    <ListItem key={`keyboard-list-${i}`}>
                        <ListItemText
                            primary={`${kbd.manufacturer} ${kbd.product}`}
                            secondary={`vendorId:${toHex(kbd.vendorId)} productId:${toHex(kbd.productId)}`}/>
                        {registered(api.deviceType.switchLayer, kbd) ? (
                           <IconButton aria-label="done" fontSize="large" disabled>
                               <Done fontSize="inherit"/>
                           </IconButton>
                        ) : (
                            <IconButton aria-label="add" fontSize="large" onClick={handleAdd(api.deviceType.switchLayer, kbd)}>
                                <Add fontSize="inherit"/>
                            </IconButton>
                        )}
                        <div>Auto Switch Layer</div>
                        {registered(api.deviceType.oledClock, kbd) ? (
                            <IconButton aria-label="done" fontSize="large" disabled>
                                <Done fontSize="inherit"/>
                            </IconButton>
                        ) : (
                            <IconButton aria-label="add" fontSize="large" onClick={handleAdd(api.deviceType.oledClock, kbd)}>
                                <Add fontSize="inherit"/>
                            </IconButton>
                        )}
                        <div>Oled Clock</div>
                    </ListItem>
                ))}
            </List>
            <List>
                <ListItem>file: {storePath()}</ListItem>
            </List>
            <List>
                <ListItem>version: {appVersion()}</ListItem>
            </List>
        </Paper>
    )
}
export default KeyboardList