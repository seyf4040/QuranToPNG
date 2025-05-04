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
  width 
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
      {/* Render the Quran text with proper ayah number formatting */}
      {ayahText && ayahText.split(/(\s*﴿\d+﴾\s*)/).map((part, index) => {
        // Check if this part is an ayah number marker
        if (part.match(/﴿\d+﴾/)) {
          return <span key={index} style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.max(16, fontSize * 0.7)}px`,
            color: textColor,
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