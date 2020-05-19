import React from "react"
import styled from "styled-components"
import { FaBeer } from 'react-icons/fa'

const Styles = styled.div`
    button {
        font-size: 0.5rem;
        margin-right: 30px;
        color: white;
        background: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        float: right;
    }

    .navBar {
        width: 100%;
        background-color: #111;
        color: white;
        padding: 10px;
        height: 20px;
    }
`

const Navbar = props => {
    return (
        <Styles>
            <div className='navBar'>
                <button onClick={()=>{console.log('hi')}}>
                    <FaBeer />
                </button>
            </div>
        </Styles>
    )
}

export default Navbar
