"use client"

import { Container } from "react-bootstrap";
import Title from "../atoms/Title";
import { ReactNode } from "react";
import { TopBar } from "./TopBar";

export default function ListPage({
  topBar,
  title,
  content
}: {
  topBar?: ReactNode,
  title?: ReactNode,
  content: any[] | string
}) {
  
  return (
    <Container fluid>
      {topBar && <TopBar>{topBar}</TopBar>}
      {title && <Title>{title}</Title>}
      {content && (content.constructor === Array ? content.map((item) => {
        return <p>{item}</p>
      }) : content)}
    </Container>
  );
}
