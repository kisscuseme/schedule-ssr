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
import { DefaultButton, DefaultCol, DefaultInput, DefaultRow, GroupButton } from "../atoms/DefaultAtoms";
import { CenterCol, SignInGroupButtonRow } from "../atoms/CustomAtoms";
import { GroupButtonWrapper } from "../molecules/CustomMolecules";
import { CustomInput } from "../atoms/CustomInput";

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

  useEffect(() => {
    setEmail(window.localStorage.getItem("email")||"");
  }, []);

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
      if(typeof data !== 'string') {
        if(data.user.emailVerified) {
          reset();
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
      } catch (error) {
        console.log(error);
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

  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>, email: string, password: string) => {
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
      <DefaultRow>
        <DefaultCol>
          <CustomInput
            {...register("email")}
            placeholder={emailPlaceholder}
            type="email"
            initValue={email}
            onChange={emailChangeHandler}
            clearButton={true}
            clearBtnRef={emailClearButtonRef}
            onClearButtonClick={() => {
              setEmail("");
            }}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>{
              handleSubmit((data) => {
                enterKeyUpEventHandler(e, data.email, data.password);
              });
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
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>{
              handleSubmit((data) => {
                enterKeyUpEventHandler(e, data.email, data.password);
              });
            }}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton type="submit">{signInButtonText}</DefaultButton>
        </DefaultCol>
      </DefaultRow>
      <SignInGroupButtonRow>
        <CenterCol>
          <GroupButtonWrapper>
            <GroupButton type="button" onClick={resetPasswordClickHandler}>{resetPasswordButtonText}</GroupButton>
            <GroupButton
              type="button"
              onClick={signUpClickHandler}
            >
              {signUpButtonText}
            </GroupButton>
          </GroupButtonWrapper>
        </CenterCol>
      </SignInGroupButtonRow>
    </Form>
  );
}
