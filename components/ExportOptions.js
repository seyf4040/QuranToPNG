// components/ExportOptions.js
import { useState } from 'react';
import { exportFunctions, getExportFilename } from '../utils/quranUtils';

const ExportOptions = ({ elementRef, surah, startAyah, endAyah, width, backgroundOpacity }) => {
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  
  // Handle export for different formats
  const handleExport = async (format) => {
    if (!elementRef.current || !surah) return;
    
    setLoading(true);
    setExportFormat(format);
    setExportStatus({ type: 'info', message: `Preparing ${format.toUpperCase()} export...` });
    
    try {
      let result;
      const options = { width, backgroundOpacity };
      const filename = getExportFilename(surah, startAyah, endAyah);
      
      switch (format) {
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
          
        default:
          setExportStatus({ type: 'error', message: 'Unknown export format' });
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      setExportStatus({ type: 'error', message: `Error exporting ${format}. Please try again.` });
    } finally {
      setLoading(false);
      setExportFormat(null);
      
      // Clear status after a delay
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
    }
  };
  
  // Helper function to trigger download
  const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };
  
  return (
    <div className="export-options bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">Export Options</h3>
      
      <div className="flex flex-col space-y-2">
        <button 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
          onClick={() => handleExport('png')}
          disabled={loading || !surah}
        >
          {loading && exportFormat === 'png' ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Export as PNG
        </button>
        
        <button 
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center"
          onClick={() => handleExport('svg')}
          disabled={loading || !surah}
        >
          {loading && exportFormat === 'svg' ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Export as SVG
        </button>
        
        <button 
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center"
          onClick={() => handleExport('pdf')}
          disabled={loading || !surah}
        >
          {loading && exportFormat === 'pdf' ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Export as PDF
        </button>
      </div>
      
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
      
      {/* Additional information */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Note:</strong> For best results with transparent backgrounds, use PNG or SVG format.
          PDF export will have a white background when transparency is enabled.
        </p>
      </div>
    </div>
  );
};

export default ExportOptions;