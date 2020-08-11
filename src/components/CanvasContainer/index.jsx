import React, { useContext } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import Canvas from '../Canvas'

export default function CanvasContainer() {
    const {
        compressionCanvas,
    } = useContext(AppStateContext)
    const theme = useTheme()

    return (
        <Paper
            elevation={0}
            square
            style={{
                backgroundColor: theme.palette.secondary.inner,
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingTop: '40px',
                paddingBottom: '40px',
                width: '85%',
            }}
        >
            <Paper
                elevation={0}
                square
                style={{
                    backgroundColor: theme.palette.secondary.main,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingTop: '25px',
                    paddingBottom: '25px',
                    width: '70%',
                }}
            >
                {compressionCanvas.show && (
                <Canvas />
                )}
            </Paper>
        </Paper>
    )
}
