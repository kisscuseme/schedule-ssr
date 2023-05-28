"use client";

import { LoginStateType } from "@/services/firebase/firebase.type";
import { DefaultCol, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { getToday, getYearList, l } from "@/services/util/util";
import { ReactNode, useEffect, useState } from "react";
import { Col, Nav, Navbar, Offcanvas, Row } from "react-bootstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLogedInState, selectedYearState, showModalState, userInfoState } from "@/states/states";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "firebase/auth";
import { CustomDropdown, DropdownDataProps } from "../atoms/CustomDropdown";
import { TopBar } from "../molecules/TopBar";
import { DivisionLine } from "../molecules/DefaultMolecules";
import { LanguageSelectorForClient } from "./LanguageSelectorForClient";
import { styled } from "styled-components";

const NavbarOffcanvas = styled(Navbar.Offcanvas)`
  font-family: 'GangwonEdu_OTFBoldA';
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
  const setIsLogedIn = useSetRecoilState<LoginStateType>(isLogedInState);
  const setShowModal = useSetRecoilState(showModalState);
  const [yearList, setYearList] = useState<DropdownDataProps[]>([]);
  const [yearSelectDropdown, setYearSelectDropdown] = useState<ReactNode>(<></>);
  const setSelectedYear = useSetRecoilState(selectedYearState);

  useEffect(() => {
    setYearList(getYearList());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectYear = (year: string) => {
      setSelectedYear(year);
    }

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
          <div style={{ float: "right" }}>{yearSelectDropdown}</div>
        </DefaultCol>
      </DefaultRow>
    </TopBar>
  );
}