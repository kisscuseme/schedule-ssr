import { l } from "@/services/util/util";
import { DefaultContainer, DefaultTitle } from "../atoms/DefaultAtoms";
import { SignInForm } from "../organisms/SignInForm";

export default function SignIn() {
  return (
    <DefaultContainer>
      <DefaultTitle>
        {l("Schedule Management")}
      </DefaultTitle>
      <SignInForm
        emailPlaceholder={l("E-mail")}
        passwordPlaceholder={l("Password")}
        signInButtonText={l("Sign In")}
        resetPasswordButtonText={l("Reset Password")}
        signUpButtonText={l("Sign Up")}
      />
    </DefaultContainer>
  );
}
