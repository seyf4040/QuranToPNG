// components/FontSelector.js
import { useState, useEffect } from 'react';
import { getQuranicFonts } from '../utils/quranUtils';

/**
 * Component for selecting and previewing specialized Quranic fonts
 * Provides visual samples of each font and information about their appropriate use
 */
const FontSelector = ({ 
  selectedFont, 
  onFontChange,
  sampleText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
}) => {
  const [fonts, setFonts] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(null);
  
  // Load available Quranic fonts
  useEffect(() => {
    setFonts(getQuranicFonts());
    
    // Set a timeout to assume fonts are loaded after a reasonable time
    const timeout = setTimeout(() => {
      setFontsLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Toggle expanded information for a font
  const toggleFontInfo = (fontName) => {
    if (expandedInfo === fontName) {
      setExpandedInfo(null);
    } else {
      setExpandedInfo(fontName);
    }
  };
  
  // Get detailed information for each font
  const getFontDetails = (fontName) => {
    switch (fontName) {
      case 'KFGQPC Uthmanic Script HAFS':
        return {
          description: 'This is the standard Uthmani script used in many modern Quran prints from Saudi Arabia and the Muslim world.',
          features: ['Traditional Uthmani script', 'Full diacritical marks', 'Standard for many Quran publications'],
          recommended: true,
          origin: 'King Fahd Glorious Quran Printing Complex'
        };
        
      case 'Amiri Quran':
        return {
          description: 'A classical Naskh style font optimized for Quranic text with careful attention to details of Quranic typography.',
          features: ['Naskh style', 'Elegant design', 'Good readability', 'Wide compatibility'],
          recommended: true,
          origin: 'Developed by Khaled Hosny'
        };
        
      case 'Scheherazade New':
        return {
          description: 'A modern Arabic font with good readability and compatibility. While not specifically designed for Quranic text, it handles it well.',
          features: ['Modern design', 'Excellent compatibility', 'Clear at smaller sizes'],
          recommended: false,
          origin: 'SIL International'
        };
        
      case 'Noto Naskh Arabic':
        return {
          description: 'Part of Google\'s Noto font family, designed for broad language support. Good compatibility across platforms.',
          features: ['Wide platform support', 'Clear at smaller sizes', 'Good for mixed content'],
          recommended: false,
          origin: 'Google'
        };
        
      case 'Me Quran':
        return {
          description: 'A specialized font developed specifically for Quran display with tajweed marks and proper spacing.',
          features: ['Tajweed mark support', 'Specialized Quranic spacing', 'Traditional appearance'],
          recommended: true,
          origin: 'Developed for Quran publishing'
        };
        
      default:
        return {
          description: 'A standard Arabic font.',
          features: [],
          recommended: false,
          origin: 'Unknown'
        };
    }
  };
  
  return (
    <div className="font-selector">
      <label className="block text-sm font-medium mb-2">Quranic Font</label>
      
      {/* Font Selection Dropdown */}
      <select 
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        value={selectedFont}
        onChange={(e) => onFontChange(e.target.value)}
      >
        {fonts.map(font => (
          <option key={font.name} value={font.name}>
            {font.name} {font.isSpecialized ? '(Specialized)' : ''}
          </option>
        ))}
      </select>
      
      {/* Font Preview Section */}
      <div className="font-preview-wrapper border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-medium">Font Preview</h3>
          
          {!fontsLoaded && (
            <span className="text-xs text-gray-500">Loading fonts...</span>
          )}
        </div>
        
        <div className="p-4 bg-white">
          {/* Current Font Preview */}
          <div 
            className={`text-center p-3 mb-4 rounded-md border ${fontsLoaded ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            style={{ 
              fontFamily: selectedFont, 
              fontSize: '24px',
              direction: 'rtl',
              opacity: fontsLoaded ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
          >
            {sampleText}
          </div>
          
          {/* Font Information */}
          {selectedFont && (
            <div className="font-info text-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{selectedFont}</h4>
                
                <button 
                  className="text-blue-600 text-xs flex items-center"
                  onClick={() => toggleFontInfo(selectedFont)}
                >
                  {expandedInfo === selectedFont ? 'Less Info' : 'More Info'}
                  <svg 
                    className={`w-3 h-3 ml-1 transition-transform ${expandedInfo === selectedFont ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Font description */}
              <p className="text-gray-600 mt-1 text-xs">
                {fonts.find(f => f.name === selectedFont)?.style || 'Standard Arabic font'}
              </p>
              
              {/* Expanded information */}
              {expandedInfo === selectedFont && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs space-y-2 border border-gray-200">
                  <p>{getFontDetails(selectedFont).description}</p>
                  
                  {getFontDetails(selectedFont).features.length > 0 && (
                    <div>
                      <strong className="block mb-1">Features:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        {getFontDetails(selectedFont).features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p>
                    <strong>Origin:</strong> {getFontDetails(selectedFont).origin}
                  </p>
                  
                  {getFontDetails(selectedFont).recommended && (
                    <p className="text-green-700 font-medium">
                      ✓ Recommended for Quranic text display
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Font Comparison */}
      <div className="mt-4">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => document.getElementById('font-comparison-modal').classList.toggle('hidden')}
        >
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare All Fonts
        </button>
      </div>
      
      {/* Font Comparison Modal */}
      <div 
        id="font-comparison-modal"
        className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target.id === 'font-comparison-modal') {
            document.getElementById('font-comparison-modal').classList.add('hidden');
          }
        }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">Font Comparison</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('font-comparison-modal').classList.add('hidden')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 border text-left">Font Name</th>
                  <th className="p-2 border text-center">Sample</th>
                  <th className="p-2 border text-center">Type</th>
                </tr>
              </thead>
              <tbody>
                {fonts.map((font, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      <div className="font-medium">{font.name}</div>
                      <div className="text-xs text-gray-500">{font.style}</div>
                    </td>
                    <td className="p-2 border">
                      <div 
                        style={{ 
                          fontFamily: font.name, 
                          fontSize: '20px',
                          direction: 'rtl'
                        }}
                      >
                        {sampleText}
                      </div>
                    </td>
                    <td className="p-2 border text-center">
                      {font.isSpecialized ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Specialized
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          Standard
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 text-xs text-gray-600">
              <p>
                <strong>Note:</strong> Specialized Quranic fonts are designed specifically for 
                Quranic text with proper diacritical marks and traditional styling. They are recommended
                for proper Quranic display.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;