import { ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import { styled } from "styled-components";

const TopBarRow = styled(Row)`
  height: 50px;
`;

const TopBarCol = styled(Col)`
  margin: auto;
`;

export const TopBar = ({
  children
}: { children: ReactNode }) => {
  return (
    <TopBarRow>
      <TopBarCol>
        {children}
      </TopBarCol>
    </TopBarRow>
  );
}