"use client";

import { LoginStateType, ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultContainer, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { getLastVisible, queryScheduleData } from "@/services/firebase/db";
import { getDay, getReformDate, getToday, getYearList, getYearRange, l, sortSchedulList } from "@/services/util/util";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Row, Spinner } from "react-bootstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLogedInState, reloadDataState, rerenderDataState, selectedYearState, showModalState, userInfoState } from "@/states/states";
import { CenterCol } from "../atoms/CustomAtoms";
import { ScheduleAddForm } from "../organisms/ScheduleAddForm";
import { styled } from "styled-components";
import { ScheduleEditForm } from "../organisms/ScheduleEditForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser } from "firebase/auth";
import { CustomDropdown, DropdownDataProps } from "../atoms/CustomDropdown";
import TranslationFromClient from "../organisms/TranslationFromClient";

interface ScheduleProps {
  scheduleDataFromServer: ScheduleType[];
  lastVisibleFromServer: string | null;
}

const ListWrapper = styled.div`
  margin-bottom: 10px;
`;

export default function Schedule({
  scheduleDataFromServer,
  lastVisibleFromServer
}: ScheduleProps) {
  const [scheduleList, setScheduleList] = useState<ScheduleType[]>([]);
  const [lastVisible,  setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null>(null);
  const [nextLastVisible,  setNextLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null>(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const setIsLogedIn = useSetRecoilState<LoginStateType>(isLogedInState);
  const [selectedYear, setSelectedYear] = useRecoilState<string | null>(selectedYearState);
  const setShowModal = useSetRecoilState(showModalState);
  const [noMoreData, setNoMoreData] = useState<boolean>(true);
  const [reloadData, setReloadData] = useRecoilState(reloadDataState);
  const [allowLoading, setAllowLoading] = useState<boolean>(true);
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [yearRange, setYearRange] = useState({
    fromYear: "",
    toYear: "",
  });
  const [yearList, setYearList] = useState<DropdownDataProps[]>([]);
  const [accordionChildren, setAccordionChildren] = useState<ReactNode>(<></>);
  const [yearSelectDropdown, setYearSelectDropdown] = useState<ReactNode>(<></>);

  useEffect(() => {
    console.log(scheduleDataFromServer);
    setScheduleList(scheduleDataFromServer);
    setYearList(getYearList());
    setYearRange(getYearRange(selectedYear||getToday().substring(0,4)));
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
            setNoMoreData(false);
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

  useEffect(() => {
    setYearSelectDropdown(
      <CustomDropdown
        initText={getToday().substring(0,4)}
        items={yearList}
        onClickItemHandler={selectYear}
        id="schedule-year-dropdown"
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[yearList]);

  const makeAccordionChildren = (scheduleList: ScheduleType[]) => {
    return scheduleList.map((value) => (
      <Accordion.Item key={value?.id} eventKey={value?.id || ""}>
        <Accordion.Header>
          <Col xs={5}>
            <Row>
              <div>{getReformDate(value?.date || "", ".")}({l(getDay(value?.date || ""))})</div>
            </Row>
            {
              value?.toDate && value?.date !== value?.toDate && <>
                <Row>
                  <div>{"~ " + value?.toDate} {`(${l(getDay(value?.toDate||""))})`}</div>
                </Row>
              </>
            }
          </Col>
          <Col>
            <div style={{wordBreak: "break-all"}}>{value?.content}</div>
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
        ], userInfo?.uid||"", nextLastVisible);
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
    setRerenderData(!rerenderData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleList]);

  useEffect(() => {
    scheduleList.sort(sortSchedulList);
    setAccordionChildren(makeAccordionChildren(scheduleList));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[rerenderData]);

  const signOutMutation = useMutation(logOut, {
    onSuccess(data) {
      if(data) {
        window.localStorage.setItem("email", userInfo?.email||"");
        setUserInfo(null);
        setIsLogedIn(null);
        window.location.href = "/";
      }
    },
  });

  const signOutHandler = () => {
    setShowModal({
      title: l("Check"),
      content: l("Are you sure you want to log out?"),
      show: true,
      confirm: () => {
        signOutMutation.mutate();
      }
    });
  }

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess() {
      window.location.href = "/";
    }
  });

  const deleteUserHandler = () => {
    setShowModal({
      title: l("Check"),
      content: l("Are you sure you want to delete your account?"),
      show: true,
      confirm: () => {
        checkLogin().then((user) => {
          if(user) deleteUserMutation.mutate(user);
        });
      }
    });
  }

  const selectYear = (year: string) => {
    setSelectedYear(year);
  }

  useEffect(() => {
    if(selectedYear) {
      setReloadData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    if(reloadData) {
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
      <TranslationFromClient locale="kr" />
      <DefaultRow>
        <DefaultCol>
          <DefaultButton onClick={deleteUserHandler}>
            {l("Delete User")}
          </DefaultButton>
        </DefaultCol>
        <DefaultCol>
          <DefaultButton onClick={signOutHandler}>
            {l("Sign Out")}
          </DefaultButton>
        </DefaultCol>
        <DefaultCol>
          {yearSelectDropdown}
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <ScheduleAddForm scheduleList={scheduleList} />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <ListWrapper>
            <Accordion defaultActiveKey="">
              {accordionChildren}
            </Accordion>
          </ListWrapper>
        </DefaultCol>
      </DefaultRow>
      {nextLastVisible && (
        <DefaultRow>
          <CenterCol>
            {scheduleList.length > 0 &&
              !noMoreData &&
              (allowLoading && !isLoading ? (
                <Button
                  ref={buttonRef}
                  onClick={() => {
                    setLastVisible(nextLastVisible);
                  }}
                >
                  {l("Load More")}
                </Button>
              ) : (
                <Button>
                  <Spinner animation="border" />
                </Button>
              ))}
          </CenterCol>
        </DefaultRow>
      )}
    </DefaultContainer>
  );
}