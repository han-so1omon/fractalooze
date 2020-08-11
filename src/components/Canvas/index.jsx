import React, { useContext } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import { generate } from 'shortid'

import animationSketchSrc from '../../sketches/animation'
import compressionImageSrc from '../../sketches/compression-image'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import p5Wrapper from '../P5Wrapper'

const P5CompressionImageWrapper = p5Wrapper(generate())
const P5CompressionAnimationWrapper = p5Wrapper(generate())

export default function Canvas() {
    const dispatch = useContext(AppDispatchContext)
    const {
        compressionCanvas,
        compressionAnimation,
        bgndColor,
    } = useContext(AppStateContext)

    let animation = undefined
    if (compressionAnimation) {
        animation = (
            <img
                src={compressionAnimation.path}
                alt="compressed"
                style={{
                    maxWidth: '80%',
                }}
            />
        )
    } else {
        animation = (
            <P5CompressionAnimationWrapper
                dispatch={dispatch}
                sketch={animationSketchSrc}
            />
        )
    }
    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'center',
                alignContent: 'space-around',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <Box
                 style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'space-around',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginBottom: '25px',
                }}
           >
                { compressionCanvas.showAnimation && animation }
            </Box>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'space-around',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <img
                    src={compressionCanvas.image.path}
                    alt="original"
                    style={{
                        maxWidth: '80%'
                    }}
                />
            </Box>
        </Box>
    )
}
