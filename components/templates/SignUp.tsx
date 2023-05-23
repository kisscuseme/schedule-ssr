import { s } from "@/services/util/util";
import { t } from "i18next";
import { ReactNode } from "react";
import SignUpForm from "../organisms/SignUpForm";
import { DefaultContainer } from "../atoms/DefaultAtoms";
import Title from "../molecules/Title";

export default function SignUp() {
  return (
    <DefaultContainer>
      <Title>
        {s(t("Create an account"))}
      </Title>
      <SignUpForm
        emailPlaceholder={s(t("E-mail"))}
        namePlaceholder={s(t("Name"))}
        passwordPlaceholder={s(t("Password"))}
        reconfirmPasswordPlaceholder={s(t("Reconfirm Password"))}
        signUpButtonText={s(t("Create"))}
      />
    </DefaultContainer>
  );
}
