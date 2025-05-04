// utils/quranUtils.js
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Import the enhanced export utilities
import exportEnhancer from './exportEnhancer';
import fontExportHelper from './fontExportHelper';


/**
 * Fetch Quran data from API or local JSON
 * Can be extended to use an external API instead of local JSON
 */
export const fetchQuranData = async () => {
  try {
    // For local JSON:
    const quranData = (await import('../data/quran.json')).default;
    return quranData;
    
    // For API integration (uncomment when ready):
    // const response = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    // const data = await response.json();
    // return data.data;
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    return null;
  }
};

/**
 * Get a specific surah by number
 */
export const getSurah = (quranData, surahNumber) => {
  if (!quranData || !Array.isArray(quranData)) return null;
  return quranData.find(s => s.id === parseInt(surahNumber));
};

/**
 * Get ayahs from a surah with range
 */
export const getAyahsFromSurah = (surah, startAyah, endAyah) => {
  if (!surah || !surah.verses) return '';
  
  let text = '';
  const start = Math.max(1, parseInt(startAyah));
  const end = Math.min(parseInt(endAyah), surah.total_verses);
  
  for (let i = start - 1; i < end; i++) {
    // Add bismillah for first ayah of surah except for Surah 9 and except for Surah 1 if the ayah is 1
    if (i === 0 && start === 1 && surah.id !== 9 && surah.id !== 1) {
      text += 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ';
    }
    
    // Add ayah text with ayah number in traditional Quranic format
    text += surah.verses[i].text + ' ﴿' + (i + 1) + '﴾ ';
  }
  
  return text;
};

/**
 * Export functions for different file formats
 * With improved font handling
 */
export const exportFunctions = {
  toPNG: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      // Store original styles
      const originalStyles = elementRef.current.style.cssText;
      
      // Preload the font to ensure it's available
      await fontExportHelper.preloadFontForExport(options.fontFamily);
      
      // Get font CSS for embedding
      const fontCSS = await fontExportHelper.getFontEmbedCSS();
      
      // Configure export options
      const exportOptions = {
        backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
        width: options.width,
        height: elementRef.current.offsetHeight,
        style: {
          margin: '0 auto',
          fontFamily: options.fontFamily,
        },
        fontEmbedCSS: fontCSS,
        pixelRatio: 2, // Higher quality
        skipFonts: false, // Important: don't skip fonts
      };
      
      // Apply temporary styles to ensure proper text rendering
      elementRef.current.style.cssText = `
        width: ${options.width}px !important;
        font-family: ${options.fontFamily} !important;
        font-size: ${options.fontSize}px !important;
        color: ${options.textColor} !important;
        text-align: ${options.textAlign} !important;
        direction: rtl !important;
        line-height: 1.8 !important;
        padding: 20px !important;
        margin: 0 auto !important;
        display: block !important;
      `;
      
      // Import html-to-image dynamically
      const { toPng } = await import('html-to-image');
      
      // Generate the PNG
      const dataUrl = await toPng(elementRef.current, exportOptions);
      
      // Restore original styles
      elementRef.current.style.cssText = originalStyles;
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting PNG:', error);
      return null;
    }
  },
  
  toSVG: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      // Store original styles
      const originalStyles = elementRef.current.style.cssText;
      
      // Preload the font to ensure it's available
      await fontExportHelper.preloadFontForExport(options.fontFamily);
      
      // Get font CSS for embedding
      const fontCSS = await fontExportHelper.getFontEmbedCSS();
      
      // Configure export options for SVG
      const exportOptions = {
        backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
        width: options.width,
        height: elementRef.current.offsetHeight,
        style: {
          margin: '0 auto',
          fontFamily: options.fontFamily,
        },
        fontEmbedCSS: fontCSS,
        skipFonts: false, // Important: don't skip fonts
      };
      
      // Apply temporary styles to ensure proper text rendering
      elementRef.current.style.cssText = `
        width: ${options.width}px !important;
        font-family: ${options.fontFamily} !important;
        font-size: ${options.fontSize}px !important;
        color: ${options.textColor} !important;
        text-align: ${options.textAlign} !important;
        direction: rtl !important;
        line-height: 1.8 !important;
        padding: 20px !important;
        margin: 0 auto !important;
        display: block !important;
      `;
      
      // Import html-to-image dynamically
      const { toSvg } = await import('html-to-image');
      
      // Generate the SVG
      const dataUrl = await toSvg(elementRef.current, exportOptions);
      
      // Restore original styles
      elementRef.current.style.cssText = originalStyles;
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting SVG:', error);
      return null;
    }
  },
  
  toPDF: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      // Store original styles
      const originalStyles = elementRef.current.style.cssText;
      
      // Preload the font to ensure it's available
      await fontExportHelper.preloadFontForExport(options.fontFamily);
      
      // Configure export options
      const exportOptions = {
        backgroundColor: options.backgroundOpacity === 0 ? 'white' : undefined, // PDFs need background
        width: options.width,
        height: elementRef.current.offsetHeight,
        style: {
          margin: '0 auto',
          fontFamily: options.fontFamily,
        },
        pixelRatio: 2, // Higher quality
      };
      
      // Apply temporary styles to ensure proper text rendering
      elementRef.current.style.cssText = `
        width: ${options.width}px !important;
        font-family: ${options.fontFamily} !important;
        font-size: ${options.fontSize}px !important;
        color: ${options.textColor} !important;
        text-align: ${options.textAlign} !important;
        direction: rtl !important;
        line-height: 1.8 !important;
        padding: 20px !important;
        margin: 0 auto !important;
        display: block !important;
      `;
      
      // Import html-to-image dynamically
      const { toPng } = await import('html-to-image');
      
      // First convert to PNG
      const pngData = await toPng(elementRef.current, exportOptions);
      
      // Restore original styles
      elementRef.current.style.cssText = originalStyles;
      
      // Calculate PDF dimensions
      const height = elementRef.current.offsetHeight;
      const width = options.width;
      
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      
      // Create PDF with appropriate dimensions
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      
      // Add the image to the PDF
      pdf.addImage(pngData, 'PNG', 0, 0, width, height);
      
      return pdf;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return null;
    }
  }
};

/**
 * Get available Quranic fonts
 * Now dynamically loads fonts from the fonts.json file
 * @returns {Promise<Array>} Promise resolving to array of font objects
 */
export const getQuranicFonts = async () => {
  try {
    // Attempt to fetch fonts from the JSON file
    if (typeof window !== 'undefined') {
      const response = await fetch('/fonts/fonts.json');
      
      if (!response.ok) {
        throw new Error('Failed to load fonts configuration');
      }
      
      const fontData = await response.json();
      
      // Transform the font data to include additional information
      return fontData.map(font => ({
        name: font.name,
        style: font.label || font.name,
        file: font.file,
        isSpecialized: font.name.includes('Uthmanic') || 
                      font.name.includes('Quran') || 
                      font.name.includes('Kufi')
      }));
    }
    
    // Fallback for server-side rendering or if fetch fails
    throw new Error('Cannot fetch fonts on server or fetch failed');
  } catch (error) {
    console.warn('Error loading fonts from JSON:', error);
    // Return default fonts as fallback
    return [
      {
        name: 'KFGQPC Uthmanic Script HAFS',
        style: 'Traditional Uthmani script used in many Quran prints',
        isSpecialized: true
      },
      {
        name: 'Uthmanic_Hafs_1',
        style: 'Hafs (small)',
        isSpecialized: true
      },
      {
        name: 'Uthmanic_Hafs_2',
        style: 'Hafs (big)',
        isSpecialized: true
      },
      {
        name: 'Uthmanic_Warsh_1',
        style: 'Warsh',
        isSpecialized: true
      },
      {
        name: 'Kufi Style',
        style: 'Kufi Style',
        isSpecialized: true
      },
      {
        name: 'Amiri Quran',
        style: 'Classical Naskh style font optimized for Quran',
        isSpecialized: true
      },
      {
        name: 'Scheherazade New',
        style: 'Modern Arabic font with good readability',
        isSpecialized: false
      },
      {
        name: 'Noto Naskh Arabic',
        style: 'Google\'s Arabic Naskh font with wide coverage',
        isSpecialized: false
      }
    ];
  }
};

/**
 * Synchronous version of getQuranicFonts for use in components
 * that can't use async/await directly in render functions
 * @returns {Array} Array of font objects
 */
export const getQuranicFontsSync = () => {
  // Default fonts to use initially before async load completes
  return [
    {
      name: 'KFGQPC Uthmanic Script HAFS',
      style: 'Traditional Uthmani script used in many Quran prints',
      isSpecialized: true
    },
    {
      name: 'Uthmanic_Hafs_1',
      style: 'Hafs (small)',
      isSpecialized: true
    },
    {
      name: 'Uthmanic_Hafs_2',
      style: 'Hafs (big)',
      isSpecialized: true
    },
    {
      name: 'Uthmanic_Warsh_1',
      style: 'Warsh',
      isSpecialized: true
    }
  ];
};

/**
 * Validate Surah and Ayah selection
 */
export const validateSelection = (surah, startAyah, endAyah) => {
  if (!surah) return false;
  
  const maxAyah = surah.total_verses;
  const start = parseInt(startAyah);
  const end = parseInt(endAyah);
  
  // Check if values are valid
  if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > maxAyah) {
    return false;
  }
  
  return true;
};

/**
 * Helper to handle background color with transparency
 */
export const getBackgroundWithOpacity = (color, opacity) => {
  if (opacity === 0) return 'transparent';
  
  // Convert opacity (0-1) to hex (00-FF)
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  
  // Return color with alpha channel
  return `${color}${alpha}`;
};

/**
 * Get appropriate filename for export based on content
 */
export const getExportFilename = (surah, startAyah, endAyah) => {
  if (!surah) return 'quran-text';
  
  const surahName = surah.transliteration.toLowerCase().replace(/\s+/g, '-');
  return `quran-${surahName}-${startAyah}${startAyah !== endAyah ? `-${endAyah}` : ''}`;
};


