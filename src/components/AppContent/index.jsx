import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import CanvasContainer from '../CanvasContainer'
import Navbar from '../Navbar'
import Sample from '../Sample'

export default function AppContent() {
    const theme = useTheme()
    return (
        <Box bgcolor={theme.palette.primary.main} my={4}>
            <Navbar/>
            <CanvasContainer />
            <Sample />
        </Box>
    )
}
