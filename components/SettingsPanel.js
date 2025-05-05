// components/SettingsPanel.js
import { useState, useEffect } from 'react';
import { getQuranicFonts, getQuranicFontsSync } from '../utils/quranUtils';

const SettingsPanel = ({ 
  quranData,
  settings,
  onSettingsChange,
  onSelectionChange
}) => {
  const [surahList, setSurahList] = useState([]);
  const [maxAyahCount, setMaxAyahCount] = useState(7);
  const [availableFonts, setAvailableFonts] = useState(getQuranicFontsSync());
  const [singleAyahMode, setSingleAyahMode] = useState(false);
  
  // Initialize fonts using async function
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = await getQuranicFonts();
        setAvailableFonts(fonts);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Keep the default fonts from getQuranicFontsSync
      }
    };
    
    loadFonts();
  }, []);
  
  // Set up surah list when quran data is loaded
  useEffect(() => {
    if (quranData && Array.isArray(quranData)) {
      setSurahList(quranData);
    }
  }, [quranData]);
  
  // Update max ayah count when surah changes
  useEffect(() => {
    if (quranData && Array.isArray(quranData)) {
      const currentSurah = quranData.find(s => s.id === parseInt(settings.surah));
      if (currentSurah) {
        setMaxAyahCount(currentSurah.total_verses);
        
        // Adjust end ayah if it exceeds the new max
        if (settings.endAyah > currentSurah.total_verses) {
          onSelectionChange({
            surah: settings.surah,
            startAyah: settings.startAyah,
            endAyah: currentSurah.total_verses
          });
        }
        if (settings.startAyah > currentSurah.total_verses) {
          onSelectionChange({
            surah: settings.surah,
            startAyah: currentSurah.total_verses,
            endAyah: settings.endAyah 
          });
        }
      }
    }
  }, [settings.surah, quranData, onSelectionChange, settings.startAyah, settings.endAyah]);
  
  // Handle surah change
  const handleSurahChange = (e) => {
    const newSurah = parseInt(e.target.value);
    onSelectionChange({
      surah: newSurah,
      startAyah: 1,
      endAyah: 1
    });
  };
  
  // Handle ayah range changes
  const handleStartAyahChange = (e) => {
    const newStart = e.target.value === '' ? '' : parseInt(e.target.value);
    
    // Only update endAyah if in single ayah mode and newStart is a valid number
    if (singleAyahMode && !isNaN(newStart) && newStart > 0) {
      onSelectionChange({
        surah: settings.surah,
        startAyah: newStart,
        endAyah: newStart
      });
    } else {
      // Don't update endAyah when clearing the startAyah field
      onSelectionChange({
        surah: settings.surah,
        startAyah: newStart,
        endAyah: settings.endAyah
      });
    }
  };
  
  const handleEndAyahChange = (e) => {
    const newEnd = e.target.value === '' ? '' : parseInt(e.target.value);
    onSelectionChange({
      surah: settings.surah,
      startAyah: settings.startAyah,
      // Only enforce min if both values are valid numbers
      endAyah: newEnd
    });
  };

  const handleSingleAyahModeChange = (e) => {
    const newSingleAyahMode = e.target.checked;
    setSingleAyahMode(newSingleAyahMode);
    
    if (newSingleAyahMode) {
      // If enabling single ayah mode, set endAyah to match startAyah
      onSelectionChange({
        surah: settings.surah,
        startAyah: settings.startAyah,
        endAyah: settings.startAyah
      });
    }
  };
  
  // Handle style settings changes
  const handleSettingChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };

  // Initialize customAyahNumberColor if it doesn't exist in settings
  useEffect(() => {
    if (settings.customAyahNumberColor === undefined) {
      // Initial state is undefined (use text color)
      onSettingsChange({
        ...settings,
        customAyahNumberColor: undefined
      });
    }
  }, []);
  
  return (
    <div className="settings-panel bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
      
      {/* Surah and Ayah Selection */}
      <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium px-2">Quran Selection</legend>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Surah</label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={settings.surah}
            onChange={handleSurahChange}
          >
            {surahList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.transliteration} ({s.name})
              </option>
            ))}
          </select>
        </div>

        {/* Single Ayah Mode Checkbox */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="single-ayah-mode"
            checked={singleAyahMode}
            onChange={handleSingleAyahModeChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="single-ayah-mode" className="ml-2 text-sm font-medium">
            Single Ayah Mode
          </label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {singleAyahMode ? "Ayah" : "Start Ayah"}
            </label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              min="1"
              max={maxAyahCount}
              value={settings.startAyah}
              onChange={handleStartAyahChange}
            />
          </div>
          {!singleAyahMode && (
            <div>
              <label className="block text-sm font-medium mb-1">End Ayah</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min={settings.startAyah}
                max={maxAyahCount}
                value={settings.endAyah}
                onChange={handleEndAyahChange}
              />
            </div>
          )}
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {maxAyahCount} ayahs available in this surah
        </div>
      </fieldset>
      
      {/* Text Styling */}
      <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium px-2">Text Appearance</legend>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Font</label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
          >
            {availableFonts.map((font) => (
              <option key={font.name} value={font.name}>
                {font.style} {font.isSpecialized ? '(Specialized)' : ''}
              </option>
            ))}
          </select>
          
          {/* Show description of selected font */}
          {availableFonts.find(f => f.name === settings.fontFamily)?.style && (
            <div className="mt-1 text-xs text-gray-500">
              {availableFonts.find(f => f.name === settings.fontFamily).style}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Font Size ({settings.fontSize}px)
          </label>
          <input 
            type="range" 
            className="w-full"
            min="16"
            max="72"
            step="1"
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Text Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${settings.textAlign === 'right' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleSettingChange('textAlign', 'right')}
            >
              Right
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${settings.textAlign === 'center' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleSettingChange('textAlign', 'center')}
            >
              Center
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${settings.textAlign === 'left' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleSettingChange('textAlign', 'left')}
            >
              Left
            </button>
          </div>
        </div>
      </fieldset>
      
      {/* Colors and Transparency */}
      <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium px-2">Colors</legend>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <input 
              type="color" 
              className="w-full h-10 border border-gray-300 rounded-md"
              value={settings.textColor}
              onChange={(e) => handleSettingChange('textColor', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <input 
              type="color" 
              className="w-full h-10 border border-gray-300 rounded-md"
              value={settings.backgroundColor}
              onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
            />
          </div>
          </div>
        
        {/* Ayah Number Color */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <label className="text-sm font-medium">Ayah Number Color</label>
            <div className="ml-auto flex items-center">
              <input
                id="custom-ayah-color"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded mr-2"
                checked={settings.customAyahNumberColor !== undefined}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Enable custom color - use a slightly different variation of text color by default
                    const textColorHex = settings.textColor;
                    // Adjust the color slightly to make it distinct but complementary
                    const r = parseInt(textColorHex.substring(1, 3), 16);
                    const g = parseInt(textColorHex.substring(3, 5), 16);
                    const b = parseInt(textColorHex.substring(5, 7), 16);
                    
                    // Create a color that's slightly different (e.g., more subdued)
                    const newR = Math.min(255, Math.max(0, r - 40));
                    const newG = Math.min(255, Math.max(0, g - 40));
                    const newB = Math.min(255, Math.max(0, b - 40));
                    
                    // Convert back to hex
                    const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
                    
                    handleSettingChange('customAyahNumberColor', newColor);
                  } else {
                    // Disable custom color
                    handleSettingChange('customAyahNumberColor', undefined);
                  }
                }}
              />
              <label htmlFor="custom-ayah-color" className="text-sm">
                Use Custom Color
              </label>
            </div>
          </div>
          
          {settings.customAyahNumberColor !== undefined && (
            <div className="flex flex-col space-y-2">
            <input
              type="color"
              className="w-full h-10 border border-gray-300 rounded-md"
              value={settings.customAyahNumberColor}
              onChange={(e) => handleSettingChange('customAyahNumberColor', e.target.value)}
            />
            <div className="flex items-center text-sm">
              <span className="mr-1">Preview:</span>
              <span
                className="inline-block"
                style={{
                  color: settings.customAyahNumberColor,
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                ﴾٢﴿
              </span>
            </div>
          </div>
          )}
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            Background Opacity ({Math.round(settings.backgroundOpacity * 100)}%)
          </label>
          <input 
            type="range" 
            className="w-full"
            min="0"
            max="1"
            step="0.05"
            value={settings.backgroundOpacity}
            onChange={(e) => handleSettingChange('backgroundOpacity', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Set opacity to 0% for a fully transparent background
        </div>
      </fieldset>
      
      {/* Size Settings */}
      <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium px-2">Size</legend>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Width ({settings.width}px)
          </label>
          <input 
            type="range" 
            className="w-full"
            min="400"
            max="1600"
            step="50"
            value={settings.width}
            onChange={(e) => handleSettingChange('width', parseInt(e.target.value))}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default SettingsPanel;