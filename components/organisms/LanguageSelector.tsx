import { l } from "@/services/util/util";
import { selectedLanguageState, showModalState } from "@/states/states";
import i18next from "i18next";
import { useSetRecoilState } from "recoil";
import localesJSON from "../../locales/locales.json";
import { CustomDropdown, DropdownDataProps } from "../atoms/CustomDropdown";

export const LanguageSelector = () => {
  const setSelectedLanguage = useSetRecoilState(selectedLanguageState);
  const setShowModal = useSetRecoilState(showModalState);
  const data: DropdownDataProps[] = [];
  
  const locales = JSON.parse(JSON.stringify(localesJSON));
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
    try {
      setSelectedLanguage(langCode);
    } catch(error: any) {
      setShowModal({
        show: true,
        title: l("Error"),
        content: error.message
      })
    }
  }

  return (
    i18next.language ? <CustomDropdown
      title={`${l('Language')}:`}
      initText={getLanguageName(i18next.language)}
      items={data}
      onClickItemHandler={selectLanguage}
    /> : <></>
  )
}