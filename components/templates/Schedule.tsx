import { s } from "@/services/util/util";
import { t } from "i18next";
import { ReactNode } from "react";
import DefaultPage from "../molecules/DefaultPage";

export default function Schedule() {
  const components: ReactNode[] = [
    <div key="1">2020.01.01({s(t("월"))}) 테스트1</div>,
    <div key="2">2021.02.01({s(t("화"))}) 테스트2</div>,
    <div key="3">2022.03.01({s(t("수"))}) 테스트3</div>
  ];

  return (
    <DefaultPage
      topBar={"test"}
      contents={components}
    />
  );
}
