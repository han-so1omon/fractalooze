import React from "react"
import styled from "styled-components"
import { FaHome, FaGithubAlt } from 'react-icons/fa'

const Styles = styled.div`
    padding: 1rem;

    a:link, a:active, a:visited, a:hover {
        font-size: 1.1rem;
        color: white;
        background-color: transparent;
    }

    button {
        font-size: 0.75rem;
        margin: 8px;
        color: white;
        background: transparent;
        cursor: pointer;
        outline: none;
        border: none;
    }

    .title {
       color: white; 
    }

    .menu {
        margin: auto;
        width: 85%;
        background-color: #111;
        color: white;
        border-radius: 25px;
        padding: 10px 15px;
        height: 60px;
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .menu a:link, a:active, a:visited, a:hover {
        test-decoration: none;
    }
`

const Navbar = props => {
    return (
        <Styles>
            <nav className='menu'>
                <a className='buttonLeft' href="https://errcsool.com/portfolio">
                    <FaHome size={45}/>
                </a>
                <div className='title'>
                    <a href="https://errcsool.com/portfolio/fractal-image-compression">Fractal Image Compression</a>
                </div>
                <a className='buttonRight' href="https://github.com/han-so1omon/fractalooze">
                    <FaGithubAlt size={45}/>
                </a>
            </nav>
        </Styles>
    )
}

export default Navbar
