"use client";

import { Form } from "react-bootstrap";
import { DefaultButton, DefaultCol, DefaultInput, DefaultRow, GroupButton } from "../atoms/DefaultAtoms";
import { useForm } from "react-hook-form";
import { signIn } from "@/services/firebase/auth";
import { useRouter } from "next/navigation";
import { CenterCol, SignInGroupButtonRow } from "../atoms/CustomAtoms";
import { GroupButtonWrapper } from "../molecules/CustomMolecules";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/states/states";

interface SignInFormProps {
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInButtonText: string;
  resetPasswordButtonText: string;
  signUpButtonText: string;
}

export default function SignInForm({
  emailPlaceholder,
  passwordPlaceholder,
  signInButtonText,
  resetPasswordButtonText,
  signUpButtonText
}: SignInFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  return (
    <Form
      onSubmit={handleSubmit(async (data) => {
        try {
          const result = await signIn(data.email, data.password);
          setUserInfo({
            uid: result.user.uid,
            name: result.user.displayName||"",
            email: result.user.email||""
          });
          reset();
          router.push("/");
        } catch (error: any) {
          console.log(error);
        }
      })}
    >
      <DefaultRow>
        <DefaultCol>
          <DefaultInput
            {...register("email")}
            type="email"
            placeholder={emailPlaceholder}
          />
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <DefaultInput
            {...register("password")}
            type="password"
            placeholder={passwordPlaceholder}
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
            <GroupButton type="button">{resetPasswordButtonText}</GroupButton>
            <GroupButton
              type="button"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              {signUpButtonText}
            </GroupButton>
          </GroupButtonWrapper>
        </CenterCol>
      </SignInGroupButtonRow>
    </Form>
  );
}
