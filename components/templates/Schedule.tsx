"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultContainer, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { getLastVisible, queryScheduleData } from "@/services/firebase/db";
import { getDay, getReformDate, getToday, getYearRange, l } from "@/services/util/util";
import { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { t } from "i18next";
import TranslationFromClient from "../organisms/TranslationFromClient";
import { useRecoilValue } from "recoil";
import { rerenderDataState } from "@/states/states";
import { ScheduleInputForm } from "../organisms/ScheduleInputForm";
import { ScheduleInputType } from "@/types/global.types";
import { CenterCol } from "../atoms/CustomAtoms";
import { ScheduleAddForm } from "../organisms/ScheduleAddForm";
import { styled } from "styled-components";
import { firebaseAuth } from "@/services/firebase/firebase";

interface ScheduleProps {
  scheduleData: ScheduleType[];
  lastVisible: string | null;
}

const ListWrapper = styled.div`
  margin-bottom: 10px;
`;

export default function Schedule({
  scheduleData,
  lastVisible
}: ScheduleProps) {
  const rerenderData = useRecoilValue(rerenderDataState);
  const [scheduleList, setScheduleList] = useState(scheduleData);
  const [uid, setUid] = useState("");
  const [nextLastVisible,  setNextLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null>(null);
  const [scheduleInput, setScheduleInput] = useState<ScheduleInputType>({
    fromDate: getToday(),
    toDate: getToday(),
    schedule: ""
  });

  const getNextData = async () => {
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
    ], uid, nextLastVisible);
    setNextLastVisible(data.lastVisible);
    setScheduleList([...scheduleList, ...data.dataList]);
  }

  useEffect(() => {
  },[rerenderData, scheduleList]);

  useEffect(() => {
    checkLogin().then(async (user) => {
      setUid(user?.uid||"");
      if(lastVisible?.constructor === String) {
        setNextLastVisible(await getLastVisible(user?.uid||"", lastVisible));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      console.log("refresh token");
      const { currentUser } = firebaseAuth;
      if (currentUser) await currentUser.getIdToken(true);
    }, 1 * 60 * 1000);

    return () => clearInterval(refreshToken);
  }, []);

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
          <ScheduleAddForm
            scheduleList={scheduleList}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <ListWrapper>
            <Accordion defaultActiveKey="">
              {scheduleList.map((value) => (
                <Accordion.Item key={value?.id} eventKey={value?.id||""}>
                  <Accordion.Header>
                    {getReformDate(value?.date||"", ".")}({l(getDay(value?.date||""))}) {value?.content}
                  </Accordion.Header>
                  <Accordion.Body>
                    <ScheduleInputForm
                      scheduleInput={scheduleInput}
                      setScheduleInput={setScheduleInput}
                      scheduleInputPlaceholder={value?.content}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </ListWrapper>
        </DefaultCol>
      </DefaultRow>
      {nextLastVisible &&
        <DefaultRow>
          <CenterCol>
            <Button onClick={() => {
              getNextData();
            }}>
              {l("Load More")}
            </Button>
          </CenterCol>
        </DefaultRow>
      }
    </DefaultContainer>
  );
}