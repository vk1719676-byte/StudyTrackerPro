import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => Promise<void>;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform
        ${disabled || isExporting
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
        }
      `}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <div className="p-1 bg-white/20 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <span>Export PDF Report</span>
          <Download className="w-4 h-4" />
        </>
      )}
    </button>
  );
};
