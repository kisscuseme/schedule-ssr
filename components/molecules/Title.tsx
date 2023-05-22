"use client";

import { ReactNode } from "react";
import { styled } from "styled-components";

const Component = styled.h3`
  text-align: center;
  padding: 30px 0;
`;

export default function Title({
  children
}: {
  children: ReactNode
}) {
  return (
    <Component>
      {children}
    </Component>
  );
}
