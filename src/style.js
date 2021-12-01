import {createStyles, createTheme, makeStyles, responsiveFontSizes} from "@material-ui/core/styles";

const theme_base = createTheme({
    palette: {
        primary: {
            main: "#90caf9"
        },
        type: "dark",
    },
    props: {
        MuiLink: {
            underline: 'none'
        }
    }
})

export const theme = responsiveFontSizes(theme_base)
const useStylesBase = (theme) => makeStyles(() =>
    createStyles({
        title: {
            display: "flex",
            justifyContent: "center",
            height: "40px",
            alignItems: "center"
        },
        device: {
            paddingRight: "40px"
        },
        tabs: {
            paddingTop: "40px",
        },
        settings: {},
        settingsTitle: {
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingLeft: "10px"
        },
        settingsPrecautionary: {
            paddingLeft: "10px",
            color: theme.palette.primary.main
        },
        activeWindowTitle: {
            display: "flex",
            minHeight: "48px",
            alignItems: "center",
            paddingLeft: "10px"
        },
        activeWindowDescription: {
            color: theme.palette.primary.main
        },
        settingInputs: {
            display: "flex"
        },
        settingSwitch: {
            paddingTop: "10px"
        },
        settingDelete: {
            paddingTop: "6px"
        },
        wrapSettingLayer: {
            paddingRight: "70px"
        },
        settingLayer: {
            display: "flex",
            justifyContent: "end",
        },
        settingLayerRead: {},
        settingLayerAdd: {
            paddingRight: "40px"
        }
    })
)
const useStyles = useStylesBase(theme)

export default useStyles
