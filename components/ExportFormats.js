// components/ExportFormats.js
import { useState } from 'react';
import { exportFunctions, getExportFilename } from '../utils/quranUtils';

/**
 * Component for handling different export formats and additional export options
 * Provides more advanced configuration for exports than the basic ExportOptions component
 */
const ExportFormats = ({ 
  elementRef, 
  surah, 
  startAyah, 
  endAyah, 
  currentSettings 
}) => {
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportStatus, setExportStatus] = useState(null);
  const [advancedOptions, setAdvancedOptions] = useState({
    scale: 2, // Higher scale for better quality
    margin: 20, // Margin around content in pixels
    includeMetadata: true, // Include surah and ayah info
    includeBasmalah: true, // Include bismillah when appropriate
    filename: '', // Custom filename (empty = auto-generated)
    transparentBackground: currentSettings?.backgroundOpacity === 0
  });
  
  // Toggle advanced options panel
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Handle export with advanced options
  const handleExport = async () => {
    if (!elementRef.current || !surah) return;
    
    setLoading(true);
    setExportStatus({ type: 'info', message: `Preparing ${exportFormat.toUpperCase()} export...` });
    
    try {
      // Apply advanced options
      const options = {
        width: currentSettings.width,
        backgroundOpacity: advancedOptions.transparentBackground ? 0 : currentSettings.backgroundOpacity,
        scale: advancedOptions.scale,
        padding: advancedOptions.margin,
        metadata: advancedOptions.includeMetadata
      };
      
      // Get filename (custom or auto-generated)
      const filename = advancedOptions.filename || getExportFilename(surah, startAyah, endAyah);
      
      // Export based on selected format
      let result;
      switch (exportFormat) {
        case 'png':
          result = await exportFunctions.toPNG(elementRef, options);
          if (result) {
            downloadFile(result, `${filename}.png`);
            setExportStatus({ type: 'success', message: 'PNG file exported successfully!' });
          }
          break;
          
        case 'svg':
          result = await exportFunctions.toSVG(elementRef, options);
          if (result) {
            downloadFile(result, `${filename}.svg`);
            setExportStatus({ type: 'success', message: 'SVG file exported successfully!' });
          }
          break;
          
        case 'pdf':
          result = await exportFunctions.toPDF(elementRef, options);
          if (result) {
            result.save(`${filename}.pdf`);
            setExportStatus({ type: 'success', message: 'PDF file exported successfully!' });
          }
          break;
          
        case 'html':
          // Create basic HTML with embedded styling
          const htmlContent = createExportableHTML(elementRef, currentSettings, advancedOptions);
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlUrl = URL.createObjectURL(htmlBlob);
          downloadFile(htmlUrl, `${filename}.html`);
          setExportStatus({ type: 'success', message: 'HTML file exported successfully!' });
          break;
          
        default:
          setExportStatus({ type: 'error', message: 'Unknown export format' });
      }
    } catch (error) {
      console.error(`Error exporting ${exportFormat}:`, error);
      setExportStatus({ 
        type: 'error', 
        message: `Error exporting ${exportFormat}: ${error.message || 'Please try again.'}`
      });
    } finally {
      setLoading(false);
      
      // Clear status after a delay
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
    }
  };
  
  // Helper function to create exportable HTML
  const createExportableHTML = (elementRef, settings, options) => {
    const { fontFamily, fontSize, textColor, backgroundColor, backgroundOpacity, textAlign } = settings;
    
    // Clone the content
    const content = elementRef.current.innerHTML;
    
    // Create standalone HTML document
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quran - ${surah.englishName} (${startAyah}${startAyah !== endAyah ? `-${endAyah}` : ''})</title>
  
  <!-- Load Quranic fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Amiri&family=Scheherazade+New&family=Noto+Naskh+Arabic&display=swap" rel="stylesheet">
  
  <style>
    @font-face {
      font-family: 'KFGQPC Uthmanic Script HAFS';
      src: url('https://cdn.jsdelivr.net/gh/mustafa0x/qpc-fonts/KFGQPC_Uthmanic_Script_HAFS_Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    
    body {
      margin: 0;
      padding: ${options.margin}px;
      direction: rtl;
      background-color: ${options.transparentBackground ? 'transparent' : backgroundColor};
    }
    
    .quran-content {
      font-family: '${fontFamily}', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif;
      font-size: ${fontSize}px;
      color: ${textColor};
      text-align: ${textAlign};
      line-height: 1.8;
      padding: ${options.margin}px;
      width: ${settings.width - (options.margin * 2)}px;
      max-width: 100%;
      margin: 0 auto;
    }
    
    .metadata {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 20px;
      color: ${textColor};
      opacity: 0.7;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="quran-content">
    ${content}
  </div>
  
  ${options.includeMetadata ? `
  <div class="metadata">
    Surah ${surah.englishName} (${surah.name}) - Ayah ${startAyah}${startAyah !== endAyah ? ` to ${endAyah}` : ''}
  </div>
  ` : ''}
</body>
</html>`;
  };
  
  // Helper function to trigger download
  const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };
  
  return (
    <div className="export-formats border border-gray-200 rounded-md p-4">
      <h3 className="text-lg font-medium mb-3">Export Formats</h3>
      
      {/* Format selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Format</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            className={`py-2 px-3 border rounded-md ${exportFormat === 'png' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => setExportFormat('png')}
          >
            PNG
          </button>
          <button
            className={`py-2 px-3 border rounded-md ${exportFormat === 'svg' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => setExportFormat('svg')}
          >
            SVG
          </button>
          <button
            className={`py-2 px-3 border rounded-md ${exportFormat === 'pdf' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => setExportFormat('pdf')}
          >
            PDF
          </button>
          <button
            className={`py-2 px-3 border rounded-md ${exportFormat === 'html' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => setExportFormat('html')}
          >
            HTML
          </button>
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
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
      </div>
      
      {/* Advanced options panel */}
      {showAdvanced && (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-1 gap-4">
            {/* Scale factor option */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Quality Scale ({advancedOptions.scale}x)
              </label>
              <input 
                type="range" 
                className="w-full"
                min="1"
                max="4"
                step="0.5"
                value={advancedOptions.scale}
                onChange={(e) => setAdvancedOptions({
                  ...advancedOptions, 
                  scale: parseFloat(e.target.value)
                })}
              />
              <div className="mt-1 text-xs text-gray-500">
                Higher values produce better quality but larger files
              </div>
            </div>
            
            {/* Margin setting */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Margin ({advancedOptions.margin}px)
              </label>
              <input 
                type="range" 
                className="w-full"
                min="0"
                max="100"
                step="5"
                value={advancedOptions.margin}
                onChange={(e) => setAdvancedOptions({
                  ...advancedOptions, 
                  margin: parseInt(e.target.value)
                })}
              />
            </div>
            
            {/* Custom filename */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Custom Filename (optional)
              </label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Leave empty for automatic name"
                value={advancedOptions.filename}
                onChange={(e) => setAdvancedOptions({
                  ...advancedOptions, 
                  filename: e.target.value
                })}
              />
            </div>
            
            {/* Checkbox options */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="metadata-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={advancedOptions.includeMetadata}
                  onChange={(e) => setAdvancedOptions({
                    ...advancedOptions, 
                    includeMetadata: e.target.checked
                  })}
                />
                <label htmlFor="metadata-checkbox" className="ml-2 text-sm">
                  Include surah and ayah information
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="basmalah-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={advancedOptions.includeBasmalah}
                  onChange={(e) => setAdvancedOptions({
                    ...advancedOptions, 
                    includeBasmalah: e.target.checked
                  })}
                />
                <label htmlFor="basmalah-checkbox" className="ml-2 text-sm">
                  Include Bismillah when appropriate
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="transparent-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded"
                  checked={advancedOptions.transparentBackground}
                  onChange={(e) => setAdvancedOptions({
                    ...advancedOptions, 
                    transparentBackground: e.target.checked
                  })}
                />
                <label htmlFor="transparent-checkbox" className="ml-2 text-sm">
                  Force transparent background
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Export button */}
      <button 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
        onClick={handleExport}
        disabled={loading || !surah}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Export as ${exportFormat.toUpperCase()}`
        )}
      </button>
      
      {/* Status message */}
      {exportStatus && (
        <div className={`mt-4 p-2 rounded-md ${
          exportStatus.type === 'success' ? 'bg-green-100 text-green-800' : 
          exportStatus.type === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {exportStatus.message}
        </div>
      )}
      
      {/* Format-specific information */}
      <div className="mt-4 text-xs text-gray-600">
        {exportFormat === 'png' && (
          <p>PNG format provides the best quality for sharing on social media and supports transparency.</p>
        )}
        {exportFormat === 'svg' && (
          <p>SVG format is ideal for scaling to any size without quality loss and fully supports transparency.</p>
        )}
        {exportFormat === 'pdf' && (
          <p>PDF format is best for printing and formal documents. Note that transparency may be limited.</p>
        )}
        {exportFormat === 'html' && (
          <p>HTML format allows for embedding in websites and further customization.</p>
        )}
      </div>
    </div>
  );
};

export default ExportFormats;