import React from 'react'
import {createLayerObj, createOledClockObj, useStateContext} from "../context"
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import useStyles from "../style";
import {IconButton} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";

const KeyboardList = () => {
    const {state, setState} = useStateContext();
    const classes = useStyles()
    const registered = (type, kbd) => {
        const d = state.devices.filter(d => d.type === type).find(d =>
            d.manufacturer === kbd.manufacturer &&
            d.product === kbd.product &&
            d.vendorId === kbd.vendorId &&
            d.productId === kbd.productId
        )
        return !!d
    }

    const handleAdd = (type, kbd) => () => {
        const obj = type === api.deviceType.switchLayer ? createLayerObj() : createOledClockObj()
        obj.manufacturer = kbd.manufacturer
        obj.product = kbd.product
        obj.vendorId = kbd.vendorId
        obj.productId = kbd.productId
        state.devices.push(obj)
        setState(state)
    }

    return (
        <Paper elevation={0} className={classes.settings}>
            <Typography component="h1" variant="h6" color="inherit" className={classes.activeWindowTitle}>
                <div>Registerable Keyboard List</div>
            </Typography>
            <List>
                {state.kbdList.map((kbd, i) => (
                    <ListItem key={`keyboard-list-${i}`}>
                        <ListItemText
                            primary={`${kbd.manufacturer} ${kbd.product}`}
                            secondary={`vendorId:${kbd.vendorId} productId:${kbd.productId}`}/>
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
        </Paper>
    )
}
export default KeyboardList