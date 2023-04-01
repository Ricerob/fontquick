import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Typed from 'typed.js';
import { useEffect } from 'react';

const Home: NextPage = () => {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const options = {
        strings: [
          '<span class="text-pastel-700 text-3xl font-Cedarville">a seaside wedding RSVP</span>',
          '<span class="text-pastel-700 text-3xl font-VT323">a new pixel art commission</span>',
          '<span class="text-pastel-700 text-2xl font-Orbitron font-bold">an indie sci-fi flick</span>',
          '<span class="text-pastel-700 text-2xl font-Rubik">a children\'s book on space</span>',
          '<span class="text-pastel-700 text-2xl font-EB">a flyer about reading more books</span>',
        ],
        typeSpeed: 50,
        backSpeed: 60,
        backDelay: 900,
        loop: true,
        smartBackspace: true,
        showCursor: false,
        contentType: 'html',
        shuffle: true,
      };
      const typed = new Typed('.typing-animation', options);
      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>fontquick</title>
      </Head>

      <main className="min-h-100">
        <div className="w-full h-1/2 mt-40 md:mt-60 flex flex-col md:flex-row justify-center items-center relative px-10">
          <div className="w-full flex justify-center items-center flex-col text-center pb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-black font-Alegreya font-bold">
              fontquick
            </h1>
            <h2 className="font-Alegreya text-pastel-800 text-2xl mb-2 max-w-4xl mx-auto text-center">I need a font for...</h2>
            <div className="text-center h-16">
              <div className="typing-animation"></div>
            </div>
            <Link href="/app">
              <a className="mt-2 bg-white text-black py-2 px-6 rounded-full text-lg transition duration-500 ease-in-out transform hover:scale-110">
                get started
              </a>
            </Link>
          </div>
        </div>
        <div className="relative mt-40">
          <div style={{ height: "100px", overflow: "hidden" }}>
            <svg id="idxSVG" viewBox="0 0 500 150" preserveAspectRatio="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%" }}>
              <path d="M0.00,49.99 C150.00,150.00 349.20,-49.99 500.00,49.99 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none", fill: "#b2d8bb" }}></path>
            </svg>
          </div>
        </div>
        <div className="bg-pastel-200 px-10">
          <div className="max-w-4xl mx-auto text-center">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Business Ventures</h3>
                <p className="text-gray-600">Find the perfect font for a new startup or your company's advertising material.</p>
              </li>
              <li className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Event Materials</h3>
                <p className="text-gray-600">Need to capture attention for the masses? Say no more - fontquick can help to find your audience.</p>
              </li>
              <li className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Creative Endeavors</h3>
                <p className="text-gray-600">Whether it's a high-end fashion magazine or a death metal concert poster, we've got you covered.</p>
              </li>
              <li className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Anything Else</h3>
                <p className="text-gray-600">Any use case is valid here - with over 30k fonts in our database, we're sure to find you a font you'll love!</p>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 h-96 md:h-auto relative my-6">
              <video className="w-full h-full object-cover" autoPlay loop muted>
                <source src="/fq.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

      </main>

    </>
  );
};

export default Home;
