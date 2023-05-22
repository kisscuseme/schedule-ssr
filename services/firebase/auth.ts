import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { t } from "i18next";
import { s } from "../util/util";
import { firebaseAuth } from "./firebase";

const signIn = async (email: string, password: string) => {
  try {
    const curUserInfo = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return curUserInfo;
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Your email address or password is incorrect.";
      default:
        return "An error occurred while logging in." + "\n" + error.message;
    }
  }
};

const signUp = async (email: string, password: string) => {
  try {
    const createdUser = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return createdUser;
  } catch (error: any) {
    switch (error.code) {
      case "auth/weak-password":
        return "Password must be 6 digits or longer.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/email-already-in-use":
        return "This account has already been created.";
      default:
        return "An error occurred while creating an account." + "\n" + error.message;
    }
  }
};

const logOut = async () => {
  try {
    await signOut(firebaseAuth);
    return true;
  } catch(error: any) {
    console.log(s(t("An error occurred while logging out.")) + "\n" + error.message);
    return false;
  }
}

const checkLogin = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
          resolve(user);
      } else {
        resolve(null);
      }
    })();
  });
}

export { signIn, signUp, logOut, checkLogin }