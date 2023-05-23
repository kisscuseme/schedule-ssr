import { s } from "@/services/util/util";
import { t } from "i18next";
import SignInForm from "../organisms/SignInForm";
import Title from "../molecules/Title";
import { DefaultContainer } from "../atoms/DefaultAtoms";

export default function SignIn() {
  return (
    <DefaultContainer>
      <Title>
        {s(t("Schedule Management"))}
      </Title>
      <SignInForm
        emailPlaceholder={s(t("E-mail"))}
        passwordPlaceholder={s(t("Password"))}
        signInButtonText={s(t("Sign In"))}
        resetPasswordButtonText={s(t("Reset Password"))}
        signUpButtonText={s(t("Sign Up"))}
      />
    </DefaultContainer>
  );
}
