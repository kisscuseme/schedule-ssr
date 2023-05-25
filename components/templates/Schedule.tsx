"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultContainer, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { getLastVisible, queryScheduleData } from "@/services/firebase/db";
import { getDay, getReformDate, getToday, getYearRange, l } from "@/services/util/util";
import { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import TranslationFromClient from "../organisms/TranslationFromClient";
import { useRecoilState, useRecoilValue } from "recoil";
import { rerenderDataState, userInfoState } from "@/states/states";
import { ScheduleInputForm } from "../organisms/ScheduleInputForm";
import { ScheduleInputType } from "@/types/global.types";
import { CenterCol } from "../atoms/CustomAtoms";
import { ScheduleAddForm } from "../organisms/ScheduleAddForm";
import { styled } from "styled-components";
import { ScheduleEditForm } from "../organisms/ScheduleEditForm";

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
  const [nextLastVisible,  setNextLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null>(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const getNextData = async () => {
    try{
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
      ], userInfo?.uid||"", nextLastVisible);
      setNextLastVisible(data.lastVisible);
      setScheduleList([...scheduleList, ...data.dataList]);
    } catch(error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
  },[rerenderData, scheduleList]);

  useEffect(() => {
    checkLogin().then(async (data) => {
      try{
        if(data) {
          document.cookie = `token=${await data.getIdToken()}`;
          if(!userInfo) {
            setUserInfo({
              uid: data?.uid||"",
              name: data?.displayName||"",
              email: data?.email||""
            });
          }
          if(lastVisible?.constructor === String) {
            setNextLastVisible(await getLastVisible(data?.uid||"", lastVisible));
          }
        } else {
          document.cookie = "";
          setUserInfo(null);
        }
      } catch(error: any) {
        console.log(error);
      }

    }).catch((error) => {
      console.log(error);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <ScheduleEditForm
                      beforeSchedule={value}
                      scheduleList={scheduleData}
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