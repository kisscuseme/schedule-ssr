import { t } from "i18next";
import { ScheduleType } from "../firebase/firebase.type";

const getDay = (date: string) => {
  var yyyyMMdd = getReformDate(date, "").substring(0, 8);
  var sYear = yyyyMMdd.substring(0, 4);
  var sMonth = yyyyMMdd.substring(4, 6);
  var sDate = yyyyMMdd.substring(6, 8);
  var targetDate = new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));
  var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return week[targetDate.getDay()];
};


const getReformDate = (date: string, dvsn: string) => {
  if(date) {
    let reformDate = date.replace("년", dvsn).replace("월",dvsn).replace("일"," ");
    reformDate = reformDate.replaceAll(".", dvsn);
    reformDate = reformDate.replaceAll("-", dvsn);
    if(dvsn === '-') reformDate = reformDate.substring(0, 10);
    if(dvsn === '.') reformDate = reformDate.substring(0, 10);
    return reformDate;
  } else {
    return ""
  }
}

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate().toString();
  const today = year + "-" + ("0" + month).slice(-2, 3) + "-" + ("0" + date).slice(-2, 3);
  return today;
};

const getYearList = () => {
  const yearList: {
    key: string,
    href: string,
    label: string
  }[] = [];
  const now = new Date();
  const year: number = now.getFullYear();
  const limitRange = 3;
  for(let i=-1*limitRange ; i < limitRange+1; i++ ) {
    yearList.push({
      key: String(year + i),
      href: "#",
      label: String(year + i) + (i === -1*limitRange ? "↓" : (i === limitRange ? "↑" : ""))
    });
  }
  yearList.reverse();
  return yearList;
}

const checkEmail = (email: string) => {
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  return emailRegEx.test(email);
};

const checkPassword = (password: string) => {
  const passwordRegEx = /^[A-Za-z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{6,20}$/;
  return passwordRegEx.test(password);
};

const l = (translationKey: string, options?: object) => {
  return t(translationKey || "", options?options:{})||translationKey;
}

const sortSchedulList = (before: ScheduleType, after: ScheduleType) => {
  if(before === null || after === null) return 0
  else {
    const numA = Number(before.date.replaceAll(".","").substring(0,8));
    const numB = Number(after.date.replaceAll(".","").substring(0,8));
    return numB - numA;
  }
}

const getYearRange = (selectedYear: string) => {
  const yearList = getYearList();
  let fromYear = selectedYear;
  let toYear = selectedYear + "\uf8ff";
  
  if(selectedYear === yearList[yearList.length-1].key) {
    fromYear = "0000";
  }
  else if(selectedYear === yearList[0].key) {
    toYear = "9999" + "\uf8ff";
  }
  return {
    fromYear: fromYear,
    toYear: toYear
  };
}

//쿠키 저장하는 함수
const setCookie = (name: string, value: string, unixTime: number = (new Date(9999, 12, 31).getTime())) => {
  var date = new Date();
  date.setTime(date.getTime() + unixTime);
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

//쿠키 값 가져오는 함수
const getCookie = (name: string) => {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}

//쿠키 삭제하는 함수
const deleteCookie = (name: string) => {
  document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 JAN 1999 00:00:10 GMT';
}

export {
  checkEmail,
  checkPassword,
  getDay,
  getReformDate,
  getToday,
  getYearList,
  l,
  sortSchedulList,
  getYearRange,
  getCookie,
  setCookie,
  deleteCookie,
};