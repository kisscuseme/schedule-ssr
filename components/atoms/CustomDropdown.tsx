import { Dropdown, SSRProvider } from "react-bootstrap";
import { useState } from "react";
import { DropdownProps } from "react-bootstrap";
import { AlignType } from "react-bootstrap/esm/types";
import { styled } from "styled-components";

interface DropdownOwnProps {
  /**
   * 배경 색상
   */
  backgroundColor?: string;
  /**
   * 글자 색상
   */
  color?: string;
  /**
   * 크기
   */
  size?: "small" | "medium" | "large";
  /**
   * 초기 텍스트
   */
  initText: string;
  /**
   * ID
   */
  id?: string;
  /**
   * 데이터
   */
  items: DropdownDataProps[] | null;
  /**
   * Dropdown Item 위치
   */
  itemAlign?: AlignType;
  /**
   * Dropdown Click Item Handler
   */
  onClickItemHandler: (label: string) => void;
  /**
   * Title
   */
  title?: string;
}

export type CustomDropdownProps = DropdownOwnProps &
  Omit<DropdownProps, "align" | "children">;

export type DropdownDataProps = {
  key: string;
  href: string;
  label: string;
};

// Dropdown 컴포넌트 위치 설정
const StyledDropdown = styled(Dropdown)`
  float: right;
`;

// Dropdown 기본 스타일 오버라이딩
const StyledDropdownToggle = styled(Dropdown.Toggle)`
  display: inline-block;
  margin: auto;
  --bs-btn-color: #000000;
  --bs-btn-bg: transparent;
  --bs-btn-border-color: transparent;
  --bs-btn-hover-color: #000000;
  --bs-btn-hover-bg: transparent;
  --bs-btn-hover-border-color: transparent;
  --bs-btn-focus-shadow-rgb: 49, 132, 253;
  --bs-btn-active-color: #000000;
  --bs-btn-active-bg: transparent;
  --bs-btn-active-border-color: transparent;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #000000;
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: transparent;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #ffffff;
      background-color: #000000;
    }
  }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  --bs-dropdown-link-active-color: #fff;
  --bs-dropdown-link-active-bg: #6e6e6e;
`;

/**
 * 기본 드롭다운 컴포넌트
 */
export const CustomDropdown = ({
  size = "large",
  backgroundColor = "transparent",
  color = "#1e1e1e",
  initText,
  id,
  items,
  itemAlign = "end",
  onClickItemHandler,
  title,
  ...props
}: CustomDropdownProps) => {
  const [selectedText, setSelectedText] = useState(initText);

  return (
    <SSRProvider>
      <StyledDropdown align={itemAlign} {...props}>
        <span style={{ verticalAlign: "middle" }}>{title}</span>
        <StyledDropdownToggle variant="primary" id={id}>
          {selectedText}
        </StyledDropdownToggle>

        <StyledDropdownMenu>
          {items &&
            items.map((item) => (
              <Dropdown.Item
                href={item["href"]}
                key={item["key"]}
                eventKey={item["key"]}
                onClick={() => {
                  setSelectedText(item["label"]);
                  onClickItemHandler(item["key"]);
                }}
              >
                {item["label"]}
              </Dropdown.Item>
            ))}
        </StyledDropdownMenu>
      </StyledDropdown>
    </SSRProvider>
  );
};
