import React from 'react'
import {useStateContext} from "../context.js"
import {Input, List, ListItem, ListItemText, Paper} from "@mui/material";
import { styled } from '@mui/system';
import {ActiveWindowTitle, theme} from "../style.js";


const ActiveWindowDescription = styled(ListItem)({
    color: theme.palette.primary.main
})

const ActiveWindow = () => {
    const {state} = useStateContext()
    const description = `Access the application used to switch layers and you will see the application name.
        Please Copy & Paste to layer's application.
        use the keyboard shortcuts.
        e.g. ctrl + C / command + C.`
    const brText = description.split("\n").map((line, key) => <span key={key}>{line}<br/></span>);

    return (
        <Paper elevation={0}>
            <ActiveWindowTitle component="h1" variant="h6" color="inherit">
                <div>Latest ActiveWindows 10</div>
            </ActiveWindowTitle>
            <List>
                <ActiveWindowDescription key={`active-window-description`}>
                    <ListItemText
                        primary={brText}
                    />
                </ActiveWindowDescription>
                {state.activeWindow.map((a, i) => (
                    <ListItem key={`active-window-${i}`}>
                        <Input defaultValue={a}/>
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
}
export default ActiveWindow