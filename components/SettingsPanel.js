// components/SettingsPanel.js
import { useState, useEffect } from 'react';
import { getQuranicFonts } from '../utils/quranUtils';

const SettingsPanel = ({ 
  quranData,
  settings,
  onSettingsChange,
  onSelectionChange
}) => {
  const [surahList, setSurahList] = useState([]);
  const [maxAyahCount, setMaxAyahCount] = useState(7);
  const [availableFonts, setAvailableFonts] = useState([]);
  
  // Initialize fonts
  useEffect(() => {
    setAvailableFonts(getQuranicFonts());
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
    const newStart = parseInt(e.target.value);
    onSelectionChange({
      surah: settings.surah,
      startAyah: newStart,
      endAyah: Math.max(newStart, settings.endAyah)
    });
  };
  
  const handleEndAyahChange = (e) => {
    const newEnd = parseInt(e.target.value);
    onSelectionChange({
      surah: settings.surah,
      startAyah: settings.startAyah,
      endAyah: Math.max(settings.startAyah, newEnd)
    });
  };
  
  // Handle style settings changes
  const handleSettingChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Ayah</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              min="1"
              max={maxAyahCount}
              value={settings.startAyah}
              onChange={handleStartAyahChange}
            />
          </div>
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
                {font.name} {font.isSpecialized ? '(Specialized)' : ''}
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
              className={`px-4 py-2 border rounded-md ${settings.textAlign === 'right' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleSettingChange('textAlign', 'right')}
            >
              Right
            </button>
            <button
              className={`px-4 py-2 border rounded-md ${settings.textAlign === 'center' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleSettingChange('textAlign', 'center')}
            >
              Center
            </button>
            <button
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