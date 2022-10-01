import React, {useState} from "react";
import {styled} from "@mui/material/styles";
import {useStateContext} from "../context";
const {api} = window

const DeviceStatus = styled("div")({
    paddingLeft: "10px",
    display: "flex",
})

const Device = styled("div")({
    paddingRight: "40px"
})

const CommonConnectDevice = ((props) => {
    const {state} = useStateContext();

    const deviceType = props.deviceType

    const devices = () => {
        if(!state.connectDevice) return undefined
        const devices  = state.devices.filter(d => d.type === deviceType)
        const keys = Object.keys(state.connectDevice)
        return devices.filter(d => keys.includes(d.id))
    }

    return (<span>
            {state.init ? (
                <DeviceStatus>
                    <div>initializing...</div>
                </DeviceStatus>
            ) : (
                <div>
                    {devices().length > 0 ? devices().map((d,i) => (
                        <DeviceStatus key={`connectDevice-${deviceType}-${i}`}>
                            <Device>
                                {d.manufacturer} {d.product}
                            </Device>
                            <div>
                                {state.connect[d.id] ? "connect" : "disconnect"}
                            </div>
                        </DeviceStatus>
                    )) : (
                        <DeviceStatus>no device</DeviceStatus>
                    )}
                </div>
            )}
        </span>)
})

export default CommonConnectDevice