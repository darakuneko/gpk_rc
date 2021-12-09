import React from "react";

import useStyles from "../style";
import {useStateContext} from "../context";

const CommonConnectDevice = ((props) => {
    const {state} = useStateContext();
    const deviceType = props.deviceType

    const classes = useStyles()
    const devices = () => {
        if(!state.connectDevice) return undefined
        const devices  = state.devices.filter(d => d.type === deviceType)
        const keys = Object.keys(state.connectDevice)
        return devices.filter(d => keys.includes(api.deviceId(d)))
    }
    return (<span>
            {state.init ? (
                <div className={classes.deviceStatus}>
                    <div>initializing...</div>
                </div>
            ) : (
                <div>
                    {devices().length > 0 ? devices().map((d,i) => (
                        <div className={classes.deviceStatus} key={`connectDevice-${deviceType}-${i}`}>
                            <div className={classes.device}>
                                {d.manufacturer} {d.product}
                            </div>
                            <div>
                                {state.connect[api.deviceId(d)] ? "connect" : "disconnect"}
                            </div>
                        </div>
                    )) : (
                        <div className={classes.deviceStatus}>no device</div>
                    )}
                </div>
            )}
        </span>)
})

export default CommonConnectDevice