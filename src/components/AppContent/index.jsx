import React from 'react'

import Canvas from '../Canvas'
import Navbar from '../Navbar'

export default function AppContent() {
    return (
        <>
            <div className="app-content section">
                <Navbar/>
                <Canvas />
            </div>
        </>
    )
}
