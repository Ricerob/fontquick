import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import FirebaseProvider from "../lib/authContext";
import initFirebase from "../lib/firebaseConfig/init";
import admin from "../lib/firebaseConfig/init-admin"

initFirebase();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseProvider>
  );
}
export default MyApp;
