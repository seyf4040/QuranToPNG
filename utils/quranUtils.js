// utils/quranUtils.js
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

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
 */
export const exportFunctions = {
  toPNG: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      const dataUrl = await toPng(elementRef.current, { 
        backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
        width: options.width,
        style: {
          transform: 'scale(2)', // Higher resolution
          transformOrigin: 'top left',
          width: `${options.width}px`
        }
      });
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting PNG:', error);
      return null;
    }
  },
  
  toSVG: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      const dataUrl = await toSvg(elementRef.current, { 
        backgroundColor: options.backgroundOpacity === 0 ? 'transparent' : undefined,
        width: options.width,
        style: {
          width: `${options.width}px`
        }
      });
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting SVG:', error);
      return null;
    }
  },
  
  toPDF: async (elementRef, options) => {
    if (!elementRef.current) return null;
    
    try {
      // First convert to PNG
      const pngData = await toPng(elementRef.current, { 
        backgroundColor: options.backgroundOpacity === 0 ? 'white' : undefined, // PDFs need background
        width: options.width,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: `${options.width}px`
        }
      });
      
      // Create PDF with appropriate dimensions
      const pdf = new jsPDF({
        orientation: options.width > elementRef.current.offsetHeight * 2 ? 'landscape' : 'portrait',
        unit: 'px',
        format: [options.width, elementRef.current.offsetHeight * 2]
      });
      
      // Add the image to the PDF
      pdf.addImage(pngData, 'PNG', 0, 0, options.width, elementRef.current.offsetHeight * 2);
      return pdf;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return null;
    }
  }
};

/**
 * Get available Quranic fonts
 */
export const getQuranicFonts = () => {
  return [
    {
      name: 'KFGQPC Uthmanic Script HAFS',
      style: 'Traditional Uthmani script used in many Quran prints',
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
    },
    {
      name: 'Me Quran',
      style: 'Specialized font for Quranic text with tajweed marks',
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