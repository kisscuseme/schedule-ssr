"use client";

import { Form } from "react-bootstrap";
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
  
  return (
    <Form>
      <DefaultRow>
        <DefaultCol>
          <DefaultInput type="email" placeholder={emailPlaceholder}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="text" placeholder={namePlaceholder}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="password" placeholder={passwordPlaceholder}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
        <DefaultInput type="password" placeholder={reconfirmPasswordPlaceholder}/>
        </DefaultCol>
      </DefaultRow>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton type="submit">{signUpButtonText}</DefaultButton>
        </DefaultCol>
      </DefaultRow>
    </Form>
  );
}
