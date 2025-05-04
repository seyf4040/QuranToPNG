/**
 * Special PNG exporter that ensures fonts are properly embedded
 * and content is correctly centered
 */

/**
 * Preloads all fonts needed for proper export
 * @returns {Promise<void>}
 */
const preloadAllFonts = async () => {
  if (typeof document === 'undefined') return;
  
  // Check if Font Loading API is available
  if ('fonts' in document) {
    try {
      // Wait for all fonts to load
      await document.fonts.ready;
      console.log('All fonts loaded successfully');
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  }
};

/**
 * Generates font CSS for the fonts in use
 * @param {HTMLElement} element - DOM element to export
 * @returns {Promise<string>} - CSS with font definitions
 */
const generateFontCSS = async (element) => {
  if (typeof document === 'undefined') return '';
  
  let fontFaces = '';
  
  // Try to get fonts from document.fonts (Font Loading API)
  if ('fonts' in document) {
    try {
      // Wait for all fonts to load
      await document.fonts.ready;
      
      // Get all loaded fonts
      const fontFaceSet = document.fonts;
      
      // Collect unique font families
      const fontFamilies = new Set();
      fontFaceSet.forEach((fontFace) => {
        fontFamilies.add(fontFace.family.replace(/["']/g, ''));
      });
      
      // Fetch fonts.json to get paths
      const response = await fetch('/fonts/fonts.json');
      if (response.ok) {
        const fontData = await response.json();
        
        // For each font in fonts.json, check if it's used and create a @font-face rule
        for (const font of fontData) {
          const fontName = font.name.replace(/["']/g, '');
          if (fontFamilies.has(fontName)) {
            try {
              // Fetch the font file and convert to base64
              const fontUrl = font.file.startsWith('/') ? font.file : `/${font.file}`;
              const fontResponse = await fetch(fontUrl);
              if (!fontResponse.ok) continue;
              
              const fontBlob = await fontResponse.blob();
              const reader = new FileReader();
              const fontBase64 = await new Promise(resolve => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(fontBlob);
              });
              
              // Add as an embedded font
              fontFaces += `
                @font-face {
                  font-family: '${fontName}';
                  src: url("${fontBase64}") format('truetype');
                  font-weight: normal;
                  font-style: normal;
                }
              `;
            } catch (error) {
              console.warn(`Failed to embed font ${fontName}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating font CSS:', error);
    }
  }
  
  // Add additional CSS to ensure proper text alignment and centering
  fontFaces += `
    .quran-text-export-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      direction: rtl;
    }
    
    .quran-text-export-content {
      display: block;
      width: 100%;
      text-align: center !important;
      margin: 0 auto !important;
    }
  `;
  
  return fontFaces;
};

/**
 * Creates a centered wrapper around the content for export
 * @param {HTMLElement} element - Original element to wrap
 * @param {Object} options - Export options
 * @returns {HTMLElement} - New wrapped element for export
 */
const createCenteredWrapper = (element, options) => {
  // Create a new container for export
  const container = document.createElement('div');
  container.className = 'quran-text-export-container';
  container.style.width = `${options.width}px`;
  container.style.padding = '20px';
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = options.backgroundOpacity === 0 ? 'transparent' : options.backgroundColor;
  
  // Create content wrapper
  const content = document.createElement('div');
  content.className = 'quran-text-export-content';
  content.style.fontFamily = options.fontFamily;
  content.style.fontSize = `${options.fontSize}px`;
  content.style.color = options.textColor;
  content.style.textAlign = 'center';
  content.style.direction = 'rtl';
  content.style.width = '100%';
  content.style.margin = '0 auto';
  content.style.lineHeight = '1.8';
  content.style.display = 'block';
  
  // Copy the HTML content
  content.innerHTML = element.innerHTML;
  
  // Add to container
  container.appendChild(content);
  
  // Add to body temporarily (needed for rendering)
  document.body.appendChild(container);
  
  return {
    element: container,
    cleanup: () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };
};

/**
 * Export element to PNG with proper font embedding and centering
 * @param {HTMLElement} element - DOM element to export
 * @param {Object} options - Export options
 * @returns {Promise<string>} - PNG as data URL
 */
export const exportToPNG = async (element, options) => {
  if (!element) {
    throw new Error('No element provided for export');
  }
  
  // Ensure all fonts are loaded
  await preloadAllFonts();
  
  // Generate font CSS
  const fontCSS = await generateFontCSS(element);
  
  // Create a centered wrapper for export
  const { element: wrappedElement, cleanup } = createCenteredWrapper(element, options);
  
  try {
    // Import html-to-image dynamically
    const { toPng } = await import('html-to-image');
    
    // Configure export settings
    const exportOptions = {
      fontEmbedCSS: fontCSS,
      backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
      pixelRatio: 2, // Higher quality
      width: options.width,
      height: wrappedElement.offsetHeight,
      style: {
        // These styles ensure proper centering and font rendering
        textAlign: 'center',
        margin: '0 auto',
        display: 'block',
        width: '100%',
      },
      filter: (node) => {
        // Include all nodes
        return true;
      },
      skipFonts: false, // Important: don't skip fonts
    };
    
    // Generate the PNG
    const dataUrl = await toPng(wrappedElement, exportOptions);
    
    // Clean up temporary elements
    cleanup();
    
    return dataUrl;
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    // Clean up on error
    cleanup();
    throw error;
  }
};

export default {
  exportToPNG
};