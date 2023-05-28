import { AlertType, UserType } from "@/types/types";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { atom } from "recoil";

// 로그인 정보
export const userInfoState = atom<UserType>({
  key: "userInfoState",
  default: null,
});

// 선택한 년도
export const selectedYearState = atom<string | null>({
  key: "selectedYearState",
  default: null,
});

// 재 조회 여부
export const reloadDataState = atom<boolean>({
  key: "reloadDataState",
  default: false,
});

// 재 렌더링 여부
export const rerenderDataState = atom<boolean>({
  key: "rerenderDataState",
  default: false,
});

// input clear 버튼 초기화 여부
export const resetClearButtonState = atom<boolean>({
  key: "resetClearButtonState",
  default: false,
});

// alert 보임 여부
export const showModalState = atom<AlertType>({
  key: "showModalState",
  default: {
    title: "",
    content: "",
    show: false,
  },
});

// 선택된 schedule list accordion 키 값
export const scheduleAccordionActiveState = atom<AccordionEventKey | null>({
  key: "scheduleAccordionActiveState",
  default: "",
});

// 선택한 언어
export const selectedLanguageState = atom<string | null>({
  key: "selectedLanguageState",
  default: null,
});
