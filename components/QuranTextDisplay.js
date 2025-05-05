// components/QuranTextDisplay.js
import { useRef, useEffect } from 'react';
import { getBackgroundWithOpacity } from '../utils/quranUtils';

const QuranTextDisplay = ({ 
  ayahText, 
  fontFamily, 
  fontSize, 
  textColor, 
  backgroundColor, 
  backgroundOpacity, 
  textAlign, 
  width,
  customAyahNumberColor,
  surahNumber,
  startAyah
}) => {
  const displayRef = useRef(null);
  
  // Effect to handle font loading and display
  useEffect(() => {
    // Add a class to indicate when text is ready to be displayed
    // This prevents the "flash of unstyled text" common with Arabic fonts
    if (displayRef.current && ayahText) {
      displayRef.current.classList.add('arabic-text');
      
      // Remove the class after fonts should have loaded
      setTimeout(() => {
        if (displayRef.current) {
          displayRef.current.classList.remove('arabic-text');
        }
      }, 300);
    }
  }, [ayahText, fontFamily]);

  // Determine the color to use for ayah numbers
  const ayahNumberColor = customAyahNumberColor !== undefined ? customAyahNumberColor : textColor;

  // Function to determine if Bismillah should be displayed
  const shouldShowBismillah = () => {
    // Only show Bismillah if we're starting from the first ayah
    if (parseInt(startAyah) !== 1) {
      return false;
    }
    
    // Don't show Bismillah for Surah 9 (At-Tawbah) - it's the only surah without Bismillah
    // and Surah 1 (Al-Fatiha) as it already contains Bismillah
    if (surahNumber === 9 || surahNumber === 1) {
      return false;
    }
    
    // For all other surahs starting with ayah 1, show Bismillah at the top
    return true;
  };

  // The Bismillah text
  const bismillahText = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";

  return (
    <div 
      ref={displayRef}
      className="quran-text-display overflow-hidden rounded-md"
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
        color: textColor,
        backgroundColor: getBackgroundWithOpacity(backgroundColor, backgroundOpacity),
        textAlign: textAlign,
        padding: '20px',
        lineHeight: '1.8',
        // Add text shadow for better readability
        textShadow: textColor === '#ffffff' ? '0 0 1px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {/* Display Bismillah at the top only if we're starting from ayah 1 and it's not surah 9 or 1*/}
      {ayahText && shouldShowBismillah() && (
        <div 
          className="bismillah-container"
          style={{
            marginBottom: '1em',
            textAlign: 'center',
            fontSize: `${fontSize * 0.9}px`,
          }}
        >
          {bismillahText}
        </div>
      )}
      
      {/* Render the Quran text with proper ayah number formatting */}
      {ayahText && ayahText.split(/(\s*﴿\d+﴾\s*)/).map((part, index) => {
        // Check if this part is an ayah number marker
        if (part.match(/﴿\d+﴾/)) {
          return <span key={index} style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.max(16, fontSize * 0.7)}px`,
            color: ayahNumberColor,
            opacity: 0.8,
            padding: '0 4px',
          }}>{part}</span>;
        }
        return <span key={index}>{part}</span>;
      })}
      
      {/* Show a placeholder if no text is available */}
      {!ayahText && (
        <div className="text-gray-400 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
          Select a Surah and Ayah to display Quranic text
        </div>
      )}
    </div>
  );
};

export default QuranTextDisplay;