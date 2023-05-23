import { credential, initializeApp } from 'firebase-admin';
import { getApps, getApp } from 'firebase-admin/app';

const firebaseAdminConfig = {
  "projectId": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  "privateKey": (process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  "clientEmail": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
}

const firebaseAdminApp = !getApps().length ? initializeApp({
  credential: credential.cert(firebaseAdminConfig),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}) : getApp();
getApps

export { firebaseAdminApp }