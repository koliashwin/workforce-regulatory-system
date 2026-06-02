import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme/theme.js'
import { Analytics } from "@vercel/analytics/next"

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
        <Analytics />
    </React.StrictMode>,
)
