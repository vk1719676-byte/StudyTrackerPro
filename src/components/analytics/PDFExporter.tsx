import React, { useState } from 'react';
import { Download, FileText, Loader, CheckCircle } from 'lucide-react';
import { StudySession, Exam } from '../../types';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

interface PDFExporterProps {
  sessions: StudySession[];
  exams: Exam[];
  totalStudyTime: number;
  averageSessionTime: number;
  averageEfficiency: number;
  totalSessions: number;
}

declare global {
  interface Window {
    jsPDF: any;
    html2canvas: any;
  }
}

export const PDFExporter: React.FC<PDFExporterProps> = ({
  sessions,
  exams,
  totalStudyTime,
  averageSessionTime,
  averageEfficiency,
  totalSessions
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
      
      weeks.push({
        week: format(weekStart, 'MMM dd'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        sessions: weekSessions.length
      });
    }
    return weeks;
  };

  const getSubjectData = () => {
    const subjectMap = new Map();
    
    sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { subject: session.subject, hours: 0, sessions: 0 };
      current.hours += session.duration / 60;
      current.sessions += 1;
      subjectMap.set(session.subject, current);
    });

    return Array.from(subjectMap.values())
      .map(item => ({
        ...item,
        hours: Math.round(item.hours * 10) / 10
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  const exportToPDF = async () => {
    if (!window.jsPDF) {
      alert('PDF library not loaded. Please refresh the page and try again.');
      return;
    }

    setIsExporting(true);
    setExportComplete(false);

    try {
      const { jsPDF } = window;
      const doc = new jsPDF();
      
      // PDF Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return lines.length * (fontSize * 0.35);
      };

      // Title Page
      doc.setFillColor(139, 92, 246); // Purple background
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont(undefined, 'bold');
      doc.text('Study Analytics Report', pageWidth / 2, 35, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, 50, { align: 'center' });

      yPosition = 80;
      doc.setTextColor(0, 0, 0);

      // Executive Summary Section
      checkPageBreak(40);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, 'F');
      
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Executive Summary', margin + 5, yPosition + 8);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      const summaryText = `This report provides comprehensive insights into your study patterns and performance over the analyzed period. Your total study time of ${formatTime(totalStudyTime)} across ${totalSessions} sessions demonstrates consistent learning engagement.`;
      
      yPosition += 15;
      const summaryHeight = addWrappedText(summaryText, margin + 5, yPosition, pageWidth - 2 * margin - 10, 11);
      yPosition += summaryHeight + 15;

      // Key Metrics Section
      checkPageBreak(80);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Key Performance Metrics', margin, yPosition);
      yPosition += 15;

      // Metrics in a grid
      const metrics = [
        { label: 'Total Study Time', value: formatTime(totalStudyTime), color: [139, 92, 246] },
        { label: 'Total Sessions', value: totalSessions.toString(), color: [59, 130, 246] },
        { label: 'Average Session', value: formatTime(averageSessionTime), color: [16, 185, 129] },
        { label: 'Average Efficiency', value: `${averageEfficiency.toFixed(1)}/5`, color: [245, 158, 11] }
      ];

      const metricWidth = (pageWidth - 2 * margin - 15) / 2;
      const metricHeight = 25;

      metrics.forEach((metric, index) => {
        const x = margin + (index % 2) * (metricWidth + 5);
        const y = yPosition + Math.floor(index / 2) * (metricHeight + 5);
        
        // Metric card background
        doc.setFillColor(250, 251, 252);
        doc.rect(x, y, metricWidth, metricHeight, 'F');
        
        // Colored accent bar
        doc.setFillColor(...metric.color);
        doc.rect(x, y, 3, metricHeight, 'F');
        
        // Metric text
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(metric.label, x + 8, y + 8);
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(metric.value, x + 8, y + 18);
      });

      yPosition += 60;

      // Weekly Progress Section
      checkPageBreak(100);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Weekly Study Progress', margin, yPosition);
      yPosition += 15;

      const weeklyData = getWeeklyData();
      
      // Table headers
      doc.setFillColor(139, 92, 246);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Week', margin + 5, yPosition + 5);
      doc.text('Hours', margin + 50, yPosition + 5);
      doc.text('Sessions', margin + 90, yPosition + 5);
      
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');

      // Table rows
      weeklyData.forEach((week, index) => {
        const rowColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...rowColor);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
        
        doc.text(week.week, margin + 5, yPosition + 5);
        doc.text(week.hours.toString(), margin + 50, yPosition + 5);
        doc.text(week.sessions.toString(), margin + 90, yPosition + 5);
        
        yPosition += 8;
      });

      yPosition += 10;

      // Subject Distribution Section
      checkPageBreak(100);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Study Time by Subject', margin, yPosition);
      yPosition += 15;

      const subjectData = getSubjectData().slice(0, 10); // Top 10 subjects
      
      // Subject headers
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Subject', margin + 5, yPosition + 5);
      doc.text('Hours', margin + 100, yPosition + 5);
      doc.text('Sessions', margin + 140, yPosition + 5);
      
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');

      // Subject rows with progress bars
      const maxHours = Math.max(...subjectData.map(s => s.hours));
      
      subjectData.forEach((subject, index) => {
        checkPageBreak(12);
        
        const rowColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...rowColor);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
        
        // Subject name
        doc.setFontSize(9);
        const truncatedSubject = subject.subject.length > 20 ? subject.subject.substring(0, 20) + '...' : subject.subject;
        doc.text(truncatedSubject, margin + 5, yPosition + 6);
        
        // Hours and sessions
        doc.text(`${subject.hours}h`, margin + 100, yPosition + 6);
        doc.text(subject.sessions.toString(), margin + 140, yPosition + 6);
        
        // Progress bar
        const barWidth = 40;
        const barHeight = 3;
        const barX = margin + 160;
        const barY = yPosition + 4;
        const fillWidth = (subject.hours / maxHours) * barWidth;
        
        // Bar background
        doc.setFillColor(229, 231, 235);
        doc.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Bar fill with color based on index
        const colors = [[139, 92, 246], [59, 130, 246], [16, 185, 129], [245, 158, 11], [239, 68, 68]];
        const color = colors[index % colors.length];
        doc.setFillColor(...color);
        doc.rect(barX, barY, fillWidth, barHeight, 'F');
        
        yPosition += 10;
      });

      yPosition += 15;

      // Recent Sessions Section
      checkPageBreak(60);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Recent Study Sessions', margin, yPosition);
      yPosition += 15;

      const recentSessions = sessions.slice(-10).reverse(); // Last 10 sessions
      
      recentSessions.forEach((session, index) => {
        checkPageBreak(15);
        
        const sessionDate = format(new Date(session.date), 'MMM dd, yyyy');
        const efficiency = '★'.repeat(session.efficiency) + '☆'.repeat(5 - session.efficiency);
        
        doc.setFillColor(250, 251, 252);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(session.subject, margin + 5, yPosition + 4);
        
        doc.setFont(undefined, 'normal');
        doc.text(`${sessionDate} • ${formatTime(session.duration)} • ${efficiency}`, margin + 5, yPosition + 9);
        
        yPosition += 14;
      });

      // Add footer to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`Generated by StudyTracker Analytics - Page ${i} of ${pageCount}`, margin, pageHeight - 10);
        doc.text(format(new Date(), 'yyyy-MM-dd HH:mm'), pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      // Save the PDF
      const fileName = `study-analytics-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={exportToPDF}
        disabled={isExporting || sessions.length === 0}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform ${
          isExporting || sessions.length === 0
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : exportComplete
            ? 'bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-violet-600 hover:to-purple-700'
        }`}
      >
        {isExporting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : exportComplete ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>PDF Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Export PDF Report</span>
          </>
        )}
      </button>

      {sessions.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No data available for export
        </div>
      )}

      <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <FileText className="w-4 h-4" />
        <span>Professional PDF with charts & insights</span>
      </div>
    </div>
  );
};
