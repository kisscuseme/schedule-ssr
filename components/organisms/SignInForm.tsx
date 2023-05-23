"use client";

import { Button, Form } from "react-bootstrap";
import { DefaultButton, DefaultCol, DefaultInput, DefaultRow } from "../atoms/DefaultAtoms";
import { useForm } from "react-hook-form";
import { signIn } from "@/services/firebase/auth";
import { useRouter } from "next/navigation";
import { CenterCol, SignInGroupButtonRow } from "../atoms/CustomAtoms";

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

  return (
    <Form
      onSubmit={handleSubmit(async (data) => {
        try {
          await signIn(data.email, data.password);
          reset();
          router.push("/");
        } catch(error: any) {
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
          <Button type="button">{resetPasswordButtonText}</Button>
          <Button type="button">{signUpButtonText}</Button>
        </CenterCol>
      </SignInGroupButtonRow>
    </Form>
  );
}
