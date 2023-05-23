"use client";

import { Col, Row, Spinner } from "react-bootstrap"
import { styled } from "styled-components";
import { DefaultContainer } from "../atoms/DefaultAtoms";
import { ReactNode } from "react";

const LoadingRow = styled(Row)`
  height: 100vh;
`;

const LoadingCol = styled(Col)`
  width: 100vw;
  margin: auto;
  text-align: center;
`;

export const LoadingScreen = ({
  children
}: {
  children?: ReactNode
}) => {
  return (
    <DefaultContainer>
      <LoadingRow>
        <LoadingCol>
          {children ? children : <Spinner animation="border"/>}
        </LoadingCol>
      </LoadingRow>
    </DefaultContainer>
  )
}