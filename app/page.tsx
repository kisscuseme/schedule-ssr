import { checkLogin } from "@/services/firebase/auth";

const Home = async () => {
  await (async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  })();
  const data = await checkLogin();
  return <div>{data ? data.displayName : "로그인이 필요합니다."}</div>;
}

export default Home;