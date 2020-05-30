import React, { useState, useEffect } from 'react'
//import { Responsive, WidthProvider } from 'react-grid-layout'
import ReactGridLayout from 'react-grid-layout'
import _ from 'lodash'

import 'react-grid-layout/css/styles.css'

//const ReactGridLayout = WidthProvider(Responsive)

//TODO change blockgrid so that it accepts a list of elements and displays them
//instead of `generateDOM()
export default function BlockGrid(props) {
    const [breakpoint, setBreakpoint] = useState('lg')

    function onBreakpointChange(breakpoint) {
        setBreakpoint(breakpoint)
    }

    return (
        <ReactGridLayout
            onBreakpointChange={onBreakpointChange}
            measureBeforeMount={false}
            isDraggable={false}
            isResizable={false}
            {...props}
        >
        {props.elements}
        </ReactGridLayout>
    )
}


BlockGrid.defaultProps = {
    elements: [],
    className: "layout",
    rowHeight: 75,
    onLayoutChange: function() {},
    cols: 12,
    width: 100,
    margin: [10, 20],
}
