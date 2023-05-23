import { s } from "@/services/util/util";
import { t } from "i18next";
import SignUpForm from "../organisms/SignUpForm";
import { DefaultContainer, DefaultTitle } from "../atoms/DefaultAtoms";

export default function SignUp() {
  return (
    <DefaultContainer>
      <DefaultTitle>
        {s(t("Create an account"))}
      </DefaultTitle>
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
