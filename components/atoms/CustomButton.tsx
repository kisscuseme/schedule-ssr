import { forwardRef } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { styled } from "styled-components";

const StyledButton = styled(Button)`
  --bs-btn-color: #000000;
  --bs-btn-bg: transparent;
  --bs-btn-border-color: transparent;
  --bs-btn-hover-color: #000000;
  --bs-btn-hover-bg: transparent;
  --bs-btn-hover-border-color: transparent;
  --bs-btn-focus-shadow-rgb: 49,132,253;
  --bs-btn-active-color: #000000;
  --bs-btn-active-bg: transparent;
  --bs-btn-active-border-color: transparent;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #000000;
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: transparent;
  color: #000000;
  background-color: transparent;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #ffffff;
      background-color: #000000;
    }
  }
`;

type CustomButtonProps = {
  align?: "center" | "right" | "left";
  color?: string;
  backgroundColor?: string;
} & ButtonProps;

export const CustomButton = forwardRef((props: CustomButtonProps, ref) => {
  const {children, align = "right", color = "ffffff", backgroundColor = "transparent", ...otherProps} = props;
  const alignStyle = align !== "center" ? {float: align} : {};
  const colorStyle = { color: color, backgroundColor: backgroundColor };
  const customStyle = {...alignStyle, ...colorStyle};
  return (
    <StyledButton {...otherProps} ref={ref} style={customStyle}>
      {children}
    </StyledButton>
  );
});
CustomButton.displayName = "CustomButton";