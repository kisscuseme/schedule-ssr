"use client";

import { Col, Row } from "react-bootstrap";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ScheduleInputType } from "@/types/global.types";
import { CustomInput } from "../atoms/CustomInput";
import { styled } from "styled-components";
import { useRecoilValue } from "recoil";
import { resetClearButtonState, scheduleAccordionActiveState } from "@/states/states";

interface ScheduleInputFormProps {
  scheduleInput: ScheduleInputType,
  setScheduleInput: Dispatch<SetStateAction<ScheduleInputType>>,
  scheduleInputPlaceholder?: string,
  initValue?: string
}

const InputRow = styled(Row)`
  min-height: 50px;
`;

const InputCol = styled(Col)`
  margin: auto;
`;

const MiddleCol = styled(InputCol)`
  max-width: 30px;
  text-align: center;
`;

export const ScheduleInputForm = ({
  scheduleInput,
  setScheduleInput,
  scheduleInputPlaceholder,
  initValue
}: ScheduleInputFormProps) => {
  const scheduleClearButtonRef = useRef<HTMLButtonElement>(null);
  const [inputInitValue, setInputInitValue] = useState(initValue);
  const resetClearButton = useRecoilValue(resetClearButtonState);
  const scheduleAccordionActive = useRecoilValue(scheduleAccordionActiveState);

  const selectFromDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if(scheduleInput.toDate < e.currentTarget.value) setScheduleInput({
      ...scheduleInput,
      fromDate: e.currentTarget.value,
      toDate: e.currentTarget.value
    });
    else setScheduleInput({
      ...scheduleInput,
      fromDate: e.currentTarget.value
    });
  }

  const selectToDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if(scheduleInput.fromDate > e.currentTarget.value) setScheduleInput({
      ...scheduleInput,
      fromDate: e.currentTarget.value,
      toDate: e.currentTarget.value
    });
    else setScheduleInput({
      ...scheduleInput,
      toDate: e.currentTarget.value
    });
  }

  const scheduleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setScheduleInput({
      ...scheduleInput,
      schedule: e.currentTarget.value
    });
  }

  useEffect(() => {
    if(scheduleInput.schedule === "") {
      scheduleClearButtonRef.current?.click();
    }
  }, [scheduleInput]);

  useEffect(() => {
    if(inputInitValue === "") {
      setInputInitValue(scheduleInput.schedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputInitValue]);

  useEffect(() => {
    if(scheduleInput.schedule === "") {
      scheduleClearButtonRef.current?.click();
    }
  }, [scheduleInput]);

  useEffect(() => {
    if(scheduleInput.id === scheduleAccordionActive) {
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
        <MiddleCol>
          ~
        </MiddleCol>
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
                schedule: ""
              });
            }}
          />
        </InputCol>
      </InputRow>
    </>
  )
}