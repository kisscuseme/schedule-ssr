import { useEffect, useState } from "react";
import { RefObject } from "react";
import { FormControl, FormControlProps } from "react-bootstrap";
import { styled } from "styled-components";

interface InputOwnProps {
  /**
   * 타입
   */
  type?: string;
  /**
   * 클리어 버튼 보임 여부
   */
  clearButton?: boolean;
  /**
   * clear button ref
   */
  clearBtnRef?: RefObject<HTMLButtonElement>;
  /**
   * onClearButtonClick
   */
  onClearButtonClick?: () => void;
  /**
   * initValue
   */
  initValue?: string;
}

type InputProps = InputOwnProps & FormControlProps;

const ClearButton = styled.button`
  position: absolute;
  font-weight: 700;
  border: none;
  color: #9e9e9e;
  background-color: transparent;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #6e6e6e;
    }
  }
`;

/**
 * 기본 인풋 컴포넌트
 */
export const CustomInput = ({
  type = "text",
  placeholder = "",
  clearButton,
  clearBtnRef,
  initValue,
  onClearButtonClick,
  ...props
}: InputProps) => {

  const [text, setText] = useState<string | number | string[] | undefined>(initValue||"");

  useEffect(() => {
    if(initValue !== "") {
      setText(initValue||"");
    }
  }, [initValue]);

  return (
    <>
      <FormControl
        type={type}
        placeholder={placeholder}
        {...props}
      />
      {clearButton && type !== "date" && text !== "" && (
        <ClearButton
          tabIndex={-1}
          ref={clearBtnRef}
          onClick={() => {
            setText("");
            if(onClearButtonClick) onClearButtonClick();
          }}
        >
          X
        </ClearButton>
      )}
    </>
  );
};
