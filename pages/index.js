// pages/index.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { fetchQuranData, getSurah, getAyahsFromSurah } from '../utils/quranUtils';

// Import components
import FontLoader from '../components/FontLoader';
import SettingsPanel from '../components/SettingsPanel';
import QuranTextDisplay from '../components/QuranTextDisplay';
import ExportOptions from '../components/ExportOptions';

export default function QuranDisplayGenerator() {
  // State for quran data
  const [quranData, setQuranData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected content
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahText, setAyahText] = useState('');
  
  // State for user settings
  const [settings, setSettings] = useState({
    // Selection settings
    surah: 1,
    startAyah: 1,
    endAyah: 1,
    
    // Display settings
    fontFamily: 'Uthmanic_Hafs_1',
    fontSize: 32,
    textColor: '#000000',
    backgroundColor: '#ffffff',
    backgroundOpacity: 0,
    width: 800,
    textAlign: 'center',
    customAyahNumberColor: undefined, // Custom color for ayah numbers
  });
  
  const previewRef = useRef(null);
  
  // Load quran data on component mount
  useEffect(() => {
    const loadQuranData = async () => {
      try {
        setLoading(true);
        const data = await fetchQuranData();
        setQuranData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading Quran data:', err);
        setError('Failed to load Quran data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuranData();
  }, []);
  
  // Update selected surah when surah number changes
  useEffect(() => {
    if (quranData) {
      const surah = getSurah(quranData, settings.surah);
      setSelectedSurah(surah);
    }
  }, [settings.surah, quranData]);
  
  // Update ayah text when selection changes
  useEffect(() => {
    if (selectedSurah) {
      const text = getAyahsFromSurah(
        selectedSurah, 
        settings.startAyah, 
        settings.endAyah
      );
      setAyahText(text);
    }
  }, [selectedSurah, settings.startAyah, settings.endAyah]);
  
  // Handle selection changes (surah, ayah range)
  const handleSelectionChange = (selection) => {
    setSettings(prev => ({
      ...prev,
      surah: selection.surah,
      startAyah: selection.startAyah,
      endAyah: selection.endAyah
    }));
  };
  
  // Handle display settings changes
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Quran Ayah Display Generator</title>
        <meta name="description" content="Generate beautiful Quranic verses for display" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Load Quranic fonts */}
      <FontLoader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Quran Ayah Display Generator</h1>
        <p className="text-center mb-8 text-gray-600">
          Select, customize, and export Quranic verses with ease
        </p>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {!loading && !error && quranData && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls Panel */}
            <div className="md:col-span-4">
              <SettingsPanel 
                quranData={quranData}
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onSelectionChange={handleSelectionChange}
              />
              
              <div className="mt-6">
                <ExportOptions 
                  elementRef={previewRef}
                  surah={selectedSurah}
                  startAyah={settings.startAyah}
                  endAyah={settings.endAyah}
                  width={settings.width}
                  backgroundOpacity={settings.backgroundOpacity}
                />
              </div>
            </div>
            
            {/* Preview Panel */}
            <div className="md:col-span-8">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              
              <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
                <div ref={previewRef} className="overflow-hidden">
                  <QuranTextDisplay 
                    ayahText={ayahText}
                    fontFamily={settings.fontFamily}
                    fontSize={settings.fontSize}
                    textColor={settings.textColor}
                    backgroundColor={settings.backgroundColor}
                    backgroundOpacity={settings.backgroundOpacity}
                    textAlign={settings.textAlign}
                    width={settings.width}
                    customAyahNumberColor={settings.customAyahNumberColor}
                    surahNumber={selectedSurah ? selectedSurah.id : null}
                    startAyah={settings.startAyah}
                  />
                </div>
              </div>
              
              {/* Show source information */}
              {selectedSurah && (
                <div className="mt-4 text-sm text-gray-600">
                  Displaying: Surah {selectedSurah.transliteration} ({selectedSurah.name}), 
                  Ayah {settings.startAyah}{settings.startAyah !== settings.endAyah ? ` to ${settings.endAyah}` : ''}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer with attribution and info */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p className="mb-2">
            Handle Quranic text with proper respect and adab.
          </p>
          <p>
            Built with Next.js, React, and Tailwind CSS.
          </p>
        </footer>
      </main>
    </div>
  );
}