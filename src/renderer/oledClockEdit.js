import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Delete from '@mui/icons-material/Delete';
import {handleTextChange, handleSwitchChange, handleDelete, toHex} from "./commonEdit";
import {useStateContext} from "../context";
import {SettingDelete, SettingInputs, SettingSwitch} from "../style";

const OledClockEdit = ((props) => {
    const {state, setState} = useStateContext();
    const device = props.device

    const _handleSwitchChange = (device) => (e) => {
        const isChecked = e.currentTarget.checked
        handleSwitchChange(state, setState, device, isChecked, api.deviceType.oledClock)
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