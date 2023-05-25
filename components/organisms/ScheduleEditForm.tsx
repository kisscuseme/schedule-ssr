import { Col, Row, useAccordionButton } from "react-bootstrap";
import { EventHandler, SyntheticEvent, useEffect, useRef, useState } from "react";
import { ScheduleType } from "@/services/firebase/firebase.type";
import { deleteScheduleData, updateScheduleData } from "@/services/firebase/db";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { reloadDataState, rerenderDataState, resetClearButtonState, scheduleAccordionActiveState, showModalState, userInfoState } from "@/states/states";
import { getReformDate, s, sortSchedulList } from "@/services/util/util";
import { ScheduleInputForm } from "./ScheduleInputForm";
import { ScheduleInputType } from "@/types/global.types";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { DefaultButton } from "../atoms/DefaultAtoms";

interface ScheduleEditFromProps {
  beforeSchedule: ScheduleType
  scheduleList: ScheduleType[]
}

export const ScheduleEditForm = ({
  beforeSchedule,
  scheduleList
}: ScheduleEditFromProps) => {
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: (beforeSchedule?.date||"").substring(0,10).replaceAll(".","-"),
    toDate: (beforeSchedule?.toDate||"").substring(0,10).replaceAll(".","-"),
    schedule: beforeSchedule?.content||""
  });
  const userInfo = useRecoilValue(userInfoState);
  const setShowModal = useSetRecoilState(showModalState);
  const reloadData = useRecoilValue(reloadDataState);
  const closeAccordion = useAccordionButton(beforeSchedule?.id||"");
  const closeAccordionButtonRef = useRef<HTMLButtonElement>(null);
  const [scheduleAccordionActive, setScheduleAccordionActive] = useRecoilState(scheduleAccordionActiveState);
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const [resetClearButton, setResetClearButton] = useRecoilState(resetClearButtonState);

  useEffect(() => {
    if(beforeSchedule?.id === scheduleAccordionActive) {
      setScheduleAccordionActive(null);
      closeAccordionButtonRef.current?.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);
  
  const resetChange = () => {
    setScheduleInput({
      fromDate: (beforeSchedule?.date||"").substring(0,10).replaceAll(".","-"),
      toDate: (beforeSchedule?.toDate||"").substring(0,10).replaceAll(".","-"),
      schedule: beforeSchedule?.content||"",
      id: beforeSchedule?.id||""
    });
    setResetClearButton(!resetClearButton);
  }

  const changeScheduleMutation = useMutation(updateScheduleData, {
    onSuccess() {
      const index = scheduleList.findIndex((schedule) => schedule?.id === beforeSchedule?.id);
      if(index > -1) {
        scheduleList[index] = {
          id: beforeSchedule?.id||"",
          date: getReformDate(scheduleInput.fromDate,"."),
          content: scheduleInput.schedule,
          toDate: getReformDate(scheduleInput.toDate,".")
        };
      }
      scheduleList.sort(sortSchedulList);
      setRerenderData(!rerenderData);
    }
  });

  const changeSchedule = (event: SyntheticEvent<any, Event>, eventHandler: EventHandler<SyntheticEvent<any, Event>>) => {
    if(scheduleInput.schedule === "") {
      setShowModal({
        show: true,
        title: s(t("Check")),
        content: s(t("Please enter your content."))
      });  
    } else if(scheduleInput.fromDate === "" || scheduleInput.toDate === "") {
      setShowModal({
        show: true,
        title: s(t("Check")),
        content: s(t("Please enter a date."))
      });
    } else if(scheduleInput.schedule === beforeSchedule?.content && getReformDate(scheduleInput.fromDate,"-") === getReformDate(beforeSchedule?.date||"", "-") && getReformDate(scheduleInput.toDate,"-") === getReformDate(beforeSchedule?.toDate||"", "-")){
      setShowModal({
        show: true,
        title: s(t("Check")),
        content: s(t("Everything is the same."))
      });
    } else {
      setShowModal({
        show: true,
        title: s(t("Check")),
        content: s(t("Are you sure you want to edit?")),
        confirm: () => {
          changeScheduleMutation.mutate({
            uid: userInfo?.uid||"",
            scheduleId: beforeSchedule?.id||"",
            newSchedule: {
              content: scheduleInput.schedule,
              date: getReformDate(scheduleInput.fromDate, "."),
              toDate: getReformDate(scheduleInput.toDate, ".")
            }
          });
          eventHandler(event);
        }
      });
    }
  }

  const deleteScheduleMutation = useMutation(deleteScheduleData, {
    onSuccess() {
      scheduleList.sort((a, b) => {
        if(a === null || b === null) return 0
        else {
          let numA = Number(a.date.replaceAll(".","").substring(0,8));
          let numB = Number(b.date.replaceAll(".","").substring(0,8));
          if(b.id === beforeSchedule?.id) return -1;
          else return numB - numA;
        }
      });
      scheduleList.pop();
      setRerenderData(!rerenderData);
    },
  });

  const deleteSchedule = (event: SyntheticEvent<any, Event>, eventHandler: EventHandler<SyntheticEvent<any, Event>>) => {
    setShowModal({
      show: true,
      title: s(t("Caution")),
      content: s(t("Are you sure you want to delete?")),
      confirm: () => {
        deleteScheduleMutation.mutate({
          uid: userInfo?.uid||"",
          scheduleId: beforeSchedule?.id||""
        });
        eventHandler(event);
      }
    });
  }

  return (
    <>
      <ScheduleInputForm
        scheduleInput={scheduleInput}
        setScheduleInput={setScheduleInput}
        scheduleInputPlaceholder={beforeSchedule?.content}
      />
      <Row>
        <Col>
          <DefaultButton
            onClick={resetChange}
          >
            {s(t("Reset"))}
          </DefaultButton>
        </Col>
        <Col>
          <DefaultButton
            onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
              changeSchedule(e, closeAccordion);
            }}
          >
            {s(t("Edit"))}
          </DefaultButton>
        </Col>
        <Col>
          <DefaultButton
            onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
              deleteSchedule(e, closeAccordion);
            }}
          >
            {s(t("Delete"))}
          </DefaultButton>
        </Col>
      </Row>
      <div className="hidden-button">
        <DefaultButton
          btnRef={closeAccordionButtonRef}
          onClick={(e: SyntheticEvent<HTMLButtonElement, Event>) => {
            closeAccordion(e);
          }}
        >
          close accordion
        </DefaultButton>
      </div>
    </>
  );
}