"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultCol, DefaultContainer, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin } from "@/services/firebase/auth";
import { getLastVisible, queryScheduleData } from "@/services/firebase/db";
import { getDay, getReformDate, getToday, getYearRange, l, sortSchedulList } from "@/services/util/util";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Accordion, Col, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { reloadDataState, rerenderDataState, scheduleAccordionActiveState, selectedYearState, showModalState, userInfoState } from "@/states/states";
import { CenterCol } from "../atoms/CustomAtoms";
import { ScheduleAddForm } from "../organisms/ScheduleAddForm";
import { styled } from "styled-components";
import { ScheduleEditForm } from "../organisms/ScheduleEditForm";
import TranslationFromClient from "../organisms/TranslationFromClient";
import { LastVisibleType } from "@/types/global.types";
import ScheduleTopBar from "../organisms/ScheduleTopBar";
import { useQuery } from "@tanstack/react-query";
import { CustomButton } from "../atoms/CustomButton";

interface ScheduleProps {
  scheduleDataFromServer: ScheduleType[];
  lastVisibleFromServer: string | null;
}

const ListWrapper = styled.div`
  margin-bottom: 10px;
`;

const CustomSpinner = styled(Spinner)`
  margin: auto;
  display: flex;
  color: #bfbfbf;
`;

export default function Schedule({
  scheduleDataFromServer,
  lastVisibleFromServer
}: ScheduleProps) {
  const [scheduleList, setScheduleList] = useState<ScheduleType[]>([]);
  const [lastVisible,  setLastVisible] = useState<LastVisibleType>(null);
  const [nextLastVisible,  setNextLastVisible] = useState<LastVisibleType>(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [selectedYear, setSelectedYear] = useRecoilState<string | null>(selectedYearState);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const [reloadData, setReloadData] = useRecoilState(reloadDataState);
  const [allowLoading, setAllowLoading] = useState<boolean>(true);
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [yearRange, setYearRange] = useState({
    fromYear: "",
    toYear: "",
  });
  const [accordionChildren, setAccordionChildren] = useState<ReactNode | null>(null);
  const [scheduleAccordionActive, setScheduleAccordionActive] = useRecoilState(scheduleAccordionActiveState);
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setScheduleList(scheduleDataFromServer);
    setYearRange(getYearRange(getToday().substring(0,4)));
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
          if(lastVisibleFromServer?.constructor === String) {
            setNextLastVisible(await getLastVisible(data?.uid||"", lastVisibleFromServer));
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

    let lastScrollY = 0;
    addEventListener("scroll", e => {
      const scrollY = window.scrollY;
      const direction = lastScrollY - scrollY;
      if(direction < 0) {
        if(document.body.scrollHeight < window.innerHeight + scrollY + 5) {
          if(!noMoreData) buttonRef.current?.click();
        }
      }
      // 현재의 스크롤 값을 저장
      lastScrollY = scrollY;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeAccordionChildren = (scheduleList: ScheduleType[]) => {
    return scheduleList.map((value) => (
      <Accordion.Item key={value?.id} eventKey={value?.id || ""}>
        <Accordion.Header>
          <Col xs={5}>
            <Row>
              <div>
                {getReformDate(value?.date || "", ".")}(
                {l(getDay(value?.date || ""))})
              </div>
            </Row>
            {value?.toDate && value?.date !== value?.toDate && (
              <>
                <Row>
                  <div style={{ fontSize: "14px", color: "#6e6e6e" }}>
                    {"~ " + value?.toDate}{" "}
                    {`(${l(getDay(value?.toDate || ""))})`}
                  </div>
                </Row>
              </>
            )}
          </Col>
          <Col>
            <div style={{ wordBreak: "break-all" }}>{value?.content}</div>
          </Col>
        </Accordion.Header>
        <Accordion.Body>
          <ScheduleEditForm
            beforeSchedule={value}
            scheduleList={scheduleList}
          />
        </Accordion.Body>
      </Accordion.Item>
    ));
  }

  const getScheduleData = async () => {
    try {
      if(userInfo?.uid) {
        setAllowLoading(false);
        return queryScheduleData([
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
        ], userInfo?.uid||"", lastVisible);
      } else {
        return false;
      }
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  const { isLoading, refetch } = useQuery(["loadSchedule"], getScheduleData, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      if(data) {
        const tempList = [...scheduleList, ...data.dataList];
        const uniqueList = tempList.filter((value1, index) => {
          return tempList.findIndex((value2) => {
            return value1?.id === value2?.id;
          }) === index;
        });
        lastVisible && !noMoreData ? setScheduleList(uniqueList) : setScheduleList(data.dataList);
        data.lastVisible ? setNextLastVisible(data.lastVisible) : setNoMoreData(true);
  
        setAllowLoading(true);
        setReloadData(false);
      }
    },
    onError: (e: any) => {
      console.log(e.message);
      setAllowLoading(true);
    }
  });

  useEffect(() => {
    if(firstLoading) {
      setFirstLoading(false);
    } else {
      setRerenderData(!rerenderData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleList]);

  useEffect(() => {
    if(scheduleList.length > 0) {
      scheduleList.sort(sortSchedulList);
      setAccordionChildren(makeAccordionChildren(scheduleList));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[rerenderData]);

  useEffect(() => {
    if(selectedYear) {
      setYearRange(getYearRange(selectedYear));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    if(selectedYear) {
      setReloadData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearRange]);

  useEffect(() => {
    if(reloadData) {
      setAccordionChildren(<></>);
      setNoMoreData(false);
      setLastVisible(null);
      setScheduleList([]);
    }
    if(reloadData || lastVisible) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData, lastVisible]);

  return (
    <DefaultContainer>
      <TranslationFromClient />
      <ScheduleTopBar />
      <ScheduleAddForm scheduleList={scheduleList} />
      <DefaultRow>
        <DefaultCol>
          <ListWrapper>
            {scheduleList.length > 0 ? (
              <Accordion
                defaultActiveKey={scheduleAccordionActive}
                onSelect={(e) => {
                  setScheduleAccordionActive(e);
                }}
              >
                {accordionChildren ||
                  makeAccordionChildren(scheduleDataFromServer)}
              </Accordion>
            ) : reloadData ? (
              <DefaultRow>
                <CenterCol>
                  <CustomSpinner animation="border" />
                </CenterCol>
              </DefaultRow>
            ) : (
              <DefaultRow>
                <CenterCol>{l("No content viewed.")}</CenterCol>
              </DefaultRow>
            )}
          </ListWrapper>
        </DefaultCol>
      </DefaultRow>
      {nextLastVisible && (
        <Row>
          <CenterCol>
            {scheduleList.length > 0 &&
              !noMoreData &&
              (allowLoading && !isLoading ? (
                <CustomButton
                  align="center"
                  ref={buttonRef}
                  onClick={() => {
                    setLastVisible(nextLastVisible);
                  }}
                >
                  {l("Load More")}
                </CustomButton>
              ) : (
                <CustomButton align="center">
                  <CustomSpinner animation="border" />
                </CustomButton>
              ))}
          </CenterCol>
        </Row>
      )}
    </DefaultContainer>
  );
}