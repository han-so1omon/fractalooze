import React from "react"
import styled from "styled-components"

const Button = props => {
  return <ButtonWrapper props={props} onClick={props.onClick}>{props.children}</ButtonWrapper>
}

const ButtonWrapper = styled.button`
  display: block;
  border: none;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  padding: 10px 25px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;

  background: ${props => props.props.background || "black"};
  color: ${props => props.props.color || "rgb(255, 255, 255)"};
  font-size: ${props => props.props.fontSize || "15px"};
  font-weight: ${props => props.props.fontWeight || "400"};
  border-radius: ${props => props.props.radius || "6px"};
  margin: ${props => props.props.margin || "auto"};

  &:hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
  }
`

export default Button
