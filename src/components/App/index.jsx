import React from 'react'
import { hot } from 'react-hot-loader'
import styled from "styled-components"

import AppContent from '../AppContent'

import AppStateProvider from './AppStateProvider'

const Styles = styled.div`
    h5 {
        margin: 0;
        padding: 0;
    }

    #app-root {
        font-family: Roboto, sans-serif;
    }

    .app-content {
        align-items: center;
        text-align: center;
    }

    .section {
        margin: 8px auto;
        padding: 8px;
        border: 1px dashed lightgray;
        border-radius: 4px;
    }

    .section-content {
        padding: 10px;
    }
`

function App() {
    return (
        <AppStateProvider>
            <Styles>
                <AppContent />
            </Styles>
        </AppStateProvider>
    )
}

export default module.hot ? hot(module)(App) : App
