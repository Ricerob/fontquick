import Header from "./header";
import Footer from "./footer";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,100;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,300;1,400;1,500;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Moonrocks&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet"></link>
      </Head>
      <div
        className="m-0 flex flex-col min-h-screen divide-y divide-black-300 bg-pastel-100"
      >
        <div className="h-8 ">
          <Header />
        </div>
        <div className="flex-grow flex flex-col m-0">{children}</div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>

  );
}
