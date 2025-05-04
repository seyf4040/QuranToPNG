// components/QuranSpecialFeatures.js
import { useState } from 'react';
import RTLTextContainer from './RTLTextContainer';

/**
 * Component for handling special Quranic text features
 * Manages bismillah display, sajdah marks, and other special notations
 */
const QuranSpecialFeatures = ({
  surah,
  selectedSettings,
  onSettingChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Default special feature settings
  const defaultSettings = {
    showBismillah: true,        // Show bismillah at start of surah
    showSajdahMarks: true,      // Highlight sajdah verses
    showHizbQuarterMarks: true, // Show hizb quarter marks
    showJuzMarks: true,         // Show juz markers
    useUthmaniRules: true,      // Follow Uthmani script rules
    pauseMarksStyle: 'simple',  // Style for pause marks (simple, detailed, none)
    useIndopakNums: false       // Use Indo-Pakistani style numbers
  };
  
  // Combine with selected settings
  const settings = { ...defaultSettings, ...selectedSettings };
  
  // Handle setting changes
  const handleSettingChange = (setting, value) => {
    onSettingChange({
      ...settings,
      [setting]: value
    });
  };
  
  // Get bismillah display rules based on surah number
  const getBismillahRule = (surahNumber) => {
    if (surahNumber === 1) {
      return "Al-Fatihah (Surah 1) doesn't show Bismillah as a separate verse as it's part of the first verse.";
    } else if (surahNumber === 9) {
      return "At-Tawbah (Surah 9) is the only surah that doesn't begin with Bismillah.";
    } else {
      return "This surah begins with Bismillah as is standard for most surahs.";
    }
  };
  
  // Check if surah has sajdah verses
  const hasSajdahVerses = (surahNumber) => {
    // Surahs with sajdah verses and their ayah numbers
    const sajdahSurahs = {
      7: [206],    // Al-A'raf
      13: [15],    // Ar-Ra'd 
      16: [50],    // An-Nahl
      17: [109],   // Al-Isra
      19: [58],    // Maryam
      22: [18, 77],// Al-Hajj (has two sajdahs)
      25: [60],    // Al-Furqan
      27: [26],    // An-Naml
      32: [15],    // As-Sajdah
      38: [24],    // Sad
      41: [38],    // Fussilat
      53: [62],    // An-Najm
      84: [21],    // Al-Inshiqaq
      96: [19]     // Al-Alaq
    };
    
    return sajdahSurahs[surahNumber] || false;
  };
  
  // Bismillah preview with proper styling
  const BismillahPreview = ({ style }) => (
    <RTLTextContainer
      fontFamily={settings.fontFamily || 'KFGQPC Uthmanic Script HAFS'}
      fontSize={24}
      textAlign="center"
      className="my-2 p-3 border border-gray-200 rounded-md"
    >
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </RTLTextContainer>
  );
  
  // Sajdah marker preview
  const SajdahPreview = () => (
    <div className="flex items-center justify-center gap-4 my-2 p-3 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex items-center">
        <span className="text-gray-700 text-sm ml-2">Simple:</span>
        <span className="text-amber-600 text-xl">۩</span>
      </div>
      <div className="flex items-center">
        <span className="text-gray-700 text-sm ml-2">Detailed:</span>
        <span className="text-amber-600 text-sm px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">سجدة</span>
      </div>
    </div>
  );
  
  return (
    <div className="quran-special-features border border-gray-200 rounded-md p-4">
      <h3 className="text-lg font-medium mb-3">Special Quranic Features</h3>
      
      {/* Basic Features */}
      <div className="space-y-4 mb-6">
        {/* Bismillah Setting */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Bismillah Display</label>
            <div className="flex items-center">
              <input
                id="bismillah-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.showBismillah}
                onChange={(e) => handleSettingChange('showBismillah', e.target.checked)}
              />
              <label htmlFor="bismillah-checkbox" className="ml-2 text-sm">
                Show
              </label>
            </div>
          </div>
          
          {surah && (
            <div className="mt-1 text-xs text-gray-600">
              {getBismillahRule(surah.number)}
            </div>
          )}
          
          {settings.showBismillah && (
            <BismillahPreview />
          )}
        </div>
        
        {/* Sajdah Marks Setting */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sajdah Marks</label>
            <div className="flex items-center">
              <input
                id="sajdah-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.showSajdahMarks}
                onChange={(e) => handleSettingChange('showSajdahMarks', e.target.checked)}
              />
              <label htmlFor="sajdah-checkbox" className="ml-2 text-sm">
                Show
              </label>
            </div>
          </div>
          
          {surah && hasSajdahVerses(surah.number) ? (
            <div className="mt-1 text-xs text-gray-600">
              This surah contains sajdah verse(s) at ayah: {hasSajdahVerses(surah.number).join(', ')}
            </div>
          ) : (
            <div className="mt-1 text-xs text-gray-600">
              This surah does not contain any sajdah verses.
            </div>
          )}
          
          {settings.showSajdahMarks && hasSajdahVerses(surah?.number) && (
            <SajdahPreview />
          )}
        </div>
      </div>
      
      {/* Advanced options toggle */}
      <div className="mb-4">
        <button
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <svg 
            className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showAdvanced ? 'Hide Advanced Features' : 'Show Advanced Features'}
        </button>
      </div>
      
      {/* Advanced Features */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          {/* Hizb Quarter Marks */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Hizb Quarter Marks</label>
            <div className="flex items-center">
              <input
                id="hizb-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.showHizbQuarterMarks}
                onChange={(e) => handleSettingChange('showHizbQuarterMarks', e.target.checked)}
              />
              <label htmlFor="hizb-checkbox" className="ml-2 text-sm">
                Show
              </label>
            </div>
          </div>
          
          {/* Juz Marks */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Juz Marks</label>
            <div className="flex items-center">
              <input
                id="juz-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.showJuzMarks}
                onChange={(e) => handleSettingChange('showJuzMarks', e.target.checked)}
              />
              <label htmlFor="juz-checkbox" className="ml-2 text-sm">
                Show
              </label>
            </div>
          </div>
          
          {/* Uthmani Rules */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Uthmani Script Rules</label>
            <div className="flex items-center">
              <input
                id="uthmani-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.useUthmaniRules}
                onChange={(e) => handleSettingChange('useUthmaniRules', e.target.checked)}
              />
              <label htmlFor="uthmani-checkbox" className="ml-2 text-sm">
                Use
              </label>
            </div>
          </div>
          
          {/* Pause Marks Style */}
          <div>
            <label className="block text-sm font-medium mb-1">Pause Marks Style</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-1 px-2 text-xs border rounded-md ${settings.pauseMarksStyle === 'simple' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                onClick={() => handleSettingChange('pauseMarksStyle', 'simple')}
              >
                Simple
              </button>
              <button
                className={`py-1 px-2 text-xs border rounded-md ${settings.pauseMarksStyle === 'detailed' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                onClick={() => handleSettingChange('pauseMarksStyle', 'detailed')}
              >
                Detailed
              </button>
              <button
                className={`py-1 px-2 text-xs border rounded-md ${settings.pauseMarksStyle === 'none' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                onClick={() => handleSettingChange('pauseMarksStyle', 'none')}
              >
                None
              </button>
            </div>
          </div>
          
          {/* Indo-Pakistani Numbers */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Number Style</label>
            <div className="flex items-center">
              <select
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                value={settings.useIndopakNums ? 'indopak' : 'arabic'}
                onChange={(e) => handleSettingChange('useIndopakNums', e.target.value === 'indopak')}
              >
                <option value="arabic">Arabic (١٢٣)</option>
                <option value="indopak">Indo-Pakistani (۱۲۳)</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Explanation */}
      <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
        <p>
          <strong>Note:</strong> These settings control how special Quranic features are displayed. 
          When enabled, sajdah marks will highlight verses that require prostration, while bismillah 
          will be shown at the beginning of surahs according to the standard Uthmani rules.
        </p>
      </div>
    </div>
  );
};

export default QuranSpecialFeatures;