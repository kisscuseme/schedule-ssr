"use client";

import { Col, Row } from "react-bootstrap"
import { styled } from "styled-components";
import { DefaultContainer } from "../atoms/DefaultAtoms";
import { ReactNode } from "react";

const FullCenterRow = styled(Row)`
  height: 100vh;
`;

const FullCenterCol = styled(Col)`
  width: 100vw;
  margin: auto;
  text-align: center;
`;

export const CenterScreen = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <DefaultContainer>
      <FullCenterRow>
        <FullCenterCol>
          {children}
        </FullCenterCol>
      </FullCenterRow>
    </DefaultContainer>
  )
}