"use client";

import { Col, Row } from "react-bootstrap";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomInput } from "../atoms/CustomInput";
import { styled } from "styled-components";
import { useRecoilValue } from "recoil";
import {
  resetClearButtonState,
  scheduleAccordionActiveState,
} from "@/states/states";
import { ScheduleInputType } from "@/types/types";

// schedule input form props
export interface ScheduleInputFormProps {
  scheduleInput: ScheduleInputType;
  setScheduleInput: Dispatch<SetStateAction<ScheduleInputType>>;
  scheduleInputPlaceholder?: string;
  initValue?: string;
}

const InputRow = styled(Row)`
  min-height: 50px;
`;

const InputCol = styled(Col)`
  margin: auto;
`;

// 날짜 input 사이 물결 문자 중앙 정렬
const MiddleCol = styled(InputCol)`
  max-width: 30px;
  text-align: center;
`;

export const ScheduleInputForm = ({
  scheduleInput,
  setScheduleInput,
  scheduleInputPlaceholder,
  initValue,
}: ScheduleInputFormProps) => {
  const scheduleClearButtonRef = useRef<HTMLButtonElement>(null);
  const [inputInitValue, setInputInitValue] = useState(initValue);
  const resetClearButton = useRecoilValue(resetClearButtonState);
  const scheduleAccordionActive = useRecoilValue(scheduleAccordionActiveState);

  const selectFromDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // 선택한 날짜가 to date 보다 크면 to date도 동일하게 지정
    if (scheduleInput.toDate < e.currentTarget.value)
      setScheduleInput({
        ...scheduleInput,
        fromDate: e.currentTarget.value,
        toDate: e.currentTarget.value,
      });
    else
      setScheduleInput({
        ...scheduleInput,
        fromDate: e.currentTarget.value,
      });
  };

  const selectToDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // 선택한 날짜가 from date 보다 작으면 from date도 동일하게 지정
    if (scheduleInput.fromDate > e.currentTarget.value)
      setScheduleInput({
        ...scheduleInput,
        fromDate: e.currentTarget.value,
        toDate: e.currentTarget.value,
      });
    else
      setScheduleInput({
        ...scheduleInput,
        toDate: e.currentTarget.value,
      });
  };

  const scheduleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setScheduleInput({
      ...scheduleInput,
      schedule: e.currentTarget.value,
    });
  };

  useEffect(() => {
    // 빈 값이 들어올 경우 clear 버튼이 사라지지 않는 문제 수정
    if (scheduleInput.schedule === "") {
      scheduleClearButtonRef.current?.click();
    }
  }, [scheduleInput]);

  useEffect(() => {
    // 빈 값이 아닌 값이 바인딩 될 경우 clear 버튼이 나타나지 않는 문제 수정
    if (inputInitValue === "") {
      setInputInitValue(scheduleInput.schedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputInitValue]);

  //
  useEffect(() => {
    // 초기화 버튼 클릭 시 clear 버튼이 나타나지 않는 문제 수정
    if (scheduleInput.id === scheduleAccordionActive) {
      setInputInitValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetClearButton]);

  return (
    <>
      <InputRow>
        <InputCol>
          <CustomInput
            type="date"
            value={scheduleInput.fromDate}
            onChange={selectFromDateHandler}
          />
        </InputCol>
        <MiddleCol>~</MiddleCol>
        <InputCol>
          <CustomInput
            type="date"
            value={scheduleInput.toDate}
            onChange={selectToDateHandler}
          />
        </InputCol>
      </InputRow>
      <InputRow>
        <InputCol>
          <CustomInput
            placeholder={scheduleInputPlaceholder}
            type="text"
            initValue={inputInitValue}
            value={scheduleInput.schedule}
            onChange={scheduleChangeHandler}
            clearButton={true}
            clearBtnRef={scheduleClearButtonRef}
            onClearButtonClick={() => {
              setScheduleInput({
                ...scheduleInput,
                schedule: "",
              });
            }}
          />
        </InputCol>
      </InputRow>
    </>
  );
};
