/**
 * Font export helper functions
 * Ensures fonts are properly embedded in exported images
 */

/**
 * Generates CSS for font embedding in SVG and PNG exports
 * @returns {string} CSS for font embedding
 */
export const getFontEmbedCSS = async () => {
  // Try to load fonts.json
  let fontFaces = '';
  try {
    // Only run in browser
    if (typeof window !== 'undefined') {
      const response = await fetch('/fonts/fonts.json');
      if (response.ok) {
        const fonts = await response.json();
        
        // Generate @font-face declarations for each font
        fonts.forEach(font => {
          fontFaces += `
            @font-face {
              font-family: '${font.name}';
              src: url('${window.location.origin}${font.file}') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
          `;
        });
      }
    }
  } catch (error) {
    console.warn('Could not load fonts.json, using fallback font declarations', error);
    
    // Fallback font definitions
    fontFaces = `
      @font-face {
        font-family: 'Uthmanic_Hafs_1';
        src: url('${window.location.origin}/fonts/uthmanic_hafs_v22.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Uthmanic_Hafs_2';
        src: url('${window.location.origin}/fonts/UthmanicHafs_V22.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Uthmanic_Warsh_1';
        src: url('${window.location.origin}/fonts/UthmanicWarsh_V21.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Kufi Style';
        src: url('${window.location.origin}/fonts/KFGQPC-KufiStyV14.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
  }
  
  // Add additional CSS to ensure proper RTL rendering and font display
  return `
    ${fontFaces}
    
    /* RTL support */
    [dir="rtl"] {
      direction: rtl;
      text-align: right;
    }
    
    /* Additional styles to ensure proper rendering */
    .quran-text-display {
      direction: rtl;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: "kern", "liga", "calt";
    }
  `;
};

/**
 * Converts font data to Data URI for embedding
 * @param {string} fontUrl - URL of the font file
 * @returns {Promise<string>} Data URI of the font
 */
export const fontToDataURI = async (fontUrl) => {
  try {
    const response = await fetch(fontUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting font to data URI:', error);
    return null;
  }
};

/**
 * Preloads fonts for export
 * @param {string} fontFamily - Name of the font family to preload
 * @returns {Promise<boolean>} True if font was preloaded successfully
 */
export const preloadFontForExport = async (fontFamily) => {
  if (typeof document === 'undefined') return false;
  
  try {
    // Create a temporary element to force font loading
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.style.fontFamily = fontFamily;
    tempElement.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'; // Bismillah for testing
    document.body.appendChild(tempElement);
    
    // Force browser to load the font
    if ('fonts' in document) {
      await document.fonts.load(`1em '${fontFamily}'`);
    } else {
      // Fallback for browsers without Font Loading API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Clean up
    document.body.removeChild(tempElement);
    return true;
  } catch (error) {
    console.warn(`Could not preload font ${fontFamily}:`, error);
    return false;
  }
};

/**
 * Creates a template with embedded fonts
 * @param {Object} options - Export options including font settings
 * @returns {Promise<string>} HTML template with embedded fonts
 */
export const createTemplateWithFonts = async (options) => {
  const fontCSS = await getFontEmbedCSS();
  
  return `
    <html>
    <head>
      <style>
        ${fontCSS}
        body {
          margin: 0;
          padding: 0;
          width: ${options.width}px;
          background-color: ${options.backgroundOpacity === 0 ? 'transparent' : options.backgroundColor};
        }
        .content {
          font-family: '${options.fontFamily}', 'Arial', sans-serif;
          font-size: ${options.fontSize}px;
          color: ${options.textColor};
          text-align: ${options.textAlign};
          direction: rtl;
          padding: 20px;
          width: 100%;
          box-sizing: border-box;
          line-height: 1.8;
        }
      </style>
    </head>
    <body>
      <div class="content">
        ${options.content}
      </div>
    </body>
    </html>
  `;
};

export default {
  getFontEmbedCSS,
  fontToDataURI,
  preloadFontForExport,
  createTemplateWithFonts
};