import React, { useContext } from 'react'

import { generate } from 'shortid'

import sketchSrc from '../../sketches/barnsley-fern'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import p5Wrapper from '../P5Wrapper'

const P5Wrapper = p5Wrapper(generate())

export default function Canvas() {
    const dispatch = useContext(AppDispatchContext)
    const { fractalSketch } = useContext(AppStateContext)

    return (
        <div className="section">
            <div className="section section-content">
                {fractalSketch && (
                    <P5Wrapper
                        dispatch={dispatch}
                        sketch={sketchSrc}
                    />
                )}
            </div>
        </div>
    )
}
