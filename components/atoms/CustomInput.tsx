import { ChangeEvent, useEffect, useState } from "react";
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
  padding-left: 10px;
  padding-top: 6px;
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

const CustomFormControl = styled(FormControl)`
  display: inline-block;
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
  onChange,
  ...props
}: InputProps) => {

  const [text, setText] = useState<string | number | string[] | undefined>(initValue||"");

  useEffect(() => {
    if(initValue !== "") {
      setText(initValue||"");
    }
  }, [initValue]);

  return (
    <div style={clearButton ? {paddingRight:"25px"} : {}}>
      <CustomFormControl
        type={type}
        placeholder={placeholder}
        value = {text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setText(e.currentTarget.value);
          if(onChange) onChange(e);
        }}
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
    </div>
  );
};
