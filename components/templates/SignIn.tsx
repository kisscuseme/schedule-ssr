import { s } from "@/services/util/util";
import { t } from "i18next";
import { ReactNode } from "react";
import DefaultPage from "../molecules/DefaultPage";

export default function SignIn() {
  const components: ReactNode[] = [
    <input key="sign-in-email"/>,
    <input key="sign-in-password"/>,
    <button key="sign-in-submit">{s(t("Sign In"))}</button>
  ];

  return (
    <DefaultPage
      topBar={"test"}
      title={s(t("Schedule Management"))}
      contents={components}
    />
  );
}
