import React from 'react'
import {useStateContext} from "../context"
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import useStyles from "../style";

const ActiveWindow = () => {
    const {state} = useStateContext()
    const classes = useStyles()
    const description = "Open the application used for layer switching. \n Please Copy & Paste to layer's application."
    const brText = description.split("\n").map((line, key) => <span key={key}>{line}<br/></span>);

    return (
        <Paper elevation={0} className={classes.settings}>
            <Typography component="h1" variant="h6" color="inherit" className={classes.activeWindowTitle}>
                <div>Latest ActiveWindows</div>
            </Typography>
            <List>
                <ListItem key={`active-window-description`} className={classes.activeWindowDescription}>
                    <ListItemText
                        primary={brText}
                    />
                </ListItem>
                {state.activeWindow.map((a, i) => (
                    <ListItem key={`active-window-${i}`}>
                        <ListItemText primary={a}/>
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
}
export default ActiveWindow