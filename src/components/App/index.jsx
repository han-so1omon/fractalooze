import React from 'react'
import { hot } from 'react-hot-loader'
import Container from '@material-ui/core/Container'

import AppContent from '../AppContent'

import AppStateProvider from './AppStateProvider'

function App( ) {
    return (
        <AppStateProvider>
            <Container maxWidth="lg">
                <AppContent />
            </Container>
        </AppStateProvider>
    )
}

export default module.hot ? hot(module)(App) : App
