"use client"

import i18next from "i18next";
import translationKR from '../locales/kr/translation.json';
import translationEN from '../locales/en/translation.json';
import localesJSON from '../locales/locales.json';
import { useEffect } from "react";

export default function Translation() {
  const getLocaleJSON = (locale: string) => {
    if(locale === "kr") return translationKR
    else return translationEN
  }

  useEffect(() => {
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
      lng: window.localStorage.getItem("language")||"kr", //default language
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
  })
  }, []);

  return <></>
}