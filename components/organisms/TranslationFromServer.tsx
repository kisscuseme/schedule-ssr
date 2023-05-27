import i18next from "i18next";
import translationKR from '@/locales/kr/translation.json';
import translationEN from '@/locales/en/translation.json';
import localesJSON from '@/locales/locales.json';
import { cookies } from "next/dist/client/components/headers";

export default function TranslationFromServer() {
  const getLocaleJSON = (locale: string) => {
    if(locale === "kr") return translationKR
    else return translationEN
  }

  const locales = localesJSON;
  let resources: any = {}
  for(const key in locales) {
    resources[key] = {
      translation: getLocaleJSON(key)
    }
  }
  
  i18next
  .init({
    resources,
    lng: cookies().get("lang")?.value||"kr", //default language
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

  return <></>;
}