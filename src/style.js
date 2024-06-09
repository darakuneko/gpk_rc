import {createTheme} from "@mui/material";
import { styled } from '@mui/system';
import {Box, Typography, Switch, IconButton, TextField, TableCell} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#90caf9"
        },
        mode: "dark",
    },
    props: {
        MuiLink: {
            underline: 'none'
        }
    }
})

export const ActiveWindowTitle = styled(Typography)({
    display: "flex",
    minHeight: "48px",
    alignItems: "center",
    paddingLeft: "10px"
})

export const SettingsTitle = styled(Typography)({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingLeft: "10px"
})

export const SettingsPrecautionary = styled("div")({
    paddingLeft: "10px",
    color: theme.palette.primary.main
})

export const SettingInputs = styled(Box)({
    display: "flex"
})

export const SettingSwitch = styled(Switch)({
    paddingTop: "10px"
});

export const SettingDelete = styled(IconButton)({
    paddingTop: "16px"
})

export const WrapSettingLayer = styled("div")({
    borderBottom: "1px dotted",
    marginLeft: "50px",
    marginRight: "64px",
    paddingBottom: "10px"

})

export const SettingLayer = styled("div")({
    display: "flex",
    justifyContent: "end",
})

export const SettingLayerInput = styled(Box)({
    marginTop: "-6px"
})

export const SettingLayerAdd = styled(TextField)({
    paddingRight: "40px"
})

export const WrapSettingLayerList = styled("div")({
    paddingLeft: "70px"
})
