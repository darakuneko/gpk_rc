import React, {useEffect, useState} from "react";

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {IconButton} from "@material-ui/core";
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';


import {useStateContext} from "../context";

const Edit = ((props) => {
    const { state, setState } = useStateContext();
    const [inputError, setInputError] = useState(false);
    const device = props.device 
    const classes = useStyles()
    const selectArr = [...Array(20).keys()].map(i => ++i);

    const handleTextChange = (id, propName, layer, key, event) => (e) => {
        const value = propName === "layer" ? parseInt(e.currentTarget.getAttribute("data-value")) : e.currentTarget.value.trim()

        state.devices = state.devices.map(d => {
            if(id === d.id){
                if(propName === "manufacturer") d.manufacturer = value
                if(propName === "product") d.product = value
                if(propName === "vendor_id") d.vendor_id = parseInt(value)
                if(propName === "product_id") d.product_id = parseInt(value)
                if(propName === "layer") d.layers = d.layers.map(l => l.layer === layer ? {layer: value, name: l.name} : l)
                if(propName === "layer_name") d.layers = d.layers.map(l => l.layer === layer ? {layer: layer, name: value} : l)
            }
            return d
        })
        setState(state)
    }

    const handleSwitchChange = (id) => (e) => {
        const isChecked = e.currentTarget.checked
        state.devices = state.devices.map(d => {
            d.id === id && isChecked ? d.priority = 0 : d.priority = 1
            return d
        })
        const startDevice = state.devices.find(d => d.priority === 0)
        state.connectDevice = startDevice
        setState(state)
        startDevice ? api.qmkrcdStart(startDevice) : api.qmkrcdStop()
    }

    const handleChangeOledClock = (id) => (e) => {
        const oledClock = e.currentTarget.checked
        state.devices = state.devices.map(d => {
            if(d.id === id) d.oledClock = oledClock
            return d
        })
        setState(state)
    }

    const handleDelete = (id) => () => {
        state.devices = state.devices.filter(d => d.id !== id)
        setState(state)
    }

    const handleLayerAdd = (id) => () => {
        state.devices = state.devices.map(d => {
            if(d.id === id) {
                if(d.layers.length > 0) {
                    const l = d.layers.sort((a,b) => b.layer - a.layer)[0].layer
                    d.layers.push({name: "", layer: parseInt(l) + 1})
                    d.layers.sort((a,b) => a.layer - b.layer)
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
            if(d.id === id) {
                d.layers = d.layers.filter(l => l.layer !== layer)
            }
            return d
        })
        setState(state)
    }

    const toHex = (number) => {
        let hex = 0x0000
        try{
            hex = '0x' + (('0000' + number.toString(16).toUpperCase()).substr(-4))
        } catch (e)  {
            console.log(e)
        }
        return hex
    }

    const variant = (device) => device.priority === 0 ? "standard" : "filled"

    return (<div key={`${device.id}`}>
                    <Box m={2} className={classes.settingInputs}>
                        <Box m={2}>
                            <Switch
                                className={classes.settingSwitch}
                                onChange={handleSwitchChange(device.id)}
                                checked={device.priority === 0} />
                        </Box>
                        <Box m={2}>
                            <TextField
                                label="Manufacturer"
                                variant={variant(device)}
                                onChange={handleTextChange(device.id, "manufacturer")}
                                defaultValue={device.manufacturer}
                                InputProps={{
                                    readOnly: device.priority === 0,
                                }}/>
                        </Box>
                        <Box m={2}>
                            <TextField
                                label="Product"
                                variant={variant(device)}
                                onChange={handleTextChange(device.id, "product")}
                                defaultValue={device.product}
                                InputProps={{
                                    readOnly: device.priority === 0,
                                }}/>
                        </Box>
                        <Box m={2}>
                            <TextField
                                label="VendorId"
                                variant={variant(device)}
                                onChange={handleTextChange(device.id, "vendor_id")}
                                defaultValue={toHex(device.vendor_id)}
                                InputProps={{
                                    readOnly: device.priority === 0,
                                }}/>
                        </Box>
                        <Box m={2}>
                            <TextField
                                label="ProductId"
                                variant={variant(device)}
                                onChange={handleTextChange(device.id, "product_id")}
                                defaultValue={toHex(device.product_id)}
                                InputProps={{
                                    readOnly: device.priority === 0,
                                }}/>
                        </Box>
                        <Box m={2}>
                            {device.priority === 1 ? (
                                <IconButton className={classes.settingDelete} aria-label="delete" fontSize="large" onClick={handleDelete(device.id)}>
                                <Delete fontSize="inherit" />
                                </IconButton>
                                ) : (<div />)
                            }
                        </Box>
                    </Box>
                    <Box className={classes.settingsOledClock}>
                        {device.priority === 1 ? (
                            <FormControlLabel  onChange={handleChangeOledClock(device.id)} control={<Checkbox checked={device.oledClock} />} label="OLED Clock" />
                        ) :(
                            <div>OLED Clock: {device.oledClock ? "Enabled" : "Disabled" }</div>
                        )}
                    </Box>
                    <Box m={2} className={classes.wrapSettingLayer}>
                            <div className={classes.settingLayer}>
                            {device.priority === 1 ? (
                            <IconButton aria-label="add" fontSize="small" onClick={handleLayerAdd(device.id)}>
                                <Add fontSize="inherit" />
                            </IconButton>
                                ) : (<span />)}
                            </div>
                        {device.priority === 1 ? (device.layers && device.layers.map( (l,n) => (
                                        <div key={`edit-${device.id}-${l.layer}-${n}`} className={classes.settingLayer}>
                                            <Box m={2}>
                                                <InputLabel>Layer</InputLabel>
                                                <Select
                                                    //error={inputError.layer && inputError.layer[`layer-${device.id}-${l.layer}`]}
                                                    value={l.layer}
                                                    label="Layer"
                                                    onChange={handleTextChange(device.id, "layer", l.layer, `layer-${device.id}-${l.layer}`, "select")}
                                                >
                                                    {selectArr.map(i => (
                                                        <MenuItem key={`layer-select-${l.layer}-${i}`} value={i} disabled={device.layers.map(l => l.layer).includes(i)}>{i}</MenuItem>
                                                    ))}
                                                </Select>
                                            </Box>
                                            <Box m={2}>
                                                <TextField
                                                    error={inputError.layerName && inputError.layerName[`layer_name-${device.id}-${l.layer}`]}
                                                    label="application"
                                                    variant="filled"
                                                    onChange={handleTextChange(device.id, "layer_name", l.layer)}
                                                    defaultValue={l.name}
                                                    className={classes.settingLayerAdd} />
                                            </Box>
                                            <Box m={2}>
                                                <IconButton className={classes.settingDelete} aria-label="delete" fontSize="large" onClick={handleLayerDelete(device.id, l.layer)}>
                                                    <Delete fontSize="inherit" />
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
                                            <TableCell>Application</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { device.layers && device.layers.map( l => (
                                            <TableRow
                                                key={`read-${device.id}-${l.layer}`}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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

export default Edit