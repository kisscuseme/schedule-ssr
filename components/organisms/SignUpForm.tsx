"use client";

import { signUp } from "@/services/firebase/auth";
import { checkEmail, checkPassword, l } from "@/services/util/util";
import { showModalState } from "@/states/states";
import { useMutation } from "@tanstack/react-query";
import { sendEmailVerification, updateProfile, UserCredential } from "firebase/auth";
import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { DefaultButton, DefaultCol, DefaultInput, DefaultRow } from "../atoms/DefaultAtoms";

interface SignUpFormProps {
  emailPlaceholder: string;
  namePlaceholder: String;
  passwordPlaceholder: string;
  reconfirmPasswordPlaceholder: string;
  signUpButtonText: string;
}

export default function SignUpForm({
  emailPlaceholder,
  namePlaceholder,
  passwordPlaceholder,
  reconfirmPasswordPlaceholder,
  signUpButtonText
}: SignUpFormProps) {
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [reconfirmPassword, setReconfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const setShowModal = useSetRecoilState(showModalState);
  const router = useRouter();
  const emailClearButtonRef = useRef<HTMLButtonElement>(null);
  const nameClearButtonRef = useRef<HTMLButtonElement>(null);
  const passwordClearButtonRef = useRef<HTMLButtonElement>(null);
  const reconfirmPasswordClearButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if(password === "") {
      passwordClearButtonRef.current?.click();
    }
    if(email === "") {
      emailClearButtonRef.current?.click();
    }
    if(name === "") {
      nameClearButtonRef.current?.click();
    }
    if(reconfirmPassword === "") {
      reconfirmPasswordClearButtonRef.current?.click();
    }
  }, [password, email, name, reconfirmPassword]);

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  }

  const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }

  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  }

  const reconfirmPasswordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setReconfirmPassword(e.currentTarget.value);
  }

  const signUpWithEmail = (loginInfo: {email: string, password: string}) => {
    return signUp(loginInfo.email, loginInfo.password);
  }

  const signUpMutation = useMutation(signUpWithEmail, {
    onSuccess: async (data: UserCredential | string) => {
      try {
        if(typeof data === "string") {
          setErrorMsg(data);
        } else {
          await updateProfile(data.user, {displayName: name});
          await sendEmailVerification(data.user);
          localStorage.setItem("email", email);
          setShowModal({
            show: true,
            title: l("Check"),
            content: `${l("Your account creation is complete.")} ${l("Please check the verification e-mail sent.")}`,
            callback: () => {
              setName("");
              setEmail("");
              setPassword("");
              setReconfirmPassword("");
              router.replace("/");
            }
          });
        }
      } catch(error: any) {
        console.log(error);
      }
    }
  });

  const signUpHandleSubmit = () => {
    if(email === "") {
      setErrorMsg(l("Please enter your e-mail."));
    } else if(!checkEmail(email)) {
      setErrorMsg(l("Please check your e-mail format."));
    } else if(name === "") {
      setErrorMsg(l("Enter your name, please."));
    } else if(!checkPassword(password)) {
      setErrorMsg(l("Please enter a password of at least 6 digits."));
    } else if(password !== reconfirmPassword) {
      setErrorMsg(l("The entered password and reconfirm password are not the same."));
    } else {
      setErrorMsg("");
      setShowModal({
        show: true,
        title: l("Check"),
        content: l("Would you like to create an account?"),
        confirm: () => {
          signUpMutation.mutate({ email: email, password });
        }
      });
    }
  };

  const enterKeyUpEventHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      signUpHandleSubmit();
    }
  }

  return (
    <Form>
      <DefaultRow>
        <DefaultCol>
          <DefaultInput type="email" placeholder={emailPlaceholder} {...register("email")}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="text" placeholder={namePlaceholder} {...register("name")}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="password" placeholder={passwordPlaceholder} {...register("password")}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="password" placeholder={reconfirmPasswordPlaceholder} {...register("reconfirmPassword")}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton
            type="submit"
          >
            {signUpButtonText}
          </DefaultButton>
        </DefaultCol>
      </DefaultRow>
    </Form>
  );
}
