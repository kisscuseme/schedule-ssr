"use client";

import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { styled } from "styled-components";

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

export const DefaultButton = styled(Button)`
  float: right;
`;

export const GroupButton = styled(Button)`
  margin: 10px;
`;

export const DefaultInput = styled(FormControl)``;

export const DefaultTitle = styled.h3`
  text-align: center;
  padding: 30px 0;
`;