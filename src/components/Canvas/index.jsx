import React, { useContext } from 'react'
import styled from "styled-components"

import { generate } from 'shortid'

import animationSketchSrc from '../../sketches/animation'
import compressionImageSrc from '../../sketches/compression-image'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import p5Wrapper from '../P5Wrapper'

const P5CompressionImageWrapper = p5Wrapper(generate())
const P5CompressionAnimationWrapper = p5Wrapper(generate())

const Styles = styled.div`
    img {
        max-width: 100%;
        height: auto;
    }
`

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
            <img src={compressionAnimation.path}/>
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
        <Styles>
            <div className="section-content">
                { compressionCanvas.showAnimation && animation }
            </div>
            <div className="section-content">
                <img src={compressionCanvas.image.path}/>
            </div>
        </Styles>
    )
}
