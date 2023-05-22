"use client"

import { Col, Container, Row, Spinner } from "react-bootstrap"
import { styled } from "styled-components";

const LoadingRow = styled(Row)`
  height: 100vh;
`;

const LoadingCol = styled(Col)`
  width: 100vw;
  margin: auto;
  text-align: center;
`;

export const LoadingScreen = () => {
  return (
    <Container fluid>
      <LoadingRow>
        <LoadingCol>
          <Spinner animation="border"/>
        </LoadingCol>
      </LoadingRow>
    </Container>
  )
}