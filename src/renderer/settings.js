import React, {useEffect, useState} from "react";

import useStyles from "../style";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {IconButton} from "@material-ui/core";
import Add from '@material-ui/icons/Add';
import { v4 as  uuidv4 } from 'uuid';
import Edit from "./edit";

import {useStateContext} from "../context";

const Settings = (() => {
    const { state, setState } = useStateContext();

    const classes = useStyles()

    const handleAdd = () => {
        const obj = {
            id: uuidv4(),
            priority: 1,
            manufacturer: "",
            product: "",
            vendor_id: "",
            product_id: "",
            oledClock: false,
            layers: [{name: "", layer: 1}]
        }
        state.devices.push(obj)
        setState(state)
    }

    return (
        <Paper elevation={0} className={classes.settings}>
            <Typography component="h1" variant="h6" color="inherit" className={classes.settingsTitle}>
                <div>Connect Keyboard</div>
                <IconButton aria-label="add" fontSize="large" onClick={handleAdd}>
                    <Add fontSize="inherit" />
                </IconButton>
            </Typography>
            <div className={classes.settingsPrecautionary}>Do not connect while using remap.</div>
            <div>
                {state.devices.length > 0 && state.devices.map( d => (<div key={`${d.id}`}><Edit device={d}/></div>))}
            </div>
        </Paper>)
})

export default Settings