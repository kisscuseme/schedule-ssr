"use client";

import i18next from "i18next";
import translationKR from '@/locales/kr/translation.json';
import translationEN from '@/locales/en/translation.json';
import localesJSON from '@/locales/locales.json';
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { rerenderDataState, selectedLanguageState } from "@/states/states";

export default function TranslationFromClient() {
  const [rerenderData, setRerenderData] = useRecoilState(rerenderDataState);
  const selectedLanguage = useRecoilValue(selectedLanguageState);
  const [isChanged, setIsChanged] = useState<boolean>(false);

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
      lng: window.localStorage.getItem("lang")||"kr", //default language
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
    setRerenderData(!rerenderData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(selectedLanguage !== null) {
      i18next.changeLanguage(selectedLanguage).then((t) => {
        setIsChanged(!isChanged);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  useEffect(() => {
    if(selectedLanguage !== null) {
      localStorage.setItem("lang", selectedLanguage);
      setRerenderData(!rerenderData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChanged]);

  return <></>;
}