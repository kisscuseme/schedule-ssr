"use client";

import { Form, Row } from "react-bootstrap";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { checkEmail, getCookie, l, setCookie } from "@/services/util/util";
import { firebaseAuth } from "@/services/firebase/firebase";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { showModalState } from "@/states/states";
import { signIn } from "@/services/firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { DefaultCol, DefaultRow, GroupButton } from "../atoms/DefaultAtoms";
import { CenterCol } from "../atoms/CustomAtoms";
import { CustomInput } from "../atoms/CustomInput";
import TranslationFromClient from "./TranslationFromClient";
import { CustomButton } from "../atoms/CustomButton";
import { styled } from "styled-components";

// sign in form props
export interface SignInFormProps {
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInButtonText: string;
  resetPasswordButtonText: string;
  signUpButtonText: string;
}

// 그룹 버튼을 위한 Row
const SignInGroupButtonRow = styled(Row)`
  min-height: 120px;
`;

// 그룹 버튼 중앙 정렬
const GroupButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const SignInForm = ({
  emailPlaceholder,
  passwordPlaceholder,
  signInButtonText,
  resetPasswordButtonText,
  signUpButtonText,
}: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const setShowModal = useSetRecoilState(showModalState);
  const emailClearButtonRef = useRef<HTMLButtonElement>(null);
  const passwordClearButtonRef = useRef<HTMLButtonElement>(null);
  const [savedEmail, setSavedEmail] = useState("");
  const { register, handleSubmit, reset } = useForm(); // react hook form 기능 활용

  useEffect(() => {
    // 기존 로그인 이메일이 있을 경우 가져 옴
    setSavedEmail(getCookie("email") || "");
  }, []);

  useEffect(() => {
    // 최초 로딩 시 input 컴포넌트 값에 기존 로그인 이메일 바인딩
    setEmail(savedEmail);
    reset({ email: savedEmail });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedEmail]);

  // 데이터가 빈 값인 경우 clear 버튼이 사라지지 않는 문제 수정
  useEffect(() => {
    if (password === "") {
      passwordClearButtonRef.current?.click();
    }
    if (email === "") {
      emailClearButtonRef.current?.click();
    }
  }, [password, email]);

  // react query 사용 시 오브젝트 형태의 파라미터만 받을 수 있어서 변경
  const signInWithEmail = (loginInfo: { email: string; password: string }) => {
    return signIn(loginInfo.email, loginInfo.password);
  };

  // 로그인 시 react query 활용
  const signInMutation = useMutation(signInWithEmail, {
    onSuccess(data) {
      if (typeof data !== "string") {
        // form 필드 값 클리어
        reset();
        // 이메일 인증이 된 경우만 로그인 허용
        if (data.user.emailVerified) {
          // 로그인 성공한 이메일 쿠키에 저장
          setCookie("email", email);
          // 루트 페이지로 이동하여 로그인 여부 체크 후 진입
          window.location.href = "/";
        } else {
          setShowModal({
            show: true,
            title: l("Check"),
            content: `${l("E-mail verification has not been completed.")} ${l(
              "Would you like to resend the verification e-mail?"
            )}`,
            confirm: async () => {
              setShowModal({
                show: false,
              });
              try {
                await sendEmailVerification(data.user);
                setPassword("");
                setShowModal({
                  show: true,
                  title: l("Check"),
                  content: l(
                    "Resending of verification e-mail has been completed."
                  ),
                });
              } catch (error: any) {
                let message;
                if (error.code === "auth/too-many-requests") {
                  message = `${l("Lots of attempts.")} ${l(
                    "Please try again later."
                  )}`;
                } else {
                  message = error.message;
                }

                setShowModal({
                  show: true,
                  title: l("Check"),
                  content: message,
                });
              }
            },
          });
        }
      } else {
        setErrorMsg(data);
      }
    },
    onError(error: any) {
      setErrorMsg(l(error));
    },
  });

  const signInHandleSubmit = (email: string, password: string) => {
    if (email === "") {
      setErrorMsg("Please enter your e-mail.");
    } else if (!checkEmail(email)) {
      setErrorMsg("Please check your email format.");
    } else if (password === "") {
      setErrorMsg("Please enter your password.");
    } else {
      setErrorMsg("");
      signInMutation.mutate({ email, password });
    }
  };

  const resetPassword = async () => {
    try {
      return await sendPasswordResetEmail(firebaseAuth, email);
    } catch (error: any) {
      setErrorMsg(
        `${l("An error occurred while sending e-mail.")}\n` + error.message
      );
    }
  };

  const resetPasswordMutation = useMutation(resetPassword, {
    onError: (error: any) => {
      let message;
      if (error.code === "auth/too-many-requests") {
        message = `${l("Lots of attempts.")} ${l("Please try again later.")}`;
      } else {
        message = error.message;
      }
      setShowModal({
        show: true,
        title: l("Check"),
        content: message,
      });
    },
    onSuccess: () => {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("E-mail sending has been completed."),
      });
    },
  });

  const resetPasswordClickHandler = () => {
    if (email === "") {
      setErrorMsg("Please enter your e-mail.");
    } else if (!checkEmail(email)) {
      setErrorMsg("Please check your email format.");
    } else {
      try {
        setShowModal({
          show: true,
          title: l("Check"),
          content: l("Would you like to send a password reset e-mail to ?", {
            email: email,
          }),
          confirm: () => {
            resetPasswordMutation.mutate();
          },
        });
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    }
  };

  const signUpClickHandler = () => {
    window.location.href = "/signup";
  };

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  // 엔터 입력 시 버튼 클릭 효과
  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      signInHandleSubmit(email, password);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        signInHandleSubmit(data.email, data.password);
      })}
    >
      <TranslationFromClient />
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("email")}
            placeholder={emailPlaceholder}
            type="email"
            value={email}
            initValue={savedEmail}
            onChange={emailChangeHandler}
            clearButton={true}
            clearBtnRef={emailClearButtonRef}
            onClearButtonClick={() => {
              setEmail("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              enterKeyUpEventHandler(e);
            }}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("password")}
            placeholder={passwordPlaceholder}
            type="password"
            value={password}
            onChange={passwordChangeHandler}
            clearButton={true}
            clearBtnRef={passwordClearButtonRef}
            onClearButtonClick={() => {
              setPassword("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              enterKeyUpEventHandler(e);
            }}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomButton type="submit">{signInButtonText}</CustomButton>
        </DefaultCol>
      </DefaultRow>
      <SignInGroupButtonRow>
        <CenterCol>
          <GroupButtonWrapper>
            <GroupButton
              type="button"
              onClick={resetPasswordClickHandler}
              align="center"
              color="#5f5f5f"
            >
              {resetPasswordButtonText}
            </GroupButton>
            <GroupButton
              type="button"
              onClick={signUpClickHandler}
              align="center"
              color="#5f5f5f"
            >
              {signUpButtonText}
            </GroupButton>
          </GroupButtonWrapper>
        </CenterCol>
      </SignInGroupButtonRow>
      <DefaultRow>
        <CenterCol>
          <div style={{ color: "hotpink" }}>{l(errorMsg)}</div>
        </CenterCol>
      </DefaultRow>
    </Form>
  );
};
