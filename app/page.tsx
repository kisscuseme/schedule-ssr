"use client";

import { checkLogin } from "@/services/firebase/auth";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    checkLogin().then((data) => {
      if(data) window.location.replace("/schedule");
      else window.location.replace("/signin");
    });
  }, []);
}

export default Home;