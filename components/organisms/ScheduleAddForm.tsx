"use client";

import { ScheduleType } from "@/services/firebase/firebase.type"
import { Accordion, Col, Row } from "react-bootstrap"
import { ScheduleInputForm } from "./ScheduleInputForm"
import { t } from "i18next"
import { getToday, l } from "@/services/util/util"
import { useState } from "react";
import { ScheduleInputType } from "@/types/global.types";
import { DefaultButton } from "../atoms/DefaultAtoms";
import { styled } from "styled-components";

interface ScheduleAddFromProps {
  scheduleList: ScheduleType[]
}

const InputFormWrapper = styled.div`
  margin-bottom: 10px;
`;

export const ScheduleAddForm = ({
  scheduleList
}: ScheduleAddFromProps) => {
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: getToday(),
    toDate: getToday(),
    schedule: ""
  });

  return (
    <InputFormWrapper>
      <Accordion defaultActiveKey="ScheduleAddForm">
        <Accordion.Item eventKey="ScheduleAddForm">
          <Accordion.Header>
            <div color="#5f5f5f">{`[${l("Enter schedule")}]`}</div>
          </Accordion.Header>
          <Accordion.Body>
          <ScheduleInputForm
            scheduleInput={scheduleInput}
            setScheduleInput={setScheduleInput}
            scheduleInputPlaceholder={l("Enter your schedule.")}
          />
          <Row>
            <Col>
              <DefaultButton>
                {l("Add")}
              </DefaultButton>
            </Col>
          </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>    
    </InputFormWrapper>
  )
}