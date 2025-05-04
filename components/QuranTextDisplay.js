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

  // Calculate proper container height based on content
  const getMinHeight = () => {
    // Approximate height based on font size and text length
    const linesEstimate = Math.ceil(ayahText.length / 40); // Rough estimate
    const minHeight = Math.max(100, linesEstimate * (fontSize * 1.8));
    return `${minHeight}px`;
  };

  return (
    <div className="quran-text-container" style={{
      width: `${width}px`,
      maxWidth: '100%',
      margin: '0 auto',
      textAlign: textAlign,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: getBackgroundWithOpacity(backgroundColor, backgroundOpacity),
    }}>
      <div 
        ref={displayRef}
        className="quran-text-display"
        style={{
          width: '100%',
          direction: 'rtl',
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          textAlign: textAlign,
          padding: '20px',
          lineHeight: '1.8',
          minHeight: getMinHeight(),
          // Add text shadow for better readability
          textShadow: textColor === '#ffffff' ? '0 0 1px rgba(0,0,0,0.1)' : 'none',
          // Ensure correct display for export
          display: 'block',
          position: 'relative',
          overflow: 'visible',
          boxSizing: 'border-box',
          // Add word wrapping control for Arabic text
          wordWrap: 'break-word',
          wordBreak: 'keep-all',
          // Improve rendering
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
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
              display: 'inline-block',
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
    </div>
  );
};

export default QuranTextDisplay;