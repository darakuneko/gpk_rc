import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {IconButton} from "@mui/material";
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import {handleTextChange, handleSwitchChange, handleDelete, toHex} from "./commonEdit";

const {api} = window

import {useStateContext} from "../context";
import {
    SettingInputs,
    SettingSwitch,
    SettingDelete,
    WrapSettingLayer,
    SettingLayer,
    SettingLayerAdd,
    SettingLayerInput, WrapSettingLayerList
} from "../style";

const LayerEdit = ((props) => {
    const {state, setState} = useStateContext();
    const device = props.device
    const selectArr = [...Array(20).keys()]

    const handleLayerAdd = (id) => async () => {
        state.devices = state.devices.map(d => {
            if (d.id === id) d.layers.push({name: "", layer: 0})
            return d
        })
        await setState(state, true)
    }

    const handleLayerDelete = (id, layerIndex) => async () => {
        state.devices = state.devices.map(d => {
            if (d.id === id) d.layers = d.layers.filter((_, i) => i !== layerIndex)
            return d
        })
        await setState(state, true)
    }

    const _handleSwitchChange = (device) => async (e) => {
        const isChecked = e.currentTarget.checked
        await handleSwitchChange(state, setState, device, isChecked, api.deviceType.switchLayer)
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
            <WrapSettingLayer m={2}>
                <SettingLayer>
                    {device.onSwitchButton === 0 ? (
                        <IconButton aria-label="add" fontSize="small" onClick={handleLayerAdd(device.id)}>
                            <Add fontSize="inherit"/>
                        </IconButton>
                    ) : (<span/>)}
                </SettingLayer>
                {device.onSwitchButton === 0 ? (device.layers && device.layers.map((l, i) => (
                            <SettingLayer key={`edit-${device.id}-${l.layer}-${i}`}>
                                <SettingLayerInput m={2}>
                                    <InputLabel>Layer</InputLabel>
                                    <Select
                                        value={l.layer}
                                        label="Layer"
                                        onChange={handleTextChange(state, setState, device.id, "layer", l.layer, i)}
                                    >
                                        {selectArr.map(i => (
                                            <MenuItem key={`layer-select-${l.layer}-${i}`} value={i}
                                                      >{i}</MenuItem>
                                        ))}
                                    </Select>
                                </SettingLayerInput>
                                <Box m={2}>
                                    <SettingLayerAdd
                                        label="application"
                                        variant="filled"
                                        onChange={handleTextChange(state, setState, device.id, "layer_name", l.layer, i)}
                                        value={l.name}
                                        />
                                </Box>
                                <Box m={2}>
                                    <SettingDelete aria-label="delete" fontSize="large"
                                                onClick={handleLayerDelete(device.id, i)}>
                                        <Delete fontSize="inherit"/>
                                    </SettingDelete>
                                </Box>
                            </SettingLayer>
                        )
                    )
                ) : (
                    <WrapSettingLayerList>
                    <Table aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Layer</TableCell>
                                <TableCell>Application/OS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {device.layers && device.layers.map((l, i) => (
                                <TableRow
                                    key={`read-${device.id}-${l.layer}-${i}`}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {l.layer}
                                    </TableCell>
                                    <TableCell>{l.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </WrapSettingLayerList>
                )}
            </WrapSettingLayer>
        </div>
    )
})

export default LayerEdit