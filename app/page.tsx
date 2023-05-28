"use client";

import { checkLogin } from "@/services/firebase/auth";
import { setCookie } from "@/services/util/util";
import { userInfoState } from "@/states/states";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const Home = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    const langCode = window.localStorage.getItem("lang")||"kr";
    setCookie("lang", langCode);
       
    checkLogin().then(async (data) => {
      if(data) {
        setUserInfo({
          uid: data?.uid||"",
          name: data?.displayName||"",
          email: data?.email||""
        });
        document.cookie = `token=${await data.getIdToken()}`;
        window.location.replace("/schedule");
      } else {
        setUserInfo(null);
        setCookie("token", "", -1);
        window.location.replace("/signin");
      }
    }).catch((error) => {
      console.log(error);
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

export default Home;