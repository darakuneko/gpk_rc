import React from "react";

import useStyles from "../style";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {IconButton} from "@material-ui/core";
import Delete from '@material-ui/icons/Delete';
import {handleTextChange, handleSwitchChange, handleDelete, toHex} from "./commonEdit";
import {useStateContext} from "../context";

const OledClockEdit = ((props) => {
    const {state, setState} = useStateContext();
    const device = props.device
    const classes = useStyles()

    const _handleSwitchChange = (id) => (e) => {
        const isChecked = e.currentTarget.checked
        const obj = handleSwitchChange(state, setState, id, isChecked, api.deviceType.oledClock)
        obj.isStart ? api.switchLayerStart(obj.device) : api.switchLayerStop(obj.device)
    }

    return (<div key={`${device.id}`}>
            <Box m={2} className={classes.settingInputs}>
                <Box m={2}>
                    <Switch
                        className={classes.settingSwitch}
                        onChange={_handleSwitchChange(device.id)}
                        checked={device.onOledClock === 1}/>
                </Box>
                <Box m={2}>
                    <TextField
                        label="Manufacturer"
                        variant={"standard"}
                        onChange={handleTextChange(state, setState, device.id, "manufacturer")}
                        defaultValue={device.manufacturer}
                        InputProps={{readOnly: true}}/>
                </Box>
                <Box m={2}>
                    <TextField
                        label="Product"
                        variant={"standard"}
                        onChange={handleTextChange(state, setState, device.id, "product")}
                        defaultValue={device.product}
                        InputProps={{readOnly: true}}/>
                </Box>
                <Box m={2}>
                    <TextField
                        label="VendorId"
                        variant={"standard"}
                        onChange={handleTextChange(state, setState, device.id, "vendorId")}
                        defaultValue={toHex(device.vendorId)}
                        InputProps={{readOnly: true}}/>
                </Box>
                <Box m={2}>
                    <TextField
                        label="ProductId"
                        variant={"standard"}
                        onChange={handleTextChange(state, setState, device.id, "productId")}
                        defaultValue={toHex(device.productId)}
                        InputProps={{readOnly: true}}/>
                </Box>
                <Box m={2}>
                    {device.onOledClock === 0 ? (
                        <IconButton className={classes.settingDelete} aria-label="delete" fontSize="large"
                                    onClick={handleDelete(state, setState, device.id)}>
                            <Delete fontSize="inherit"/>
                        </IconButton>
                    ) : (<div/>)
                    }
                </Box>
            </Box>
        </div>
    )
})

export default OledClockEdit