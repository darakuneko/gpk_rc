import React from "react";

import useStyles from "../style";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {IconButton} from "@material-ui/core";
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import {handleTextChange, handleSwitchChange, handleDelete, toHex} from "./commonEdit";

import {useStateContext} from "../context";

const {api} = window

const LayerEdit = ((props) => {
    const {state, setState} = useStateContext();
    const device = props.device
    const classes = useStyles()
    const selectArr = [...Array(20).keys()].map(i => ++i);

    const handleLayerAdd = (id) => () => {
        state.devices = state.devices.map(d => {
            if (d.id === id) {
                if (d.layers.length > 0) {
                    const l = d.layers.sort((a, b) => b.layer - a.layer)[0].layer
                    d.layers.push({name: "", layer: parseInt(l) + 1})
                    d.layers.sort((a, b) => a.layer - b.layer)
                } else {
                    d.layers = [{name: "", layer: 1}]
                }
            }
            return d
        })
        setState(state)
    }

    const handleLayerDelete = (id, layer) => () => {
        state.devices = state.devices.map(d => {
            if (d.id === id) {
                d.layers = d.layers.filter(l => l.layer !== layer)
            }
            return d
        })

        setState(state)
    }

    const _handleSwitchChange = (id) => (e) => {
        const isChecked = e.currentTarget.checked
        const obj = handleSwitchChange(state, setState, id, isChecked, api.deviceType.switchLayer)
        obj.isStart ? api.switchLayerStart(obj.device) : api.switchLayerStop(obj.device)
    }

    return (<div key={`${device.id}`}>
            <Box m={2} className={classes.settingInputs}>
                <Box m={2}>
                    <Switch
                        className={classes.settingSwitch}
                        onChange={_handleSwitchChange(device.id)}
                        checked={device.onSwitchLayer === 1}/>
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
                    {device.onSwitchLayer === 0 ? (
                        <IconButton className={classes.settingDelete} aria-label="delete" fontSize="large"
                                    onClick={handleDelete(state, setState, device.id)}>
                            <Delete fontSize="inherit"/>
                        </IconButton>
                    ) : (<div/>)
                    }
                </Box>
            </Box>
            <Box m={2} className={classes.wrapSettingLayer}>
                <div className={classes.settingLayer}>
                    {device.onSwitchLayer === 0 ? (
                        <IconButton aria-label="add" fontSize="small" onClick={handleLayerAdd(device.id)}>
                            <Add fontSize="inherit"/>
                        </IconButton>
                    ) : (<span/>)}
                </div>
                {device.onSwitchLayer === 0 ? (device.layers && device.layers.map((l, n) => (
                            <div key={`edit-${device.id}-${l.layer}-${n}`} className={classes.settingLayer}>
                                <Box m={2}>
                                    <InputLabel>Layer</InputLabel>
                                    <Select
                                        value={l.layer}
                                        label="Layer"
                                        onChange={handleTextChange(state, setState, device.id, "layer", l.layer, `layer-${device.id}-${l.layer}`, "select")}
                                    >
                                        {selectArr.map(i => (
                                            <MenuItem key={`layer-select-${l.layer}-${i}`} value={i}
                                                      disabled={device.layers.map(l => l.layer).includes(i)}>{i}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box m={2}>
                                    <TextField
                                        label="application"
                                        variant="filled"
                                        onChange={handleTextChange(state, setState, device.id, "layer_name", l.layer)}
                                        defaultValue={l.name}
                                        className={classes.settingLayerAdd}/>
                                </Box>
                                <Box m={2}>
                                    <IconButton className={classes.settingDelete} aria-label="delete" fontSize="large"
                                                onClick={handleLayerDelete(device.id, l.layer)}>
                                        <Delete fontSize="inherit"/>
                                    </IconButton>
                                </Box>
                            </div>
                        )
                    )
                ) : (
                    <Table aria-label="sticky table" className={classes.settingLayerRead}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Layer</TableCell>
                                <TableCell>Application/OS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {device.layers && device.layers.map(l => (
                                <TableRow
                                    key={`read-${device.id}-${l.layer}`}
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
                )}
            </Box>
        </div>
    )
})

export default LayerEdit