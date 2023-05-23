import SignIn from "@/components/templates/SignIn";

const SignInPage = async () => {
  await (async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  })();
  return <SignIn/>
}

export default SignInPage;