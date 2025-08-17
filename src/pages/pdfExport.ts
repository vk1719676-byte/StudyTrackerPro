import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportData {
  totalStudyTime: number;
  totalSessions: number;
  averageSessionTime: number;
  averageEfficiency: number;
  weeklyData: Array<{ week: string; hours: number; sessions: number }>;
  dailyData: Array<{ day: string; hours: number; efficiency: number }>;
  subjectData: Array<{ subject: string; hours: number; sessions: number }>;
  efficiencyData: Array<{ rating: string; count: number }>;
  isPremium: boolean;
  userName?: string;
}

export const generateAnalyticsPDF = async (data: PDFExportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Helper function to format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(79, 70, 229); // Purple color
  pdf.text('Study Analytics Report', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(107, 114, 128); // Gray color
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(`Generated on ${reportDate}`, margin, yPosition);
  if (data.userName) {
    pdf.text(`Student: ${data.userName}`, margin, yPosition + 5);
    yPosition += 5;
  }
  yPosition += 15;

  // Executive Summary
  checkPageBreak(30);
  pdf.setFontSize(18);
  pdf.setTextColor(31, 41, 55); // Dark gray
  pdf.text('Executive Summary', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setTextColor(75, 85, 99);
  const summaryText = [
    `Total Study Time: ${formatTime(data.totalStudyTime)}`,
    `Number of Sessions: ${data.totalSessions}`,
    `Average Session Duration: ${formatTime(data.averageSessionTime)}`,
    `Average Efficiency Rating: ${data.averageEfficiency.toFixed(1)}/5.0`,
    `Most Studied Subject: ${data.subjectData[0]?.subject || 'N/A'}`,
    `Total Subjects: ${data.subjectData.length}`
  ];

  summaryText.forEach(text => {
    pdf.text(text, margin, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Weekly Performance Analysis
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Weekly Performance Analysis', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(75, 85, 99);
  
  // Weekly data table
  const tableStartY = yPosition;
  pdf.text('Week', margin, yPosition);
  pdf.text('Study Hours', margin + 40, yPosition);
  pdf.text('Sessions', margin + 80, yPosition);
  pdf.text('Avg per Session', margin + 120, yPosition);
  yPosition += 8;

  // Draw table line
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 2;

  data.weeklyData.forEach(week => {
    checkPageBreak(8);
    pdf.text(week.week, margin, yPosition);
    pdf.text(week.hours.toString() + 'h', margin + 40, yPosition);
    pdf.text(week.sessions.toString(), margin + 80, yPosition);
    const avgPerSession = week.sessions > 0 ? (week.hours / we
