import { s } from "@/services/util/util";
import { t } from "i18next";
import { ReactNode } from "react";
import DefaultPage from "../molecules/DefaultPage";

export default function SignUp() {
  const components: ReactNode[] = [
    <input key="sign-up-email"/>,
    <input key="sign-up-name"/>,
    <input key="sign-up-password"/>,
    <input key="sign-up-reconfirm-password"/>,
    <button key="sign-up-submit">{s(t("Sign Up"))}</button>
  ];

  return (
    <DefaultPage
      topBar={"test"}
      title={s(t("Create an account"))}
      contents={components}
    />
  );
}
