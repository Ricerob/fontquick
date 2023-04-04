import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "../lib/authContext";
import { useState } from 'react'
import FontCard from '../components/atoms/FontCard'
import { useRouter } from 'next/router'

type FontInfo = {
  author: string,
  downloads: number,
  img: string,
  license: string,
  name: string,
}

type FontInfoResponse = {
  info?: FontInfo[],
  body: string
}

const App: NextPage = () => {
  const { user, loading } = useAuth();
  const [result, setResult] = useState<string>('Make your request as specific as possible!')
  const [fontInfo, setFontInfo] = useState<FontInfo[]>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  if (loading) return <h1>Loading...</h1>;
  if (!user) {
    router.push('/signin')
    return <h1>Login needed!</h1>
  };

  async function getPrediction(): Promise<void> {
    setResult('Getting recomendations... sit tight!')
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
    console.log(data);
    setResult("Here are your recommendations!");
    setFontInfo(data.info);
  }

  const handlePrev = () => {
    if (fontInfo) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? fontInfo.length - 1 : prevIndex - 1));
    }
  };

  const handleNext = () => {
    if (fontInfo) {
      setCurrentIndex((prevIndex) => (prevIndex === fontInfo.length - 1 ? 0 : prevIndex + 1));
    }
  };


  return (
    <>
      <Head>
        <title>fontquick</title>
      </Head>

      <main>
        <div className="flex justify-center items-center">
          <div className="bg-gray-100 p-8 rounded shadow-md my-10">
            <input className="w-full px-4 py-2 mb-4 border rounded" type="text" placeholder="Enter text here" id='prompt_text' />
            <button className="w-full bg-pastel-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => getPrediction()}>
              Recommend
            </button>
            <p className="mt-4 text-gray-700 text-center">{result}</p>
          </div>
        </div>
        {fontInfo && <div>
          <div className="flex items-center justify-center space-x-8">
            <div className="arrow" onClick={handlePrev}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
              </svg>
            </div>
            <div>
              <FontCard {...fontInfo[currentIndex]} />
            </div>
            <div className="arrow" onClick={handleNext}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
                <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z" />
              </svg>
            </div>
          </div>

        </div>}
      </main>

    </>
  );
};

export default App;
