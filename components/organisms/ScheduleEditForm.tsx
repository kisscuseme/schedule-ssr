"use client";

import { Button, Col, Row, useAccordionButton } from "react-bootstrap";
import {
  EventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { deleteScheduleData, updateScheduleData } from "@/services/firebase/db";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  reloadDataState,
  rerenderDataState,
  resetClearButtonState,
  scheduleAccordionActiveState,
  showModalState,
  userInfoState,
} from "@/states/states";
import { getReformDate, l, sortSchedulList } from "@/services/util/util";
import { ScheduleInputForm } from "./ScheduleInputForm";
import {
  ScheduleEditFormTextType,
  ScheduleInputType,
  ScheduleType,
} from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { CustomButton } from "../atoms/CustomButton";

// schedule edit form props
export interface ScheduleEditFormProps {
  beforeSchedule: ScheduleType;
  scheduleList: ScheduleType[];
  scheduleEditFormTextFromServer: ScheduleEditFormTextType;
}

export const ScheduleEditForm = ({
  beforeSchedule, // 수정 전 데이터
  scheduleList, // 추가 후 갱신을 위해 가져 온 참조 오브젝트
  scheduleEditFormTextFromServer, // 언어 설정에 따라 서버에서 가져온 텍스트 (최초 렌더링 시에만 활용)
}: ScheduleEditFormProps) => {
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: "",
    toDate: "",
    schedule: "",
  });
  const userInfo = useRecoilValue(userInfoState);
  const setShowModal = useSetRecoilState(showModalState);
  const reloadData = useRecoilValue(reloadDataState);
  const closeAccordion = useAccordionButton(beforeSchedule?.id || "");
  const closeAccordionButtonRef = useRef<HTMLButtonElement>(null);
  const [scheduleAccordionActive, setScheduleAccordionActive] = useRecoilState(
    scheduleAccordionActiveState
  );
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const [resetClearButton, setResetClearButton] = useRecoilState(
    resetClearButtonState
  );
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setFirstLoading(false); // 최초 로딩 후 false로 변경
    setScheduleInput({
      fromDate: (beforeSchedule?.date || "")
        .substring(0, 10)
        .replaceAll(".", "-"),
      toDate: (beforeSchedule?.toDate || "")
        .substring(0, 10)
        .replaceAll(".", "-"),
      schedule: beforeSchedule?.content || "",
      id: beforeSchedule?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 선택되어 있는 Accordion을 닫기 위한 로직 (페이지 새로고침 전까지는 자동으로 닫히지 않음)
    if (beforeSchedule?.id === scheduleAccordionActive) {
      setScheduleAccordionActive(null);
      closeAccordionButtonRef.current?.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);

  // 수정 전 데이터로 되돌림
  const resetChange = () => {
    setScheduleInput({
      fromDate: (beforeSchedule?.date || "")
        .substring(0, 10)
        .replaceAll(".", "-"),
      toDate: (beforeSchedule?.toDate || "")
        .substring(0, 10)
        .replaceAll(".", "-"),
      schedule: beforeSchedule?.content || "",
      id: beforeSchedule?.id || "",
    });
    // input 컴포넌트에 데이터만 바인딩할 경우 clear 버튼이 보이지 않기 때문에 재 렌더링이 필요함
    setResetClearButton(!resetClearButton);
  };

  // 데이터 변경 시 react query 활용
  const changeScheduleMutation = useMutation(updateScheduleData, {
    onSuccess() {
      // 성공 시 참조 오브젝트 데이터 변경 (db에서 데이터를 새로 조회하지 않음)
      const index = scheduleList.findIndex(
        (schedule) => schedule?.id === beforeSchedule?.id
      );
      if (index > -1) {
        scheduleList[index] = {
          id: beforeSchedule?.id || "",
          date: getReformDate(scheduleInput.fromDate, "."),
          content: scheduleInput.schedule,
          toDate: getReformDate(scheduleInput.toDate, "."),
        };
      }
      // 수정된 데이터를 고려하여 날짜 순으로 재 정렬
      scheduleList.sort(sortSchedulList);
      // 데이터 변경 후 리스트 재 렌더링을 위한 recoil 전역 상태
      setRerenderData(!rerenderData);
    },
  });

  const changeSchedule = (
    event: SyntheticEvent<any, Event>,
    eventHandler: EventHandler<SyntheticEvent<any, Event>>
  ) => {
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
    } else if (
      scheduleInput.schedule === beforeSchedule?.content &&
      getReformDate(scheduleInput.fromDate, "-") ===
        getReformDate(beforeSchedule?.date || "", "-") &&
      getReformDate(scheduleInput.toDate, "-") ===
        getReformDate(beforeSchedule?.toDate || "", "-")
    ) {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Everything is the same."),
      });
    } else {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Are you sure you want to edit?"),
        confirm: () => {
          changeScheduleMutation.mutate({
            uid: userInfo?.uid || "",
            scheduleId: beforeSchedule?.id || "",
            newSchedule: {
              content: scheduleInput.schedule,
              date: getReformDate(scheduleInput.fromDate, "."),
              toDate: getReformDate(scheduleInput.toDate, "."),
            },
          });
          eventHandler(event);
        },
      });
    }
  };

  // 데이터 삭제 시 react query 활용
  const deleteScheduleMutation = useMutation(deleteScheduleData, {
    onSuccess() {
      // 데이터 삭제 후 참조 오브젝트에서 제거하기 위한 로직 (db를 재 조회하지 않음)
      scheduleList.sort((a, b) => {
        if (a === null || b === null) return 0;
        else {
          let numA = Number(a.date.replaceAll(".", "").substring(0, 8));
          let numB = Number(b.date.replaceAll(".", "").substring(0, 8));
          if (b.id === beforeSchedule?.id) return -1;
          else return numB - numA;
        }
      });
      scheduleList.pop();
      // 데이터 삭제 후 리스트 재 렌더링을 위한 recoil 전역 상태
      setRerenderData(!rerenderData);
    },
  });

  const deleteSchedule = (
    event: SyntheticEvent<any, Event>,
    eventHandler: EventHandler<SyntheticEvent<any, Event>>
  ) => {
    setShowModal({
      show: true,
      title: l("Caution"),
      content: l("Are you sure you want to delete?"),
      confirm: () => {
        deleteScheduleMutation.mutate({
          uid: userInfo?.uid || "",
          scheduleId: beforeSchedule?.id || "",
        });
        eventHandler(event);
      },
    });
  };

  return (
    <>
      <ScheduleInputForm
        scheduleInput={scheduleInput}
        setScheduleInput={setScheduleInput}
        scheduleInputPlaceholder={beforeSchedule?.content}
        initValue={beforeSchedule?.content}
      />
      <Row>
        <Col>
          <CustomButton
            onClick={resetChange}
            color="#6e6e6e"
            backgroundColor="#ffffff"
          >
            {firstLoading
              ? scheduleEditFormTextFromServer?.resetButton
              : l("Reset")}
          </CustomButton>
        </Col>
        <Col>
          <CustomButton
            onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
              changeSchedule(e, closeAccordion);
            }}
            color="#ffffff"
            backgroundColor="#8e8e8e"
          >
            {firstLoading
              ? scheduleEditFormTextFromServer?.editButton
              : l("Edit")}
          </CustomButton>
        </Col>
        <Col>
          <CustomButton
            onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
              deleteSchedule(e, closeAccordion);
            }}
            color="#ffffff"
            backgroundColor="#ff7171"
          >
            {firstLoading
              ? scheduleEditFormTextFromServer?.deleteButton
              : l("Delete")}
          </CustomButton>
        </Col>
      </Row>
      <div className="hidden-button">
        <Button
          ref={closeAccordionButtonRef}
          onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
            closeAccordion(e);
          }}
        >
          close accordion
        </Button>
      </div>
    </>
  );
};
