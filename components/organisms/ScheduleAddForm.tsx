"use client";

import { Accordion, Col, Row } from "react-bootstrap";
import { ScheduleInputForm } from "./ScheduleInputForm";
import {
  getReformDate,
  getToday,
  l,
  sortSchedulList,
} from "@/services/util/util";
import { KeyboardEvent, useEffect, useState } from "react";
import {
  ScheduleAddFormTextType,
  ScheduleInputType,
  ScheduleType,
} from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { insertScheduleData } from "@/services/firebase/db";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  rerenderDataState,
  showModalState,
  userInfoState,
} from "@/states/states";
import { CustomButton } from "../atoms/CustomButton";

// schedule add form props
export interface ScheduleAddFormProps {
  scheduleList: ScheduleType[];
  scheduleAddFormTextFromServer: ScheduleAddFormTextType;
}

export const ScheduleAddForm = ({
  scheduleList, // 추가 후 갱신을 위해 가져 온 참조 오브젝트
  scheduleAddFormTextFromServer, // 언어 설정에 따라 서버에서 가져온 텍스트 (최초 렌더링 시에만 활용)
}: ScheduleAddFormProps) => {
  const setShowModal = useSetRecoilState(showModalState);
  const userInfo = useRecoilValue(userInfoState);
  const [rerenderData, setRerenderDataState] =
    useRecoilState(rerenderDataState);
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: "",
    toDate: "",
    schedule: "",
  });
  const [fold, setFold] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setFirstLoading(false); // 최초 로딩 후 false로 변경
    setScheduleInput({
      fromDate: getToday(),
      toDate: getToday(),
      schedule: "",
    });
  }, []);

  // 데이터 추가 시 react query 활용
  const insertScheduleMutation = useMutation(insertScheduleData, {
    onSuccess(data) {
      // 성공 시 참조 오브젝트에 데이터 추가 (db에서 데이터를 새로 조회하지 않음)
      scheduleList.push({
        id: data,
        date: getReformDate(scheduleInput.fromDate, "."),
        content: scheduleInput.schedule,
        toDate: getReformDate(scheduleInput.toDate, "."),
      });
      setScheduleInput({
        fromDate: getToday(),
        toDate: getToday(),
        schedule: "",
      });
      // 추가된 데이터를 고려하여 날짜 순으로 재 정렬
      scheduleList.sort(sortSchedulList);
      // 데이터 추가 후 리스트 재 렌더링을 위한 recoil 전역 상태
      setRerenderDataState(!rerenderData);
    },
  });

  const addSchedule = () => {
    if (scheduleInput.schedule === "") {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Please enter your content."),
      });
    } else if (scheduleInput.fromDate === "" || scheduleInput.toDate === "") {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Please enter a date."),
      });
    } else {
      insertScheduleMutation.mutate({
        uid: userInfo?.uid || "",
        newSchedule: {
          content: scheduleInput.schedule,
          date: getReformDate(scheduleInput.fromDate, "."),
          toDate: getReformDate(scheduleInput.toDate, "."),
        },
      });
    }
  };

  // 엔터 입력 시 버튼 클릭 효과
  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSchedule();
    }
  };

  return (
    <Accordion
      defaultActiveKey="ScheduleAddForm"
      onSelect={() => {
        setFold(!fold);
      }}
    >
      <Accordion.Item eventKey="ScheduleAddForm">
        <Accordion.Header>
          <div color="#5f5f5f">{`${
            firstLoading
              ? scheduleAddFormTextFromServer?.title
              : l("Enter schedule")
          } ${fold ? "▲" : "▼"}`}</div>
        </Accordion.Header>
        <Accordion.Body>
          <ScheduleInputForm
            scheduleInput={scheduleInput}
            setScheduleInput={setScheduleInput}
            scheduleInputPlaceholder={
              firstLoading
                ? scheduleAddFormTextFromServer?.placeholder
                : l("Enter your schedule.")
            }
            onKeyUpHandler={enterKeyUpEventHandler}
          />
          <Row>
            <Col>
              <CustomButton
                onClick={addSchedule}
                backgroundColor="#3e3e3e"
                color="#fefefe"
              >
                {firstLoading
                  ? scheduleAddFormTextFromServer?.button
                  : l("Add")}
              </CustomButton>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
