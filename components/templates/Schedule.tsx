"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultContainer, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { queryScheduleData } from "@/services/firebase/db";
import { getDay, getReformDate, getToday, getYearRange, s } from "@/services/util/util";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { t } from "i18next";
import TranslationFromClient from "../organisms/TranslationFromClient";
import { useRecoilValue } from "recoil";
import { rerenderDataState } from "@/states/states";
import { ScheduleInputForm } from "../organisms/ScheduleInputForm";
import { ScheduleInputType } from "@/types/global.types";

interface ScheduleProps {
  scheduleData: ScheduleType[];
  lastVisible: string;
}

export default function Schedule({
  scheduleData,
  lastVisible
}: ScheduleProps) {
  const rerenderData = useRecoilValue(rerenderDataState);
  const [scheduleList, setScheduleList] = useState(scheduleData);
  const nextLastVisible: QueryDocumentSnapshot<DocumentData> = JSON.parse(lastVisible);
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: getToday(),
    toDate: getToday(),
    schedule: ""
  });

  useEffect(() => {
    checkLogin().then(async (user) => {
      const selectedYear = getToday().substring(0,4);
      const yearRange = getYearRange(selectedYear);
      const data = await queryScheduleData([
        {
          field: "date",
          operator: ">=",
          value: yearRange.fromYear
        },
        {
          field: "date",
          operator: "<=",
          value: yearRange.toYear
        }
      ], user?.uid||"", nextLastVisible);
      scheduleList.push(data.dataList[0]);
      setScheduleList(scheduleList);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  },[rerenderData]);

  return (
    <DefaultContainer>
      <TranslationFromClient locale="kr"/>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton
            onClick={async () => {
              await logOut();
              location.href = "/signin";
            }}
          >
            Sign Out
          </DefaultButton>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <ScheduleInputForm
          scheduleInput={scheduleInput}
          setScheduleInput={setScheduleInput}
          scheduleInputPlaceholder={s(t("Enter your schedule."))}
        />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton>
            {s(t("Add"))}
          </DefaultButton>
        </DefaultCol>
      </DefaultRow>
      <Accordion defaultActiveKey="">
        {scheduleList.map((value) => (
          <Accordion.Item key={value?.id} eventKey={value?.id||""}>
            <Accordion.Header>
              {getReformDate(value?.date||"", ".")}({s(t(getDay(value?.date||"")))}) {value?.content}
            </Accordion.Header>
            <Accordion.Body>
              {value?.id||""}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </DefaultContainer>
  );
}