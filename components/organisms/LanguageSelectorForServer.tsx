"use client";

import { setCookie } from "@/services/util/util";
import localesJSON from "../../locales/locales.json";
import langTitleJSON from "../../locales/title.json";
import { CustomDropdown, DropdownDataProps } from "../atoms/CustomDropdown";

export const LanguageSelectorForServer = ({
  langForServer
}: {
  langForServer: string
}) => {
  const data: DropdownDataProps[] = [];
  const locales = JSON.parse(JSON.stringify(localesJSON));
  const langTitle = JSON.parse(JSON.stringify(langTitleJSON));

  for(const key in locales) {
    data.push({
      key: key,
      href: "#",
      label: locales[key]
    })
  }

  const getLanguageName = (langCode: string) => {
    const result = data.filter((value) => {
      return value.key === langCode
    });
    if(result.length > 0) return result[0].label
    else return ""
  }

  const selectLanguage = async (langCode: string) => {
    window.localStorage.setItem("lang", langCode);
    setCookie("lang", langCode);
    window.location.reload();
  }

  return (
    <CustomDropdown
      id="lang-selector-for-server"
      title={langTitle[langForServer]}
      initText={getLanguageName(langForServer)}
      items={data}
      onClickItemHandler={selectLanguage}
    />
  );
}