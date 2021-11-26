import React, {useContext} from "react";
import useStyles from "../style";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import {useStateContext} from "../context";

const Header = (() => {
    const { state, setState } = useStateContext();

    const classes = useStyles()
    return (<AppBar>
            <Typography component="h1" variant="h6" color="inherit" noWrap >
                {state.init ? (
                    <div className={classes.title}>
                        <div>initializing...</div>
                    </div>
                ) : (
                    <div className={classes.title}>
                        <div className={classes.device}>
                                {state.connectDevice && state.connectDevice.manufacturer && state.connectDevice.product ? `${state.connectDevice.manufacturer} ${state.connectDevice.product}` : "no device" }
                        </div>
                        <div>
                            {state.connect ? "connect" : "disconnect"}
                        </div>
                    </div>
                )}
            </Typography>
    </AppBar>)
})

export default Header