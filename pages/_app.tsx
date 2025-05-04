// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quran Ayah Display Generator</title>
        <meta name="description" content="Generate beautiful Quranic verses for display with customization options" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;