import React from "react";

import {SettingsPrecautionary, SettingsTitle} from "../style.js";
import {Paper} from "@mui/material";
import LayerEdit from "./layerEdit.js";

import {useStateContext} from "../context.js";
import CommonConnectDevice from "./commonConnectDevice.js";

const {api} = window

const Layer = (() => {
    const {state} = useStateContext();

    return (
        <Paper elevation={0}>
            <SettingsTitle component="h1" variant="h6" color="inherit">
                <div>Connect Keyboard</div>
            </SettingsTitle>
            <CommonConnectDevice deviceType={api.deviceType.switchLayer} />
            <SettingsPrecautionary>Reserved Words to switch layer when connecting - os:win os:mac os:linux</SettingsPrecautionary>
            <SettingsPrecautionary>Do not connect while using remap</SettingsPrecautionary>
            <div>
                {state.devices && state.devices.filter(d => d.type === api.deviceType.switchLayer).map(d => (
                    <div key={`${d.id}`}><LayerEdit device={d} /></div>))}
            </div>
        </Paper>)
})

export default Layer