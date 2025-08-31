import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { exportToPDF, showExportSuccess } from '../../utils/pdfExport';

interface ExportButtonProps {
  targetElementId: string;
  filename?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  targetElementId,
  filename = 'StudyPro-Analytics-Report',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await exportToPDF(targetElementId, {
        filename,
        quality: 0.95,
        format: 'a4',
        orientation: 'portrait'
      });
      
      showExportSuccess();
    } catch (error) {
      console.error('Export failed:', error);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
      `;
      
      errorNotification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          ">✕</div>
          Export failed. Please try again.
        </div>
      `;
      
      document.body.appendChild(errorNotification);
      setTimeout(() => document.body.removeChild(errorNotification), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        group relative inline-flex items-center gap-3 px-6 py-3 
        bg-gradient-to-r from-violet-600 to-purple-600 
        hover:from-violet-700 hover:to-purple-700
        text-white font-semibold rounded-2xl
        shadow-lg hover:shadow-xl
        transform transition-all duration-300
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        border border-violet-500/20
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {isExporting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <div className="p-1 bg-white/20 rounded-lg">
              <Download className="w-4 h-4" />
            </div>
            <span>Export as PDF</span>
            <FileText className="w-4 h-4 opacity-70" />
          </>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
    </button>
  );
};
