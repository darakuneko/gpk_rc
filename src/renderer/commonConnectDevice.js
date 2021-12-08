import React from "react";

import useStyles from "../style";
import {useStateContext} from "../context";

const CommonConnectDevice = ((props) => {
    const {state} = useStateContext();
    const deviceType = props.deviceType

    const classes = useStyles()
    const reg = new RegExp(deviceType)
    const devices = () => state.connectDevice ? Object.keys(state.connectDevice).filter(d => d.match(reg)) : undefined

    return (<span>
            {state.init ? (
                <div className={classes.deviceStatus}>
                    <div>initializing...</div>
                </div>
            ) : (
                <div>
                    {devices().length > 0 ? devices().map((key,i) => (
                        <div className={classes.deviceStatus} key={`connectDevice-${deviceType}-${i}`}>
                            <div className={classes.device}>
                                {state.connectDevice[key] && state.connectDevice[key].manufacturer} {state.connectDevice[key] && state.connectDevice[key].product}
                            </div>
                            <div>
                                {key && state.connect[key] ? "connect" : "disconnect"}
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