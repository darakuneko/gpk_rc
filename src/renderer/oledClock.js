import React from "react";

import {SettingsPrecautionary, SettingsTitle } from "../style.js";
import {Paper} from "@mui/material";
import OledClockEdit from "./oledClockEdit.js";

import {useStateContext} from "../context.js";
import CommonConnectDevice from "./commonConnectDevice.js";

const {api} = window

const OledClock = (() => {
    const {state} = useStateContext();

    return (
        <Paper elevation={0}>
            <SettingsTitle component="h1" variant="h6" color="inherit">
                <div>Connect Keyboard</div>
            </SettingsTitle>
            <CommonConnectDevice deviceType={api.deviceType.oledClock} />
            <SettingsPrecautionary>Do not connect while using remap.</SettingsPrecautionary>
            <div>
                {state.devices && state.devices.filter(d => d.type === api.deviceType.oledClock).map(d => (
                    <div key={`${d.id}`}><OledClockEdit device={d}/></div>))}
            </div>
        </Paper>)
})

export default OledClock