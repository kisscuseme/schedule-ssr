import { Col, Row } from "react-bootstrap";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ScheduleInputType } from "@/types/global.types";
import { CustomInput } from "../atoms/CustomInput";

interface ScheduleInputFormProps {
  scheduleInput: ScheduleInputType,
  setScheduleInput: Dispatch<SetStateAction<ScheduleInputType>>,
  scheduleInputPlaceholder?: string
}

export const ScheduleInputForm = ({
  scheduleInput,
  setScheduleInput,
  scheduleInputPlaceholder
}: ScheduleInputFormProps) => {
  const scheduleClearButtonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="schedule-input-form">
      <style>
        {`
          .schedule-input-form .row {
            min-height: 50px;
          }
  
          .schedule-input-form .col {
            margin: auto;
          }
        `}
      </style>
      <Row>
        <Col>
          <CustomInput
            type="date"
            value={scheduleInput.fromDate}
            onChange={selectFromDateHandler}
          />
        </Col>
        <Col>
          ~
        </Col>
        <Col>
          <CustomInput
            type="date"
            value={scheduleInput.toDate}
            onChange={selectToDateHandler}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomInput
            placeholder={scheduleInputPlaceholder}
            type="text"
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
        </Col>
      </Row>
    </div>
  )
}