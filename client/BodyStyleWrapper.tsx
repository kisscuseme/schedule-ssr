"use client"

import React from "react";
import { Container } from "react-bootstrap";
import { styled } from "styled-components";

const BodyContainer = styled(Container)`
  padding: 0;
`;

export default function BodyStyleWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <BodyContainer fluid>
      {children}
    </BodyContainer>
  )
}