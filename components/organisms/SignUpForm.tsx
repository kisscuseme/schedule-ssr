"use client";

import { signUp } from "@/services/firebase/auth";
import { checkEmail, checkPassword, l, setCookie } from "@/services/util/util";
import { showModalState } from "@/states/states";
import { useMutation } from "@tanstack/react-query";
import {
  sendEmailVerification,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { DefaultCol, DefaultRow } from "../atoms/DefaultAtoms";
import { CustomInput } from "../atoms/CustomInput";
import { CenterCol } from "../atoms/CustomAtoms";
import TranslationFromClient from "./TranslationFromClient";
import { CustomButton } from "../atoms/CustomButton";

// sign up form props
export interface SignUpFormProps {
  emailPlaceholder: string;
  namePlaceholder: string;
  passwordPlaceholder: string;
  reconfirmPasswordPlaceholder: string;
  signUpButtonText: string;
}

export default function SignUpForm({
  emailPlaceholder,
  namePlaceholder,
  passwordPlaceholder,
  reconfirmPasswordPlaceholder,
  signUpButtonText,
}: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [reconfirmPassword, setReconfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const setShowModal = useSetRecoilState(showModalState);
  const emailClearButtonRef = useRef<HTMLButtonElement>(null);
  const nameClearButtonRef = useRef<HTMLButtonElement>(null);
  const passwordClearButtonRef = useRef<HTMLButtonElement>(null);
  const reconfirmPasswordClearButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset } = useForm(); // react hook form 기능 활용

  // 데이터가 빈 값인 경우 clear 버튼이 사라지지 않는 문제 수정
  useEffect(() => {
    if (password === "") {
      passwordClearButtonRef.current?.click();
    }
    if (email === "") {
      emailClearButtonRef.current?.click();
    }
    if (name === "") {
      nameClearButtonRef.current?.click();
    }
    if (reconfirmPassword === "") {
      reconfirmPasswordClearButtonRef.current?.click();
    }
  }, [password, email, name, reconfirmPassword]);

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const reconfirmPasswordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setReconfirmPassword(e.currentTarget.value);
  };

  // react query 사용 시 오브젝트 형태의 파라미터만 받을 수 있어서 변경
  const signUpWithEmail = (loginInfo: { email: string; password: string }) => {
    return signUp(loginInfo.email, loginInfo.password);
  };

  // 계정 생성 시 react query 활용
  const signUpMutation = useMutation(signUpWithEmail, {
    onSuccess: async (data: UserCredential | string) => {
      try {
        if (typeof data === "string") {
          // 가져온 데이터가 string type일 경우 에러 메시지임
          setErrorMsg(data);
        } else {
          // 입력한 name 값으로 displayName 값 수정
          await updateProfile(data.user, { displayName: name });
          // 인증 메일 전송
          await sendEmailVerification(data.user);
          // 이메일 정보 쿠키에 저장
          setCookie("email", email);
          setShowModal({
            show: true,
            title: l("Check"),
            content: `${l("Your account creation is complete.")} ${l(
              "Please check the verification e-mail sent."
            )}`,
            callback: () => {
              reset();
              window.location.href = "/";
            },
          });
        }
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    },
    onError(error: any) {
      setErrorMsg(error);
    },
  });

  const signUpHandleSubmit = (
    email: string,
    name: string,
    password: string,
    reconfirmPassword: string
  ) => {
    if (email === "") {
      setErrorMsg(l("Please enter your e-mail."));
    } else if (!checkEmail(email)) {
      setErrorMsg(l("Please check your e-mail format."));
    } else if (name === "") {
      setErrorMsg(l("Enter your name, please."));
    } else if (!checkPassword(password)) {
      setErrorMsg(l("Please enter a password of at least 6 digits."));
    } else if (password !== reconfirmPassword) {
      setErrorMsg(
        l("The entered password and reconfirm password are not the same.")
      );
    } else {
      setErrorMsg("");
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Would you like to create an account?"),
        confirm: () => {
          signUpMutation.mutate({ email: email, password });
        },
      });
    }
  };

  // 엔터 입력 시 버튼 클릭 효과
  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      signUpHandleSubmit(email, name, password, reconfirmPassword);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        signUpHandleSubmit(
          data.email,
          data.name,
          data.password,
          data.reconfirmPassword
        );
      })}
    >
      <TranslationFromClient />
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("email")}
            type="email"
            value={email}
            onChange={emailChangeHandler}
            clearButton={true}
            clearBtnRef={emailClearButtonRef}
            onClearButtonClick={() => {
              setEmail("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              enterKeyUpEventHandler(e);
            }}
            placeholder={emailPlaceholder}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("name")}
            type="text"
            value={name}
            onChange={nameChangeHandler}
            clearButton={true}
            clearBtnRef={nameClearButtonRef}
            onClearButtonClick={() => {
              setName("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              enterKeyUpEventHandler(e);
            }}
            placeholder={namePlaceholder}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("password")}
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
            placeholder={passwordPlaceholder}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("reconfirmPassword")}
            type="password"
            value={reconfirmPassword}
            onChange={reconfirmPasswordChangeHandler}
            clearButton={true}
            clearBtnRef={reconfirmPasswordClearButtonRef}
            onClearButtonClick={() => {
              setReconfirmPassword("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              enterKeyUpEventHandler(e);
            }}
            placeholder={reconfirmPasswordPlaceholder}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <CustomButton type="submit">{signUpButtonText}</CustomButton>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <CenterCol>
          <div style={{ color: "hotpink" }}>{l(errorMsg)}</div>
        </CenterCol>
      </DefaultRow>
    </Form>
  );
}
