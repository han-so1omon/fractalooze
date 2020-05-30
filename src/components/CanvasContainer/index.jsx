import React, { useContext } from 'react'
import styled from "styled-components"

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import Canvas from '../Canvas'

const Styles = styled.div`
    .display {
        margin: 50px auto;
        padding: 50px;
        background: #CECECE;
        width: 60%;
    }
`
export default function CanvasContainer() {
    const {
        compressionCanvas,
    } = useContext(AppStateContext)

    return (
        <Styles>
            {compressionCanvas.show && (
            <div className='display'>
                <Canvas />
            </div>
            )}
        </Styles>
    )
}
