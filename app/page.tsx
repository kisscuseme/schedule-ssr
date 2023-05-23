"use client";

import { checkLogin } from "@/services/firebase/auth";
import { firebaseAuth } from "@/services/firebase/firebase";
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
        window.location.replace(`/schedule/${data.uid}`);
      } else {
        setUserInfo(null);
        window.location.replace("/signin");
      }
    }).catch((error) => {
      console.log(error);
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      const { currentUser } = firebaseAuth;
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshToken);
  }, []);
}

export default Home;