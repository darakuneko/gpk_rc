import React from "react";
import { createRoot } from 'react-dom/client';
import {ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Content from "./content";
import {StateProvider} from "./context";
import {responsiveFontSizes} from "@mui/material/styles";
import {theme} from "./style";

const App = () => {
    return (
        <ThemeProvider theme={responsiveFontSizes(theme)}>
            <CssBaseline/>
            <StateProvider>
                <Content/>
            </StateProvider>
        </ThemeProvider>
    )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);