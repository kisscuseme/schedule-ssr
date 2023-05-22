import { s } from "@/services/util/util";
import { t } from "i18next";
import DefaultPage from "../molecules/DefaultPage";

export default function SignIn() {
  return (
    <DefaultPage
      topBar={"test"}
      title={s(t("Schedule Management"))}
    >
      <p>test</p>
    </DefaultPage>
  );
}
