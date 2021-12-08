import React from "react";

import useStyles from "../style";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LayerEdit from "./layerEdit";

import {useStateContext} from "../context";
import CommonConnectDevice from "./commonConnectDevice";

const {api} = window

const Layer = (() => {
    const {state} = useStateContext();

    const classes = useStyles()
    return (
        <Paper elevation={0} className={classes.settings}>
            <Typography component="h1" variant="h6" color="inherit" className={classes.settingsTitle}>
                <div>Connect Keyboard</div>
            </Typography>
            <CommonConnectDevice deviceType={api.deviceType.switchLayer} />
            <div className={classes.settingsPrecautionary}>Reserved Words to switch layer when connecting - os:win os:mac os:linux</div>
            <div className={classes.settingsPrecautionary}>Do not connect while using remap</div>
            <div>
                {state.devices && state.devices.filter(d => d.type === api.deviceType.switchLayer).map(d => (
                    <div key={`${d.id}`}><LayerEdit device={d}/></div>))}
            </div>
        </Paper>)
})

export default Layer