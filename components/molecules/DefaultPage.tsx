"use client";

import { Col, Container, Row } from "react-bootstrap";
import Title from "./Title";
import { ReactNode } from "react";
import { TopBar } from "./TopBar";

export default function DefaultPage({
  topBar,
  title,
  contents
}: {
  topBar?: ReactNode,
  title?: ReactNode,
  contents: ReactNode[] | ReactNode
}) {
  
  return (
    <Container fluid>
      {topBar && <TopBar>{topBar}</TopBar>}
      {title && <Title>{title}</Title>}
      {contents && (contents.constructor === Array ? contents.map((value, index) => {
        return <Row key={index}><Col>{value}</Col></Row>
      }) : contents)}
    </Container>
  );
}
