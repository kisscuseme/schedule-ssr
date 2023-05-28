import { AlertType, LoginStateType, UserType } from '@/types/global.types';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { atom } from 'recoil';

export const userInfoState = atom<UserType>({
  key: "userInfoState",
  default: null
});

export const isLogedInState = atom<LoginStateType>({
  key: "isLogedInState",
  default: null
});

export const selectedYearState = atom<string | null>({
  key: "selectedYearState",
  default: null
});

export const reloadDataState = atom<boolean>({
  key: "reloadDataState",
  default: false
});

export const rerenderDataState = atom<boolean>({
  key: "rerenderDataState",
  default: false
});

export const resetClearButtonState = atom<boolean>({
  key: "resetClearButtonState",
  default: false
});

export const showModalState = atom<AlertType>({
  key: "showModalState",
  default: {
    title: "",
    content: "",
    show: false
  }
});

export const scheduleAccordionActiveState = atom<AccordionEventKey | null>({
  key: "scheduleAccordionActiveState",
  default: ""
});

export const selectedLanguageState = atom<string | null>({
  key: "selectedLanguageState",
  default: null
});