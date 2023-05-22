import SignUp from "@/components/templates/SignUp";

const SignUpPage = async () => {
  await (async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  })();
  return <SignUp/>
}

export default SignUpPage;