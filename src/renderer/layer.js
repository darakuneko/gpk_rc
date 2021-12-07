import React from "react";

import useStyles from "../style";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {IconButton} from "@material-ui/core";
import Add from '@material-ui/icons/Add';
import {v4 as uuidv4} from 'uuid';
import LayerEdit from "./layerEdit";

import {createLayerObj, useStateContext} from "../context";

const {api} = window

const Layer = (() => {
    const {state, setState} = useStateContext();

    const classes = useStyles()

    const handleAdd = () => {
        state.devices.push(createLayerObj())
        setState(state)
    }

    return (
        <Paper elevation={0} className={classes.settings}>
            <Typography component="h1" variant="h6" color="inherit" className={classes.settingsTitle}>
                <div>Connect Keyboard</div>
                {state.init ? (
                    <div className={classes.title}>
                        <div>initializing...</div>
                    </div>
                ) : (
                    <div className={classes.title}>
                        <div className={classes.device}>
                            {state.connectDevice && state.connectDevice[api.deviceType.switchLayer] &&
                            state.connectDevice[api.deviceType.switchLayer].manufacturer &&
                            state.connectDevice[api.deviceType.switchLayer].product ?
                                `${state.connectDevice[api.deviceType.switchLayer].manufacturer} ${state.connectDevice[api.deviceType.switchLayer].product}` : "no device"}
                        </div>
                        <div>
                            {state.connect[api.deviceType.switchLayer] ? "connect" : "disconnect"}
                        </div>
                    </div>
                )}
                <IconButton aria-label="add" fontSize="large" onClick={handleAdd}>
                    <Add fontSize="inherit"/>
                </IconButton>
            </Typography>
            <div className={classes.settingsPrecautionary}>Do not connect while using remap.</div>
            <div>
                {state.devices && state.devices.filter(d => d.type === api.deviceType.switchLayer).map(d => (
                    <div key={`${d.id}`}><LayerEdit device={d}/></div>))}
            </div>
        </Paper>)
})

export default Layer