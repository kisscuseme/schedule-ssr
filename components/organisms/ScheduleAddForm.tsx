"use client";

import { ScheduleType } from "@/services/firebase/firebase.type"
import { Accordion, Col, Row } from "react-bootstrap"
import { ScheduleInputForm } from "./ScheduleInputForm"
import { getReformDate, getToday, l, sortSchedulList } from "@/services/util/util"
import { useState } from "react";
import { ScheduleInputType } from "@/types/global.types";
import { DefaultButton } from "../atoms/DefaultAtoms";
import { styled } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { insertScheduleData } from "@/services/firebase/db";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { rerenderDataState, showModalState, userInfoState } from "@/states/states";

interface ScheduleAddFromProps {
  scheduleList: ScheduleType[]
}

const InputFormWrapper = styled.div`
  margin-bottom: 10px;
`;

export const ScheduleAddForm = ({
  scheduleList
}: ScheduleAddFromProps) => {
  const setShowModal = useSetRecoilState(showModalState);
  const userInfo = useRecoilValue(userInfoState);
  const [rerenderData, setRerenderDataState] = useRecoilState(rerenderDataState);
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: getToday(),
    toDate: getToday(),
    schedule: ""
  });

  const insertScheduleMutation = useMutation(insertScheduleData, {
    onSuccess(data) {
      scheduleList.push({
        id: data,
        date: getReformDate(scheduleInput.fromDate,"."),
        content: scheduleInput.schedule,
        toDate: getReformDate(scheduleInput.toDate,".")
      });
      setScheduleInput({
        fromDate: getToday(),
        toDate: getToday(),
        schedule: ""
      });
      scheduleList.sort(sortSchedulList);
      setRerenderDataState(!rerenderData);
    }
  });

  const changeSchedule = () => {
    if(scheduleInput.schedule === "") {
      setShowModal({
        show: true,
        title: l('Check'),
        content: l('Please enter your content.')
      });  
    } else if(scheduleInput.fromDate === "" || scheduleInput.toDate === "") {
      setShowModal({
        show: true,
        title: l('Check'),
        content: l('Please enter a date.')
      });
    } else {
      insertScheduleMutation.mutate({
        uid: userInfo?.uid||"",
        newSchedule: {
          content: scheduleInput.schedule,
          date: getReformDate(scheduleInput.fromDate, "."),
          toDate: getReformDate(scheduleInput.toDate, ".")
        }
      });
    }
  }

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
              <DefaultButton
                onClick={changeSchedule}
              >
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