"use client";

import { Form } from "react-bootstrap";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { checkEmail, l } from "@/services/util/util";
import { firebaseAuth } from "@/services/firebase/firebase";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UserType } from "@/services/firebase/firebase.type";
import { showModalState, userInfoState } from "@/states/states";
import { signIn } from "@/services/firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { DefaultCol, DefaultRow, GroupButton } from "../atoms/DefaultAtoms";
import { CenterCol, SignInGroupButtonRow } from "../atoms/CustomAtoms";
import { GroupButtonWrapper } from "../molecules/CustomMolecules";
import { CustomInput } from "../atoms/CustomInput";
import TranslationFromClient from "./TranslationFromClient";
import { CustomButton } from "../atoms/CustomButton";

export const SignInForm = ({
  emailPlaceholder,
  passwordPlaceholder,
  signInButtonText,
  resetPasswordButtonText,
  signUpButtonText,
}: {
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInButtonText: string;
  resetPasswordButtonText: string;
  signUpButtonText: string;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userInfo, setUserInfo] = useRecoilState<UserType>(userInfoState);
  const setShowModal = useSetRecoilState(showModalState);
  const emailClearButtonRef = useRef<HTMLButtonElement>(null);
  const passwordClearButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset } = useForm();
  const [savedEmail, setSavedEmail] = useState("");

  useEffect(() => {
    setSavedEmail(window.localStorage.getItem("email") || "");
  }, []);

  useEffect(() => {
    setEmail(savedEmail);
    reset({email: savedEmail});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedEmail]);

  useEffect(() => {
    if(password === "") {
      passwordClearButtonRef.current?.click();
    }
    if(email === "") {
      emailClearButtonRef.current?.click();
    }
  }, [password, email]);

  const signInWithEmail = (loginInfo: {email: string, password: string}) => {
    return signIn(loginInfo.email, loginInfo.password);
  }

  const signInMutation = useMutation(signInWithEmail, {
    onSuccess(data) {
      console.log("success");
      if(typeof data !== 'string') {
        reset();
        if(data.user.emailVerified) {
          if(userInfo === null) {
            setUserInfo({
              uid: data.user.uid,
              name: data.user.displayName||"",
              email: data.user.email||""
            });
          }
          window.localStorage.setItem("email", email);
          window.location.href = "/";
        } else {
          setShowModal({
            show: true,
            title: l("Check"),
            content: `${l("E-mail verification has not been completed.")} ${l("Would you like to resend the verification e-mail?")}`,
            confirm: async () => {
              setShowModal({
                show: false
              });
              try {
                await sendEmailVerification(data.user);
                setPassword("");
                setShowModal({
                  show: true,
                  title: l("Check"),
                  content: l("Resending of verification e-mail has been completed.")
                });
              } catch(error: any) {
                let message;
                if(error.code === "auth/too-many-requests" ) {
                  message = `${l("Lots of attempts.")} ${l("Please try again later.")}`;
                } else {
                  message = error.message;
                }

                setShowModal({
                  show: true,
                  title: l("Check"),
                  content: message
                });
              }
            }
          });
        }
      } else {
        setErrorMsg(data);
      }
    },
    onError(error: any) {
      setErrorMsg(l(error));
    }
  });

  const signInHandleSubmit = (email: string, password: string) => {
    if(email === "") {
      setErrorMsg("Please enter your e-mail.");
    } else if(!checkEmail(email)) {
      setErrorMsg("Please check your email format.");
    } else if(password === "") {
      setErrorMsg("Please enter your password.");
    } else {
      setErrorMsg("");
      signInMutation.mutate({ email: email, password: password });
    }
  };

  const resetPassword = async () => {
    try {
      return await sendPasswordResetEmail(firebaseAuth, email);
    } catch (error: any) {
      setErrorMsg(`${l("An error occurred while sending e-mail.")}\n` + error.message);
    }
  }

  const resetPasswordMutation = useMutation(resetPassword, {
    onError: (error: any) => {
      let message;
      if(error.code === "auth/too-many-requests" ) {
        message = `${l("Lots of attempts.")} ${l("Please try again later.")}`;

      } else {
        message = error.message;
      }
      setShowModal({
        show: true,
        title: l("Check"),
        content: message
      });
    },
    onSuccess: () => {
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("E-mail sending has been completed.")
      });
    },
  });

  const resetPasswordClickHandler = () => {
    if(email === "") {
      setErrorMsg("Please enter your e-mail.");
    } else if (!checkEmail(email)) {
      setErrorMsg("Please check your email format.");
    } else {
      try {
        setShowModal({
          show: true,
          title: l("Check"),
          content: l("Would you like to send a password reset e-mail to ?", {email: email}),
          confirm: () => {
            resetPasswordMutation.mutate();
          }
        });
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    }
  };

  const signUpClickHandler = () => {
    window.location.href = '/signup';
  }

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  }

  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  }

  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      signInHandleSubmit(email, password);
    }
  }

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
            >
              {resetPasswordButtonText}
            </GroupButton>
            <GroupButton
              type="button"
              onClick={signUpClickHandler}
              align="center"
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
}
