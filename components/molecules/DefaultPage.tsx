"use client"

import { Container } from "react-bootstrap";
import Title from "../atoms/Title";
import { ReactNode } from "react";
import { TopBar } from "./TopBar";

export default function DefaultPage({
  topBar,
  title,
  children
}: {
  topBar?: ReactNode,
  title?: ReactNode,
  children: ReactNode
}) {
  
  return (
    <Container fluid>
      {topBar && <TopBar>{topBar}</TopBar>}
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  );
}
