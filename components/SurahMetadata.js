// components/SurahMetadata.js
import { useState, useEffect } from 'react';

/**
 * Component to display metadata about a Surah
 * Shows relevant information like revelation type, meaning, and context
 */
const SurahMetadata = ({ surah }) => {
  const [expanded, setExpanded] = useState(false);
  const [surahInfo, setSurahInfo] = useState(null);
  
  useEffect(() => {
    if (surah) {
      setSurahInfo(getSurahInfo(surah.id));
    }
  }, [surah]);
  
  if (!surah) {
    return null;
  }
  
  return (
    <div className="surah-metadata bg-white border border-gray-200 rounded-md overflow-hidden">
      <div 
        className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium">
          Surah Information: {surah.transliteration} ({surah.name})
        </h3>
        <button className="text-blue-600">
          <svg 
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && surahInfo && (
        <div className="p-4 text-sm">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium mb-1">Basic Information</p>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li><strong>Number:</strong> {surah.id}</li>
                <li><strong>Name:</strong> {surah.name}</li>
                <li><strong>English Name:</strong> {surah.transliteration}</li>
                <li><strong>Revelation Type:</strong> {surah.type && surah.type.charAt(0).toUpperCase() + surah.type.slice(1)}</li>
                <li><strong>Number of Ayahs:</strong> {surah.total_verses}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Details</p>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li><strong>Order of Revelation:</strong> {surahInfo.revelationOrder}</li>
                <li><strong>Main Theme:</strong> {surahInfo.mainTheme}</li>
                <li><strong>Period:</strong> {surahInfo.period}</li>
                <li>
                  <strong>Juz:</strong> {surahInfo.juzNumbers.length > 1 
                    ? `${surahInfo.juzNumbers.join(', ')}` 
                    : surahInfo.juzNumbers[0]
                  }
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="font-medium mb-1">Brief Overview</p>
            <p className="text-gray-600 text-xs">{surahInfo.description}</p>
          </div>
          
          <div className="text-xs text-gray-500 mt-3">
            <p>This information is provided to give context to the Surah and should not replace scholarly study.</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Get extended information about a surah
 * @param {number} surahNumber - The surah number (1-114)
 * @returns {Object} - Extended metadata for the surah
 */
function getSurahInfo(surahNumber) {
  // This is a simplified set of metadata
  // In a production application, this would be loaded from a more complete database
  const surahInfoMap = {
    1: {
      revelationOrder: 5,
      juzNumbers: [1],
      mainTheme: "The essence of Islam's monotheistic message",
      period: "Early Meccan",
      description: "Al-Fatiha (The Opening) is the first chapter of the Quran and serves as a perfect prayer to Allah, teaching Muslims how to ask for guidance. It is recited in every unit of the five daily prayers."
    },
    2: {
      revelationOrder: 87,
      juzNumbers: [1, 2, 3],
      mainTheme: "Guidance for humanity",
      period: "Early Medinan",
      description: "Al-Baqarah (The Cow) is the longest surah in the Quran and covers various aspects of Islamic law, history, and theology. It discusses the story of creation, the Children of Israel, the change of Qiblah, and many legal rulings."
    },
    112: {
      revelationOrder: 22,
      juzNumbers: [30],
      mainTheme: "The pure Islamic concept of monotheism",
      period: "Early Meccan",
      description: "Al-Ikhlas (Sincerity) concisely describes the nature of Allah and the concept of Tawhid (monotheism). Despite its brevity, it is considered equivalent to one-third of the Quran in meaning and reward due to its importance in establishing the core Islamic belief."
    }
  };
  
  // Default information if specific surah data isn't available
  const defaultInfo = {
    revelationOrder: "N/A",
    juzNumbers: surahNumber <= 10 ? [1] : surahNumber >= 78 ? [30] : [Math.ceil(surahNumber / 4)],
    mainTheme: "Various Islamic teachings",
    period: surahNumber <= 86 ? "Meccan" : "Medinan",
    description: "This surah contains important guidance and teachings from the Quran. For detailed information, please consult scholarly resources."
  };
  
  return surahInfoMap[surahNumber] || defaultInfo;
}

export default SurahMetadata;