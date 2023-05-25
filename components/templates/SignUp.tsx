import { l } from "@/services/util/util";
import SignUpForm from "../organisms/SignUpForm";
import { DefaultContainer, DefaultTitle } from "../atoms/DefaultAtoms";

export default function SignUp() {
  return (
    <DefaultContainer>
      <DefaultTitle>
        {l("Create an account")}
      </DefaultTitle>
      <SignUpForm
        emailPlaceholder={l("E-mail")}
        namePlaceholder={l("Name")}
        passwordPlaceholder={l("Password")}
        reconfirmPasswordPlaceholder={l("Reconfirm Password")}
        signUpButtonText={l("Create")}
      />
    </DefaultContainer>
  );
}
