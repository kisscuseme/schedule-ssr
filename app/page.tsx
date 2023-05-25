"use client";

import { checkLogin } from "@/services/firebase/auth";
import { userInfoState } from "@/states/states";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const Home = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
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
        document.cookie = "";
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