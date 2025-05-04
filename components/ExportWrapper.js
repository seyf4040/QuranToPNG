// components/ExportWrapper.js
import React, { forwardRef } from 'react';
import { getBackgroundWithOpacity } from '../utils/quranUtils';

/**
 * Special wrapper component for exports to ensure proper centering
 */
const ExportWrapper = forwardRef(({ 
  children,
  fontFamily,
  fontSize,
  textColor,
  backgroundColor,
  backgroundOpacity,
  textAlign,
  width,
  ...props
}, ref) => {
  return (
    <div 
      className="export-container"
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: getBackgroundWithOpacity(backgroundColor, backgroundOpacity),
        padding: '20px',
        boxSizing: 'border-box',
      }}
      {...props}
    >
      <div
        ref={ref}
        className="quran-export-wrapper force-center"
        style={{
          width: '100%',
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          textAlign: 'center',
          direction: 'rtl',
          lineHeight: '1.8',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          display: 'block',
          margin: '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
});

ExportWrapper.displayName = 'ExportWrapper';

export default ExportWrapper;