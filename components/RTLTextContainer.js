// components/RTLTextContainer.js
import { useRef, useEffect } from 'react';

/**
 * A specialized component for properly rendering Right-to-Left (RTL) Arabic text
 * Handles proper text direction, font rendering, and special RTL text considerations
 */
const RTLTextContainer = ({ 
  children, 
  className = '',
  fontFamily,
  fontSize,
  textColor,
  backgroundColor,
  backgroundOpacity,
  textAlign,
  width,
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  
  // Apply bidirectional text handling
  useEffect(() => {
    if (containerRef.current) {
      // Ensure proper RTL rendering
      containerRef.current.setAttribute('dir', 'rtl');
      containerRef.current.setAttribute('lang', 'ar');
      
      // Add class to handle font rendering
      containerRef.current.classList.add('arabic-text-container');
    }
  }, []);
  
  // Create combined styles
  const combinedStyles = {
    direction: 'rtl',
    fontFamily: fontFamily || 'KFGQPC Uthmanic Script HAFS',
    fontSize: fontSize ? `${fontSize}px` : '32px',
    color: textColor || '#000000',
    backgroundColor: backgroundOpacity === 0 ? 'transparent' 
      : backgroundColor 
        ? `${backgroundColor}${Math.round(backgroundOpacity * 255).toString(16).padStart(2, '0')}`
        : 'transparent',
    textAlign: textAlign || 'center',
    width: width ? `${width}px` : '100%',
    maxWidth: '100%',
    padding: '20px',
    lineHeight: '1.8',
    // Prevent layout shifts with ligature rendering
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    // Improve Arabic text rendering
    letterSpacing: '-0.2px',
    wordSpacing: '1px',
    // Ensure proper word wrapping for Arabic
    overflowWrap: 'break-word',
    wordBreak: 'keep-all',
    // User-provided styles take precedence
    ...style
  };
  
  return (
    <div
      ref={containerRef}
      className={`rtl-text-container ${className}`}
      style={combinedStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default RTLTextContainer;
