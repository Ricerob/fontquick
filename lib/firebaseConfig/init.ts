// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFunctions } from 'firebase/functions';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export default function initFirebase() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId,
    databaseURL: process.env.NEXT_PUBLIC_DBURL
  };

  // Initialize Firebase
  const apps = getApps();
  if (!apps.length) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const functions = getFunctions(app);
    const storage = getStorage(app);
    const database = getDatabase(app);
  }

}