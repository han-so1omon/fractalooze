import React from 'react'

import CanvasContainer from '../CanvasContainer'
import Navbar from '../Navbar'
import Sample from '../Sample'
import Cover from '../Cover'

export default function AppContent() {
    return (
        <>
            <Cover background="#EEEEEE">
                <Cover background="#DDDDDD">
                    <div className="app-content">
                        <Navbar/>
                        <CanvasContainer />
                        <Sample />
                    </div>
                </Cover>
            </Cover>
        </>
    )
}
