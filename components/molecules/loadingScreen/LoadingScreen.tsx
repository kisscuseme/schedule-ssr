"use client"

import { css } from "@emotion/react";
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { colStyle, rowStyle } from "./loadingScreen.styles";

export const LoadingScreen = () => {
  return (
    <Container fluid>
      <Row css={css(rowStyle)}>
        <Col css={css(colStyle)}>
          <Spinner animation="border"/>
        </Col>
      </Row>
    </Container>
  )
}