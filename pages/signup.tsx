import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  if (loading) return null;

  if (user) {
    router.push('/app')
    return <h1>You're already logged in.</h1>
  };

  const auth = getAuth();

  function createUserCredentials() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("success", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        // ..
      });
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("sign with google", user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <>
      <>
        <Head>
          <title>Signup</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-2/3 mx-auto mt-24 p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-center text-2xl font-bold mb-4">Signup</h2>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button onClick={createUserCredentials} className="w-full bg-pastel-500 hover:bg-pastel-600 text-white font-bold py-2 px-4 rounded">
            Signup
          </button>
          <div className="my-4">
            <hr className="w-full" />
          </div>
          <button onClick={() => loginWithGoogle()} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Login with Google
          </button>
        </div>
        <div className="text-center pt-2">
            <a href='/signin'>Have an account?</a>
        </div>
      </>
    </>
  );
};

export default Home;
