import React from "react";

import {settingsPrecautionary, SettingsTitle } from "../style";
import Paper from "@mui/material/Paper";
import OledClockEdit from "./oledClockEdit";

import {useStateContext} from "../context";
import CommonConnectDevice from "./commonConnectDevice";

const {api} = window

const OledClock = (() => {
    const {state} = useStateContext();

    return (
        <Paper elevation={0}>
            <SettingsTitle component="h1" variant="h6" color="inherit">
                <div>Connect Keyboard</div>
            </SettingsTitle>
            <CommonConnectDevice deviceType={api.deviceType.oledClock} />
            <div className={settingsPrecautionary}>Do not connect while using remap.</div>
            <div>
                {state.devices && state.devices.filter(d => d.type === api.deviceType.oledClock).map(d => (
                    <div key={`${d.id}`}><OledClockEdit device={d}/></div>))}
            </div>
        </Paper>)
})

export default OledClock