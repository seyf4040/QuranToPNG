// utils/exportEnhancer.js
/**
 * Enhanced export functions that ensure proper rendering of Arabic text
 * and centering in exported files
 */

/**
 * Prepares an element for export by applying temporary styles
 * @param {React.RefObject} elementRef - Reference to the element to be exported
 * @param {Object} options - Export options
 * @returns {Object} Original styles and modified element data
 */
export const prepareElementForExport = (elementRef, options) => {
  if (!elementRef.current) return null;
  
  // Store original styles to restore later
  const originalStyle = elementRef.current.style.cssText;
  
  // Apply temporary styles for proper export rendering
  elementRef.current.style.cssText = `
    width: ${options.width}px !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 20px !important;
    overflow: visible !important;
    display: block !important;
    position: relative !important;
    text-align: ${options.textAlign || 'center'} !important;
    direction: rtl !important;
    font-size: ${options.fontSize || '32'}px !important;
    line-height: 1.8 !important;
  `;
  
  return {
    originalStyle,
    element: elementRef.current
  };
};

/**
 * Restores the original style of an element after export
 * @param {HTMLElement} element - The element to restore
 * @param {string} originalStyle - The original CSS styles
 */
export const restoreElementStyle = (element, originalStyle) => {
  if (element) {
    element.style.cssText = originalStyle;
  }
};

/**
 * Creates a properly configured export options object for html-to-image
 * @param {Object} options - User's export options
 * @param {HTMLElement} element - Element to be exported
 * @returns {Object} - Configured options for html-to-image
 */
export const createExportOptions = (options, element) => {
  return {
    backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
    width: options.width,
    height: Math.max(element.offsetHeight, 400), // Ensure minimum height
    style: {
      // Apply styles that ensure proper rendering
      margin: '0 auto',
      textAlign: options.textAlign || 'center',
      direction: 'rtl',
      padding: '20px',
      overflow: 'visible',
      fontFamily: options.fontFamily,
      fontSize: `${options.fontSize}px`,
      lineHeight: '1.8',
      color: options.textColor,
      backgroundColor: options.backgroundOpacity === 0 
        ? 'transparent' 
        : options.backgroundColor,
    },
    // Improve quality
    pixelRatio: Math.max(window.devicePixelRatio || 1, 2),
    // Ensure all content is captured
    canvasWidth: options.width * 2,
    canvasHeight: Math.max(element.offsetHeight, 400) * 2,
    // Set a reasonable timeout
    timeout: 5000,
    // Include fonts in the export
    fontEmbedCSS: `
      @font-face {
        font-family: 'KFGQPC Uthmanic Script HAFS';
        src: url('/fonts/UthmanicHafs.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Uthmanic_Hafs_1';
        src: url('/fonts/uthmanic_hafs_v22.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Uthmanic_Hafs_2';
        src: url('/fonts/UthmanicHafs_V22.ttf') format('truetype');
      }
    `,
  };
};

/**
 * Helper to create a deep copy of a DOM element for export
 * Ensures all styles are properly applied
 * @param {HTMLElement} element - The original element
 * @param {Object} options - Style options to apply
 * @returns {HTMLElement} - Cloned element with styles applied
 */
export const createClonedElementForExport = (element, options) => {
  // Create a container div
  const container = document.createElement('div');
  
  // Apply container styles
  container.style.cssText = `
    width: ${options.width}px;
    margin: 0 auto;
    padding: 20px;
    direction: rtl;
    text-align: ${options.textAlign || 'center'};
    background-color: ${options.backgroundOpacity === 0 
      ? 'transparent' 
      : options.backgroundColor + Math.round(options.backgroundOpacity * 255).toString(16).padStart(2, '0')};
  `;
  
  // Clone the content
  const clone = element.cloneNode(true);
  
  // Apply styles to the clone
  clone.style.cssText = `
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize}px;
    color: ${options.textColor};
    line-height: 1.8;
    text-align: ${options.textAlign || 'center'};
    direction: rtl;
  `;
  
  // Add to container
  container.appendChild(clone);
  
  // Add to document temporarily for proper rendering
  document.body.appendChild(container);
  
  // Force layout recalculation to ensure all styles are applied
  container.getBoundingClientRect();
  
  return {
    container,
    cleanup: () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };
};

export default {
  prepareElementForExport,
  restoreElementStyle,
  createExportOptions,
  createClonedElementForExport
};