import React from 'react';
import { FileDown, Printer } from 'lucide-react';

interface PDFExportButtonProps {
  onExport: () => void;
  loading?: boolean;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ onExport, loading = false }) => {
  return (
    <button
      onClick={onExport}
      disabled={loading}
      className={`
        flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        shadow-lg backdrop-blur-sm border border-white/20
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
      ) : (
        <FileDown className="w-5 h-5" />
      )}
      <span>Export PDF Report</span>
      <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg">
        <Printer className="w-3 h-3" />
        <span className="text-xs">Ctrl+P</span>
      </div>
    </button>
  );
};
</parameter>
