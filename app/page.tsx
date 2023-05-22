import Schedule from "@/components/templates/Schedule";
import SignIn from "@/components/templates/SignIn";
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
  if(data) return <Schedule/>
  else return <SignIn/>
}

export default Home;