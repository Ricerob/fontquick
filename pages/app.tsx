import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";
import { useState } from 'react'

const App: NextPage = () => {
  const { user, loading } = useAuth();
  const [result, setResult] = useState<string>('Result goes here')

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <h1>U need to login</h1>;

  async function getPrediction(): Promise<void> {
    const promptInput = document.getElementById('prompt_text') as HTMLInputElement;
    const prompt = promptInput.value;
    
    const response = await fetch('/api/make_prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
  
    const data = await response.json();
    console.log(data); // do something with the data, like updating the UI
    setResult(data.data)
  }
  

  return (
    <>
      <Head>
        <title>FontQuick</title>
      </Head>

      <main>
        <h1>Email : {user?.claims.email}</h1>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-gray-100 p-8 rounded shadow-md">
            <input className="w-full px-4 py-2 mb-4 border rounded" type="text" placeholder="Enter text here" id='prompt_text'/>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => getPrediction()}>
              Predict
            </button>
            <p className="mt-4 text-gray-700 text-center">{result}</p>
          </div>
        </div>
      </main>

    </>
  );
};

export default App;
