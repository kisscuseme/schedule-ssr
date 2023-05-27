"use client";

import { forwardRef } from "react";
import { Button, ButtonProps, Col, Container, FormControl, Row } from "react-bootstrap";
import { styled } from "styled-components";
import { CustomButton } from "./CustomButton";

const StyledButton = styled(Button)`
  float: right;
`;

export const DefaultButton = forwardRef((props: ButtonProps, ref) => {
  const {children, ...otherProps} = props;
  return <StyledButton {...otherProps} ref={ref}>{children}</StyledButton>
});
DefaultButton.displayName = "DefaultButton";

export const DefaultContainer = styled(Container)`
  background-color: transparent;
  max-width: 550px;
  min-height: 100vh;
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
`;
export const DefaultRow = styled(Row)`
  min-height: 70px;
`;

export const DefaultCol = styled(Col)`  
  margin: auto;
`;

export const GroupButton = styled(CustomButton)`
  margin: 10px;
`;

export const DefaultInput = styled(FormControl)``;

export const DefaultTitle = styled.h3`
  text-align: center;
  padding: 30px 0;
`;