import React from "react";

import {Box, TextField} from "@mui/material";
import {Delete} from '@mui/icons-material';
import {handleDelete, handleSwitchChange, handleTextChange, toHex} from "./commonEdit.js";
import {useStateContext} from "../context.js";
import {SettingDelete, SettingInputs, SettingSwitch} from "../style.js";

const {api} = window

const OledClockEdit = ((props) => {
    const {state, setState} = useStateContext();
    const device = props.device

    const _handleSwitchChange = (device) => async (e) => {
        const isChecked = e.currentTarget.checked
        await handleSwitchChange(state, setState, device, isChecked, api.deviceType.oledClock)
    }

    return (<div key={`${device.id}`}>
            <SettingInputs m={2}>
                <Box m={2}>
                    <SettingSwitch
                        onChange={_handleSwitchChange(device)}
                        checked={device.onSwitchButton === 1}/>
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
                    {device.onSwitchButton === 0 ? (
                        <SettingDelete aria-label="delete" fontSize="large"
                                       onClick={handleDelete(state, setState, device.id)}>
                            <Delete fontSize="inherit"/>
                        </SettingDelete>
                    ) : (<div/>)
                    }
                </Box>
            </SettingInputs>
        </div>
    )
})

export default OledClockEdit