import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { DropdownProps } from 'react-bootstrap';
import { AlignType } from 'react-bootstrap/esm/types';
import { styled } from 'styled-components';

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

export type CustomDropdownProps = DropdownOwnProps & Omit<DropdownProps, "align" | "children">;

export type DropdownDataProps = {
  key: string;
  href: string;
  label: string;
}

export const defaultStyle = `
  display: inline-block;
  margin: auto;
`;

const parentStyle = `
float: right;
`;

const StyledDropdown = styled(Dropdown)`
  ${parentStyle}
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  ${defaultStyle}
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
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
  itemAlign = 'end',
  onClickItemHandler,
  title,
  ...props
}: CustomDropdownProps) => {
  const [selectedText, setSelectedText] = useState(initText);

  return (
    <StyledDropdown align={itemAlign} {...props}>
      <span style={{verticalAlign: "middle"}}>{title}</span>
      <StyledDropdownToggle
        variant="primary"
        id={id}
      >
        {selectedText}
      </StyledDropdownToggle>

      <StyledDropdownMenu>
        {items && items.map(item =>
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
        )}
      </StyledDropdownMenu>
    </StyledDropdown>
  );
};
