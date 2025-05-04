// utils/apiUtils.js
/**
 * Utility functions for integrating with external Quran APIs
 * This file handles fetching Quranic text from established APIs
 * as an alternative to using the local JSON data
 */

// Available API endpoints
const API_ENDPOINTS = {
  // AlQuran.cloud API
  ALQURAN_CLOUD: {
    BASE_URL: 'https://api.alquran.cloud/v1',
    EDITIONS: {
      UTHMANI: 'quran-uthmani',  // Uthmani script
      SIMPLE: 'quran-simple',    // Simple text without diacritics
      CLEAN: 'quran-simple-clean' // Clean text (no diacritics or symbols)
    }
  },
  
  // Quran.com API (requires API key)
  QURAN_COM: {
    BASE_URL: 'https://api.quran.com/api/v4',
    RESOURCE_TYPES: {
      CHAPTER: 'chapters',
      VERSES: 'verses',
      RECITATIONS: 'recitations'
    }
  }
};

/**
 * Fetch complete Quran data from AlQuran.cloud API
 * @param {string} edition - The edition/script to fetch (defaults to Uthmani)
 * @returns {Promise<Object>} - Promise resolving to Quran data
 */
export const fetchQuranFromAPI = async (edition = API_ENDPOINTS.ALQURAN_CLOUD.EDITIONS.UTHMANI) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ALQURAN_CLOUD.BASE_URL}/quran/${edition}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid API response format');
    }
    
    // Transform the API response to match our expected format
    return transformAlQuranCloudData(data.data);
  } catch (error) {
    console.error('Error fetching Quran data from API:', error);
    throw error;
  }
};

/**
 * Fetch a specific surah from AlQuran.cloud API
 * @param {number} surahNumber - The surah number (1-114)
 * @param {string} edition - The edition/script to fetch
 * @returns {Promise<Object>} - Promise resolving to surah data
 */
export const fetchSurahFromAPI = async (
  surahNumber, 
  edition = API_ENDPOINTS.ALQURAN_CLOUD.EDITIONS.UTHMANI
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.ALQURAN_CLOUD.BASE_URL}/surah/${surahNumber}/${edition}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid API response format');
    }
    
    // Transform the API response to match our expected format
    return transformAlQuranCloudSurah(data.data);
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber} from API:`, error);
    throw error;
  }
};

/**
 * Fetch specific ayahs from AlQuran.cloud API
 * @param {number} surahNumber - The surah number (1-114)
 * @param {number} startAyah - Starting ayah number
 * @param {number} endAyah - Ending ayah number
 * @param {string} edition - The edition/script to fetch
 * @returns {Promise<Object>} - Promise resolving to ayahs data
 */
export const fetchAyahsFromAPI = async (
  surahNumber,
  startAyah,
  endAyah,
  edition = API_ENDPOINTS.ALQURAN_CLOUD.EDITIONS.UTHMANI
) => {
  try {
    // AlQuran.cloud API allows range queries
    const response = await fetch(
      `${API_ENDPOINTS.ALQURAN_CLOUD.BASE_URL}/surah/${surahNumber}/${startAyah}-${endAyah}/${edition}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid API response format');
    }
    
    return data.data.ayahs.map(ayah => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      sajda: ayah.sajda || false
    }));
  } catch (error) {
    console.error(`Error fetching Ayahs ${startAyah}-${endAyah} from Surah ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Transform AlQuran.cloud API data to match our application format
 * @param {Object} apiData - The raw API response data
 * @returns {Object} - Transformed data in our application format
 */
const transformAlQuranCloudData = (apiData) => {
  // Basic validation
  if (!apiData || !apiData.surahs || !Array.isArray(apiData.surahs)) {
    throw new Error('Invalid API data format');
  }
  
  return {
    surahs: apiData.surahs.map(surah => transformAlQuranCloudSurah(surah))
  };
};

/**
 * Transform a single surah from AlQuran.cloud format to our application format
 * @param {Object} surah - The surah data from API
 * @returns {Object} - Transformed surah in our application format
 */
const transformAlQuranCloudSurah = (surah) => {
  return {
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    revelationType: surah.revelationType,
    ayahs: surah.ayahs.map(ayah => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      sajda: ayah.sajda || false
    }))
  };
};

/**
 * Load Quran data with fallback mechanism
 * First tries to fetch from API, falls back to local JSON if API fails
 * @returns {Promise<Object>} - Promise resolving to Quran data
 */
export const loadQuranDataWithFallback = async () => {
  try {
    // First try to fetch from API
    return await fetchQuranFromAPI();
  } catch (apiError) {
    console.warn('API fetch failed, falling back to local data:', apiError);
    
    try {
      // Fall back to local JSON
      const localData = (await import('../data/quran.json')).default;
      return localData;
    } catch (localError) {
      console.error('Local data fallback also failed:', localError);
      throw new Error('Could not load Quran data from any source');
    }
  }
};

export default {
  fetchQuranFromAPI,
  fetchSurahFromAPI,
  fetchAyahsFromAPI,
  loadQuranDataWithFallback,
  API_ENDPOINTS
};
