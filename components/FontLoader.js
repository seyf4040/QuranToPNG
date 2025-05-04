// components/FontLoader.js
import Head from 'next/head';

const FontLoader = () => {
  return (
    <Head>
      {/* Common Arabic fonts from Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Amiri&family=Scheherazade+New&family=Noto+Naskh+Arabic&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Custom font definitions for specialized Quranic fonts */}
      <style jsx global>{`
        
        @font-face {
          font-family: 'Uthmanic_Hafs_1';
          src: url('/fonts/uthmanic_hafs_v22.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Uthmanic_Hafs_2';
          src: url('/fonts/UthmanicHafs_V22.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Uthmanic_Warsh_1';
          src: url('/fonts/UthmanicWarsh_V21.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Kufi Style';
          src: url('/fonts/KFGQPC-KufiStyV14.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        /* Add a helper class to handle font loading */
        .arabic-text {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        body:not(.fonts-loaded) .arabic-text {
          opacity: 0;
        }
        
        body.fonts-loaded .arabic-text {
          opacity: 1;
        }
        
        /* Apply appropriate direction for Arabic text */
        [dir="rtl"] {
          text-align: right;
          direction: rtl;
        }
        
        /* Improve rendering of Arabic text */
        .quran-text-display {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      
      {/* Add script to detect when fonts are loaded */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Simple font loading detection
          if ("fonts" in document) {
            Promise.all([
              document.fonts.load("1em 'Uthmanic_Hafs_1'"),
              document.fonts.load("1em 'Uthmanic_Hafs_2'"),
              document.fonts.load("1em 'Uthmanic_Warsh_1'"),
              document.fonts.load("1em 'Kufi Style'")
            ]).then(() => {
              document.body.classList.add('fonts-loaded');
            }).catch(err => {
              console.error('Font loading error:', err);
              // Add the class anyway after a timeout to ensure content is visible
              setTimeout(() => {
                document.body.classList.add('fonts-loaded');
              }, 1000);
            });
          } else {
            // Fallback for browsers that don't support the fonts API
            setTimeout(() => {
              document.body.classList.add('fonts-loaded');
            }, 1000);
          }
        `
      }} />
    </Head>
  );
};

export default FontLoader;