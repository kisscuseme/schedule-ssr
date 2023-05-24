"use client";

import i18next from "i18next";
import translationKR from '@/locales/kr/translation.json';
import translationEN from '@/locales/en/translation.json';
import localesJSON from '@/locales/locales.json';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { rerenderDataState } from "@/states/states";

export default function TranslationFromClient({
  locale
}: {
  locale: string;
}) {
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  useEffect(() => {
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
      lng: locale, //default language
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
    setRerenderData(!rerenderData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}