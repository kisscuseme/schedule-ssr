"use client";

import { ScheduleType } from "@/services/firebase/firebase.type"
import { Accordion, Col, Row } from "react-bootstrap"
import { ScheduleInputForm } from "./ScheduleInputForm"
import { getReformDate, getToday, l, sortSchedulList } from "@/services/util/util"
import { useEffect, useState } from "react";
import { ScheduleInputType } from "@/types/global.types";
import { styled } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { insertScheduleData } from "@/services/firebase/db";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { rerenderDataState, showModalState, userInfoState } from "@/states/states";
import { CustomButton } from "../atoms/CustomButton";
import { accordionCustomStyle } from "../molecules/CustomMolecules";

interface ScheduleAddFromProps {
  scheduleList: ScheduleType[]
}

const InputFormWrapper = styled.div`
  margin-bottom: 10px;
`;

const AccordionBody = styled(Accordion.Body)`
  padding: 10px 20px;
`;

export const ScheduleAddForm = ({
  scheduleList
}: ScheduleAddFromProps) => {
  const setShowModal = useSetRecoilState(showModalState);
  const userInfo = useRecoilValue(userInfoState);
  const [rerenderData, setRerenderDataState] = useRecoilState(rerenderDataState);
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: "",
    toDate: "",
    schedule: ""
  });

  useEffect(() => {
    setScheduleInput({
      fromDate: getToday(),
      toDate: getToday(),
      schedule: ""
    })
  }, []);

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
      <style>
        {accordionCustomStyle}
      </style>
      <Accordion defaultActiveKey="ScheduleAddForm">
        <Accordion.Item eventKey="ScheduleAddForm">
          <Accordion.Header>
            <div color="#5f5f5f">{`[${l("Enter schedule")}]`}</div>
          </Accordion.Header>
          <AccordionBody>
            <ScheduleInputForm
              scheduleInput={scheduleInput}
              setScheduleInput={setScheduleInput}
              scheduleInputPlaceholder={l("Enter your schedule.")}
            />
          <Row>
            <Col>
              <CustomButton
                onClick={changeSchedule}
              >
                {l("Add")}
              </CustomButton>
            </Col>
          </Row>
          </AccordionBody>
        </Accordion.Item>
      </Accordion>    
    </InputFormWrapper>
  )
}