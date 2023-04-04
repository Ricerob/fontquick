import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (user) {
    router.push('/app')
    return <h1>You're already logged in.</h1>
  };

  const auth = getAuth();

  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("success", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
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
      <Head>
        <title>Sign-in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-2/3 mx-auto mt-24 p-4 border rounded-lg shadow-lg bg-white">
        <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>
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
        <button onClick={() => login()} className="w-full bg-pastel-500 hover:bg-pastel-600 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
        <div className="my-4">
          <hr className="w-full" />
        </div>
        <button onClick={() => loginWithGoogle()} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Login with Google
        </button>
      </div>
      <div className="text-center pt-2">
        <Link href='/signup'>Need an account?</Link>
      </div>
    </>
  );
};

export default Home;
