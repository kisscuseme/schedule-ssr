import { forwardRef } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { styled, ThemeProvider } from "styled-components";

const StyledButton = styled(Button)`
  float: ${props => props.theme.align === "center" ? "none" : props.theme.align};
  --bs-btn-color: ${props => props.theme.color};
  --bs-btn-bg: ${props => props.theme.backgroundColor};
  --bs-btn-border-color: ${props => props.theme.backgroundColor};
  --bs-btn-hover-color: ${props => props.theme.color};
  --bs-btn-hover-bg: ${props => props.theme.backgroundColor};
  --bs-btn-hover-border-color: ${props => props.theme.backgroundColor};
  --bs-btn-focus-shadow-rgb: 49,132,253;
  --bs-btn-active-color: ${props => props.theme.color};
  --bs-btn-active-bg: ${props => props.theme.backgroundColor};
  --bs-btn-active-border-color: ${props => props.theme.backgroundColor};
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: ${props => props.theme.color};
  --bs-btn-disabled-bg: ${props => props.theme.backgroundColor};
  --bs-btn-disabled-border-color: ${props => props.theme.backgroundColor};
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${props => props.theme.backgroundColor === "transparent" ? "#ffffff" : props.theme.backgroundColor};
      background-color: ${props => props.theme.color};
    }
  }
`;

type CustomButtonProps = {
  align?: "center" | "right" | "left";
  color?: string;
  backgroundColor?: string;
} & ButtonProps;

export const CustomButton = forwardRef(({
  align = "right",
  color = "#000000",
  backgroundColor = "transparent",
  ...props
}: CustomButtonProps, ref) => {
  const {children, ...otherProps} = props;
  const theme = {
    color: color,
    backgroundColor: backgroundColor,
    align: align
  };
  return (
    <ThemeProvider theme={theme}>
      <StyledButton {...otherProps} ref={ref}>
        {children}
      </StyledButton>
    </ThemeProvider>
  );
});
CustomButton.displayName = "CustomButton";