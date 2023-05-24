import { cookies } from "next/dist/client/components/headers";
import { admin } from "./firebase.admin";

const checkLoginFromServer = async (): Promise<string | null> => {
  return new Promise(async (resolve) => {
    const token = await admin.auth().verifyIdToken(cookies().get("token")?.value||"");
    if (token.uid) {
        resolve(token.uid);
    } else {
      resolve(null);
    }
  });
}

export { checkLoginFromServer }