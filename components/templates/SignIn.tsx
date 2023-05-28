import { l } from "@/services/util/util";
import { cookies } from "next/dist/client/components/headers";
import { DefaultContainer, DefaultTitle } from "../atoms/DefaultAtoms";
import { TopBar } from "../molecules/TopBar";
import { LanguageSelectorForServer } from "../organisms/LanguageSelectorForServer";
import { SignInForm } from "../organisms/SignInForm";

export default function SignIn() {
  return (
    <DefaultContainer>
      <TopBar>
        <LanguageSelectorForServer
          langForServer={cookies().get("lang")?.value||"kr"}
        />
      </TopBar>
      <DefaultTitle>{l("Schedule Management")}</DefaultTitle>
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
