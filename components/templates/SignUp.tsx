import { l } from "@/services/util/util";
import SignUpForm from "../organisms/SignUpForm";
import { DefaultContainer, DefaultTitle } from "../atoms/DefaultAtoms";
import { TopBar } from "../molecules/TopBar";
import { LanguageSelectorForServer } from "../organisms/LanguageSelectorForServer";
import { cookies } from "next/dist/client/components/headers";

export default function SignUp() {
  return (
    <DefaultContainer>
      <TopBar>
        <LanguageSelectorForServer
          langForServer={cookies().get("lang")?.value||"kr"}
        />
      </TopBar>
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
