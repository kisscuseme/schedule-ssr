"use client";

import { DefaultCol, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { getToday, getYearList, l, setCookie } from "@/services/util/util";
import { Col, Nav, Navbar, Offcanvas, Row } from "react-bootstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  selectedYearState,
  showModalState,
  userInfoState,
} from "@/states/states";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "firebase/auth";
import { CustomDropdown } from "../atoms/CustomDropdown";
import { TopBar } from "../molecules/TopBar";
import { DivisionLine } from "../molecules/DefaultMolecules";
import { LanguageSelectorForClient } from "./LanguageSelectorForClient";
import { styled } from "styled-components";
import { markDeletedAccount } from "@/services/firebase/db";

const NavbarOffcanvas = styled(Navbar.Offcanvas)`
  font-family: "GangwonEdu_OTFBoldA";
`;

const NavbarToggle = styled(Navbar.Toggle)`
  border: 0;
  padding: 0;
  &:focus {
    box-shadow: unset;
  }
`;

const NavLink = styled(Nav.Link)`
  &:hover {
    color: #9e9e9e;
  }
`;

const NavLinkPink = styled(Nav.Link)`
  color: hotpink;
  &:hover {
    color: pink;
  }
`;

export default function ScheduleTopBar() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const setShowModal = useSetRecoilState(showModalState);
  const setSelectedYear = useSetRecoilState(selectedYearState);

  // Dropdown에서 선택한 날짜를 recoil 전역 상태에 바인딩
  const selectYear = (year: string) => {
    setSelectedYear(year);
  };

  // 로그아웃 시 react query 활용
  const signOutMutation = useMutation(logOut, {
    onSuccess(data) {
      if (data) {
        setCookie("email", userInfo?.email || "");
        setUserInfo(null);
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
      },
    });
  };

  // 계정 삭제 시 react query 활용
  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess() {
      window.location.href = "/";
    },
  });

  // 삭제된 계정 표시 react query 활용
  const markDeletedAccountMutation = useMutation(markDeletedAccount, {
    onSuccess() {
      checkLogin().then((user) => {
        if (user) deleteUserMutation.mutate(user);
      });
    },
  });

  const deleteUserHandler = () => {
    setShowModal({
      title: l("Check"),
      content: `${l("All data cannot be recovered.")} ${l("Are you sure you want to delete your account?")}`,
      show: true,
      confirm: () => {
        markDeletedAccountMutation.mutate({uid: userInfo?.uid||""});
      },
    });
  };

  return (
    <TopBar>
      <DefaultRow>
        <DefaultCol>
          <Navbar expand={false}>
            <NavbarToggle aria-controls={`nav-1`} />
            <NavbarOffcanvas
              id={`nav-1`}
              aria-labelledby={`nav-2`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`nav-2`}>{l("SCHEDULE")}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Row>
                  <Col>
                    <LanguageSelectorForClient />
                  </Col>
                </Row>
                <DivisionLine />
                <Row>
                  <Col>
                    {l("E-mail")}: {userInfo?.email}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {l("Name")}: {userInfo?.name}
                  </Col>
                </Row>
                <DivisionLine />
                <Row>
                  <Col></Col>
                  <Col>
                    <NavLink onClick={() => signOutHandler()}>
                      {l("Sign Out")}
                    </NavLink>
                  </Col>
                  <Col>
                    <NavLinkPink onClick={() => deleteUserHandler()}>
                      {l("Delete User")}
                    </NavLinkPink>
                  </Col>
                </Row>
              </Offcanvas.Body>
            </NavbarOffcanvas>
          </Navbar>
        </DefaultCol>
        <DefaultCol>
          <div style={{ float: "right" }}>
            <CustomDropdown
              initText={getToday().substring(0, 4)}
              items={getYearList()}
              onClickItemHandler={selectYear}
            />
          </div>
        </DefaultCol>
      </DefaultRow>
    </TopBar>
  );
}
