import React, {createContext, useContext, useState} from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from "@material-ui/styles";
import {theme} from "./style";
import CssBaseline from "@material-ui/core/CssBaseline";
import Content from "./content";
import {StateProvider} from "./context";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StateProvider>
                <Content />
            </StateProvider>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
