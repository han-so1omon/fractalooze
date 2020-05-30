import React from 'react'
import styled from "styled-components"

const Styles = styled.div`
`

export default function Cover(props) {
    return <CoverWrapper props={props}>{props.children}</CoverWrapper>
}

const CoverWrapper = styled.div`
    text-decoration: none;

    padding: ${props => props.props.padding || "1rem"};
    background: ${props => props.props.background || "#EEEEEE"};
`
