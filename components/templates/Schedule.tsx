"use client";

import {
  DefaultCol,
  DefaultContainer,
  DefaultRow,
} from "../atoms/DefaultAtoms";
import { checkLogin } from "@/services/firebase/auth";
import { getLastVisible, queryScheduleData } from "@/services/firebase/db";
import {
  getDay,
  getReformDate,
  getToday,
  getYearRange,
  l,
  setCookie,
  sortSchedulList,
} from "@/services/util/util";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  reloadDataState,
  rerenderDataState,
  scheduleAccordionActiveState,
  selectedYearState,
  userInfoState,
} from "@/states/states";
import { CenterCol } from "../atoms/CustomAtoms";
import { ScheduleAddForm } from "../organisms/ScheduleAddForm";
import { ScheduleEditForm } from "../organisms/ScheduleEditForm";
import TranslationFromClient from "../organisms/TranslationFromClient";
import {
  ComponentsTextType,
  LastVisibleType,
  ScheduleType,
} from "@/types/types";
import ScheduleTopBar from "../organisms/ScheduleTopBar";
import { useQuery } from "@tanstack/react-query";
import { CustomButton } from "../atoms/CustomButton";
import { DivisionLine } from "../molecules/DefaultMolecules";
import {
  accordionCustomStyle,
  CustomSpinner,
} from "../molecules/CustomMolecules";

// schedule component props
export interface ScheduleProps {
  scheduleDataFromServer: {
    dataList: ScheduleType[];
    lastVisible: string | null;
    componentsText: ComponentsTextType;
  };
}

export default function Schedule({ scheduleDataFromServer }: ScheduleProps) {
  const [scheduleList, setScheduleList] = useState<ScheduleType[]>([]);
  const [lastVisible, setLastVisible] = useState<LastVisibleType>(null);
  const [nextLastVisible, setNextLastVisible] = useState<LastVisibleType>(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const selectedYear = useRecoilValue<string | null>(selectedYearState);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const [reloadData, setReloadData] = useRecoilState(reloadDataState);
  const [allowLoading, setAllowLoading] = useState<boolean>(true);
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [yearRange, setYearRange] = useState({
    fromYear: "",
    toYear: "",
  });
  const [accordionChildren, setAccordionChildren] = useState<ReactNode | null>(
    null
  );
  const [scheduleAccordionActive, setScheduleAccordionActive] = useRecoilState(
    scheduleAccordionActiveState
  );
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    // 서버로부터 전달받은 데이터 셋팅 (첫 렌더링 시에는 서버 데이터 직접 활용)
    setScheduleList(scheduleDataFromServer.dataList);
    // 최초 해당 년도 year range 셋팅
    setYearRange(getYearRange(getToday().substring(0, 4)));
    // 로그인 정보 셋팅
    checkLogin()
      .then(async (data) => {
        try {
          if (data) {
            if (!userInfo) {
              setUserInfo({
                uid: data?.uid || "",
                name: data?.displayName || "",
                email: data?.email || "",
              });
            }
            // 서버로부터 전달 받은 마지막 데이터 키 값을 다음 로드할 데이터 기준점으로 활용
            // 서버와 클라이언트 간 lastVisible 데이터 구조가 일치하지 않아 추가함
            if (scheduleDataFromServer.lastVisible?.constructor === String) {
              setNextLastVisible(
                await getLastVisible(
                  data?.uid || "",
                  scheduleDataFromServer.lastVisible
                )
              );
            }
          } else {
            setCookie("token", "", -1);
            setUserInfo(null);
          }
        } catch (error: any) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // 무한 로딩을 위한 스크롤 이벤트 리스너
    let lastScrollY = 0;
    addEventListener("scroll", (e) => {
      const scrollY = window.scrollY;
      const direction = lastScrollY - scrollY;
      if (direction < 0) {
        if (document.body.scrollHeight < window.innerHeight + scrollY + 5) {
          if (!noMoreData) buttonRef.current?.click();
        }
      }
      // 현재의 스크롤 값을 저장
      lastScrollY = scrollY;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // accordion 컴포넌트로 리스트를 만들기 위한 함수
  const makeAccordionChildren = (scheduleList: ScheduleType[]) => {
    return scheduleList.map((value) => (
      <Accordion.Item key={value?.id} eventKey={value?.id || ""}>
        <Accordion.Header>
          <Col xs={5}>
            <Row>
              <div
                style={{
                  opacity:
                    Number(getReformDate(value?.date || getToday(), "")) >
                    Number(getReformDate(getToday(), ""))
                      ? "0.7"
                      : Number(getReformDate(value?.date || getToday(), "")) <
                        Number(getReformDate(getToday(), ""))
                      ? "0.4"
                      : "1.0",
                }}
              >
                {firstLoading
                  ? value?.date
                  : `${getReformDate(value?.date || "", ".")} (${l(
                      getDay(value?.date || "")
                    )})`}
              </div>
            </Row>
            {value?.toDate && value?.date !== value?.toDate && (
              <>
                <Row>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#9e9e9e",
                      opacity:
                        Number(getReformDate(value?.date || getToday(), "")) >
                        Number(getReformDate(getToday(), ""))
                          ? "0.7"
                          : Number(
                              getReformDate(value?.date || getToday(), "")
                            ) < Number(getReformDate(getToday(), ""))
                          ? "0.4"
                          : "1.0",
                    }}
                  >
                    {firstLoading
                      ? `~ ${value?.toDate}`
                      : `~ ${getReformDate(value?.toDate || "", ".")} (${l(
                          getDay(value?.toDate || "")
                        )})`}
                  </div>
                </Row>
              </>
            )}
          </Col>
          <Col>
            <div
              style={{
                wordBreak: "break-all",
                opacity:
                  Number(getReformDate(value?.date || getToday(), "")) >
                  Number(getReformDate(getToday(), ""))
                    ? "0.7"
                    : Number(getReformDate(value?.date || getToday(), "")) <
                      Number(getReformDate(getToday(), ""))
                    ? "0.4"
                    : "1.0",
              }}
            >
              {value?.content}
            </div>
          </Col>
        </Accordion.Header>
        <Accordion.Body>
          <ScheduleEditForm
            beforeSchedule={value}
            scheduleList={scheduleList}
            scheduleEditFormTextFromServer={
              scheduleDataFromServer.componentsText.scheduleEditForm
            }
          />
        </Accordion.Body>
      </Accordion.Item>
    ));
  };

  // 클라이언트에서 스케쥴 데이터를 추가 로딩하기 위한 함수
  const getScheduleData = async () => {
    try {
      if (userInfo?.uid) {
        setAllowLoading(false);
        return queryScheduleData(
          [
            {
              field: "date",
              operator: ">=",
              value: yearRange.fromYear,
            },
            {
              field: "date",
              operator: "<=",
              value: yearRange.toYear,
            },
          ],
          userInfo?.uid || "",
          lastVisible
        );
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(error);
      return false;
    }
  };

  // 데이터 조회에 react query를 활용
  const { isLoading, refetch } = useQuery(["loadSchedule"], getScheduleData, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      if (data) {
        // 조회 성공 시 중복 데이터 제거 (추가/변경된 데이터가 있을 경우 db 재조회를 하지 않고 걸러내기 위함)
        const tempList = [...scheduleList, ...data.dataList];
        const uniqueList = tempList.filter((value1, index) => {
          return (
            tempList.findIndex((value2) => {
              return value1?.id === value2?.id;
            }) === index
          );
        });
        //lastVisible이 null일 경우 더 이상 조회할 데이터가 없다고 판단함
        lastVisible && !noMoreData
          ? setScheduleList(uniqueList)
          : setScheduleList(data.dataList);
        data.lastVisible
          ? setNextLastVisible(data.lastVisible)
          : setNoMoreData(true);

        setAllowLoading(true);
        setReloadData(false);
      }
    },
    onError: (e: any) => {
      console.log(e.message);
      setAllowLoading(true);
    },
  });

  // 최초 로딩 시 서버에서 가져 온 데이터를 보여주기 때문에 다시 렌더링을 할 필요가 없음
  useEffect(() => {
    if (firstLoading) {
      setFirstLoading(false);
    } else {
      setRerenderData(!rerenderData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleList]);

  // 재 랜더링 요청 시 accordion 컴포넌트를 다시 생성
  useEffect(() => {
    if (scheduleList.length > 0) {
      scheduleList.sort(sortSchedulList);
      setAccordionChildren(makeAccordionChildren(scheduleList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerenderData]);

  // Dropdown 컴포넌트로 년도 선택 시 선택된 년도로 year range 변경
  useEffect(() => {
    if (selectedYear) {
      setYearRange(getYearRange(selectedYear));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  // year range 변경 시 리스트 재 조회 요청 (재 렌더링 아님)
  useEffect(() => {
    if (selectedYear) {
      setReloadData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearRange]);

  // lasVisible 값 변경(추가 조회 요청) 시 refetch 실행
  // 재 조회 요청 시 리스트와 관련 된 모든 상태 초기화 후 refetch 실행
  useEffect(() => {
    if (reloadData) {
      setAccordionChildren(<></>);
      setNoMoreData(false);
      setLastVisible(null);
      setScheduleList([]);
    }
    if (reloadData || lastVisible) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData, lastVisible]);

  return (
    <DefaultContainer>
      <style>{accordionCustomStyle}</style>
      <TranslationFromClient />
      <ScheduleTopBar />
      <ScheduleAddForm
        scheduleList={scheduleList}
        scheduleAddFormTextFromServer={
          scheduleDataFromServer.componentsText.scheduleAddForm
        }
      />
      <DivisionLine />
      <DefaultRow>
        <DefaultCol>
          {(!firstLoading && scheduleList.length > 0) ||
          (firstLoading && scheduleDataFromServer.dataList.length > 0) ? (
            <Accordion
              defaultActiveKey={scheduleAccordionActive}
              onSelect={(e) => {
                setScheduleAccordionActive(e);
              }}
            >
              {accordionChildren ||
                makeAccordionChildren(scheduleDataFromServer.dataList)}
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
        </DefaultCol>
      </DefaultRow>
      {nextLastVisible && (
        <Row>
          <CenterCol>
            {scheduleList.length > 0 &&
              !noMoreData &&
              (allowLoading && !isLoading ? (
                <CustomButton
                  color="#90a1ff"
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
