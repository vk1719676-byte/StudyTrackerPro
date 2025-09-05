import React, { useState } from 'react';
import { X, Download, FileText, Settings, Loader2, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { ExportOptions, PDFExportService, AnalyticsData } from '../utils/pdfExport';

interface PDFExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData: AnalyticsData;
}

export const PDFExportDialog: React.FC<PDFExportDialogProps> = ({
  isOpen,
  onClose,
  analyticsData
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    includeSummary: true,
    includeCharts: true,
    includeSubjects: true,
    includeEfficiency: true,
    includePremiumFeatures: false,
    layout: 'portrait',
    colorMode: 'color',
    quality: 'high'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      const pdfService = new PDFExportService(options);
      await pdfService.generateReport(analyticsData, options);
      setExportStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setExportStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Export Analytics Report
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate a comprehensive PDF report of your study analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {/* What to Include */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Content to Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'includeSummary', label: 'Performance Summary', description: 'Overview stats and key metrics' },
                { key: 'includeCharts', label: 'Charts & Graphs', description: 'Visual data representations' },
                { key: 'includeSubjects', label: 'Subject Breakdown', description: 'Detailed subject analysis' },
                { key: 'includeEfficiency', label: 'Efficiency Analysis', description: 'Performance ratings and trends' }
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={options[item.key as keyof ExportOptions] as boolean}
                    onChange={(e) => updateOption(item.key as keyof ExportOptions, e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Export Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Layout
                </label>
                <select
                  value={options.layout}
                  onChange={(e) => updateOption('layout', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Color Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Mode
                </label>
                <select
                  value={options.colorMode}
                  onChange={(e) => updateOption('colorMode', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="color">Full Color</option>
                  <option value="grayscale">Grayscale</option>
                </select>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Export Quality
                </label>
                <select
                  value={options.quality}
                  onChange={(e) => updateOption('quality', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High Quality</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Report Preview
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Your PDF will include {Object.values(options).filter(v => v === true).length} sections
                  in {options.layout} layout with {options.quality} quality.
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Estimated pages: {options.includeSummary && options.includeCharts ? '4-6' : '2-4'} • 
                  File size: ~{options.quality === 'high' ? '2-4' : '1-2'}MB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-3 ${
              isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : exportStatus === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : exportStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : exportStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Export Complete!
              </>
            ) : exportStatus === 'error' ? (
              <>
                <X className="w-5 h-5" />
                Export Failed
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate PDF Report
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
};
