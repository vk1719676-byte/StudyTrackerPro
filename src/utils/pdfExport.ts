import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudySession, Exam } from '../types';
import { format } from 'date-fns';

export interface ExportOptions {
  includeSummary: boolean;
  includeCharts: boolean;
  includeSubjects: boolean;
  includeEfficiency: boolean;
  includePremiumFeatures: boolean;
  layout: 'portrait' | 'landscape';
  colorMode: 'color' | 'grayscale';
  quality: 'standard' | 'high';
}

export interface AnalyticsData {
  sessions: StudySession[];
  exams: Exam[];
  totalStudyTime: number;
  averageSessionTime: number;
  averageEfficiency: number;
  totalSessions: number;
}

export class PDFExportService {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private telegramChannel: string = '@studytrackerpro'; // Replace with your actual channel

  constructor(options: ExportOptions) {
    this.pdf = new jsPDF({
      orientation: options.layout,
      unit: 'mm',
      format: 'a4'
    });
    
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  private addWatermark(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      // Save current state
      this.pdf.saveGraphicsState();
      
      // Set transparency for watermark
      this.pdf.setGState(this.pdf.GState({ opacity: 0.1 }));
      
      // Diagonal watermark in center
      this.pdf.setFontSize(48);
      this.pdf.setTextColor(139, 92, 246);
      this.pdf.setFont('helvetica', 'bold');
      
      const centerX = this.pageWidth / 2;
      const centerY = this.pageHeight / 2;
      
      // Rotate and add main watermark
      this.pdf.text('Study Tracker Pro Analytics', centerX, centerY, {
        angle: -45,
        align: 'center'
      });
      
      // Add telegram channel link watermark (smaller, bottom right)
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(99, 102, 241);
      this.pdf.text(`Join us: ${this.telegramChannel}`, centerX, centerY + 30, {
        angle: -45,
        align: 'center'
      });
      
      // Restore state
      this.pdf.restoreGraphicsState();
      
      // Add corner watermarks with better visibility
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(139, 92, 246, 0.3);
      this.pdf.setFont('helvetica', 'normal');
      
      // Top corners
      this.pdf.text('Study Tracker Pro', 10, 10);
      this.pdf.text(this.telegramChannel, this.pageWidth - 40, 10);
      
      // Bottom corners  
      this.pdf.text('Analytics Report', 10, this.pageHeight - 5);
      this.pdf.text(`Page ${i}`, this.pageWidth - 20, this.pageHeight - 5);
    }
  }

  private addHeader(): void {
    // Enhanced gradient background for header
    const headerHeight = 50;
    
    // Create gradient effect with multiple rectangles
    for (let i = 0; i < headerHeight; i++) {
      const opacity = 1 - (i / headerHeight) * 0.3;
      this.pdf.setFillColor(139, 92, 246, opacity);
      this.pdf.rect(0, i, this.pageWidth, 1, 'F');
    }
    
    // Add decorative border
    this.pdf.setDrawColor(255, 255, 255, 0.3);
    this.pdf.setLineWidth(2);
    this.pdf.line(0, headerHeight - 2, this.pageWidth, headerHeight - 2);
    
    // Enhanced title with shadow effect
    this.pdf.setFontSize(28);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'bold');
    
    // Add shadow
    this.pdf.setTextColor(0, 0, 0, 0.3);
    this.pdf.text('📊 STUDY ANALYTICS REPORT', this.margin + 1, 26);
    
    // Add main title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('📊 STUDY ANALYTICS REPORT', this.margin, 25);
    
    // Add subtitle
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text('Comprehensive Performance Analysis & Insights', this.margin, 35);
    
    // Enhanced date with icon
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(255, 255, 255, 0.8);
    this.pdf.text(`📅 Generated: ${format(new Date(), 'PPP')}`, this.pageWidth - this.margin - 90, 25);
    
    // Add telegram channel link in header
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(255, 255, 255, 0.7);
    this.pdf.text(`💬 ${this.telegramChannel}`, this.pageWidth - this.margin - 90, 35);
    
    this.currentY = 60;
  }

  private addSummarySection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(60);
    
    // Section header
    this.pdf.setFontSize(22);
    this.pdf.setTextColor(139, 92, 246);
    this.pdf.setFont('helvetica', 'bold');
    
    // Add decorative line before title
    this.pdf.setDrawColor(139, 92, 246, 0.3);
    this.pdf.setLineWidth(3);
    this.pdf.line(this.margin, this.currentY - 5, this.margin + 60, this.currentY - 5);
    
    // Add highlighted title with background
    this.pdf.setFillColor(139, 92, 246, 0.1);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 8, 180, 20, 3, 3, 'F');
    
    this.pdf.text('📈 PERFORMANCE SUMMARY', this.margin, this.currentY);
    this.currentY += 20;

    // Create summary cards layout
    const cardWidth = (this.pageWidth - 3 * this.margin) / 2;
    const cardHeight = 25;
    
    const summaryData = [
      { title: 'Total Study Time', value: this.formatTime(data.totalStudyTime), icon: '⏱️' },
      { title: 'Total Sessions', value: data.totalSessions.toString(), icon: '📊' },
      { title: 'Average Session', value: this.formatTime(data.averageSessionTime), icon: '📈' },
      { title: 'Average Efficiency', value: `${data.averageEfficiency.toFixed(1)}/5`, icon: '⭐' }
    ];

    summaryData.forEach((item, index) => {
      const x = this.margin + (index % 2) * (cardWidth + this.margin);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 10);
      
      // Card background
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
      
      // Card border
      this.pdf.setDrawColor(226, 232, 240);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
      
      // Icon and content
      this.pdf.setFontSize(16);
      this.pdf.text(item.icon, x + 5, y + 8);
      
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text(item.title, x + 15, y + 8);
      
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.value, x + 15, y + 18);
      this.pdf.setFont('helvetica', 'normal');
    });

    this.currentY += 70;
  }

  private async addChartSection(elementId: string, title: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    this.addNewPageIfNeeded(80);
    
    // Section header
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(59, 130, 246);
    this.pdf.setFont('helvetica', 'bold');
    
    // Add decorative elements for chart titles
    this.pdf.setFillColor(59, 130, 246, 0.1);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 8, 200, 18, 3, 3, 'F');
    
    this.pdf.setDrawColor(59, 130, 246, 0.3);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin, this.currentY - 10, this.margin + 50, this.currentY - 10);
    
    this.pdf.text(`📊 ${title.toUpperCase()}`, this.margin, this.currentY);
    this.currentY += 18;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page for the image
      this.addNewPageIfNeeded(imgHeight + 10);
      
      this.pdf.addImage(imgData, 'JPEG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 15;
    } catch (error) {
      console.error(`Failed to capture ${title}:`, error);
      
      // Add error placeholder
      this.pdf.setFillColor(254, 242, 242);
      this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 'F');
      
      this.pdf.setTextColor(185, 28, 28);
      this.pdf.setFontSize(12);
      this.pdf.text(`Failed to capture ${title}`, this.margin + 10, this.currentY + 20);
      
      this.currentY += 40;
    }
  }

  private addSubjectBreakdown(data: AnalyticsData): void {
    this.addNewPageIfNeeded(100);
    
    // Section header
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(16, 185, 129);
    this.pdf.setFont('helvetica', 'bold');
    
    // Enhanced subject analysis header
    this.pdf.setFillColor(16, 185, 129, 0.1);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 8, 160, 18, 3, 3, 'F');
    
    this.pdf.setDrawColor(16, 185, 129, 0.3);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin, this.currentY - 10, this.margin + 45, this.currentY - 10);
    
    this.pdf.text('📚 SUBJECT ANALYSIS', this.margin, this.currentY);
    this.currentY += 18;

    // Create subject data
    const subjectMap = new Map();
    data.sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { subject: session.subject, hours: 0, sessions: 0 };
      current.hours += session.duration / 60;
      current.sessions += 1;
      subjectMap.set(session.subject, current);
    });

    const subjectData = Array.from(subjectMap.values())
      .map(item => ({ ...item, hours: Math.round(item.hours * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);

    if (subjectData.length === 0) {
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.setFontSize(12);
      this.pdf.text('No subject data available', this.margin, this.currentY);
      this.currentY += 20;
      return;
    }

    // Table header
    const colWidths = [60, 30, 30, 50];
    const startX = this.margin;
    
    this.pdf.setFillColor(139, 92, 246);
    this.pdf.rect(startX, this.currentY, colWidths.reduce((sum, w) => sum + w, 0), 10, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    
    let currentX = startX + 2;
    ['Subject', 'Hours', 'Sessions', 'Progress'].forEach((header, index) => {
      this.pdf.text(header, currentX, this.currentY + 7);
      currentX += colWidths[index];
    });
    
    this.currentY += 15;

    // Table rows
    const maxHours = Math.max(...subjectData.map(s => s.hours));
    
    subjectData.forEach((subject, index) => {
      this.addNewPageIfNeeded(12);
      
      // Alternate row colors
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(startX, this.currentY - 2, colWidths.reduce((sum, w) => sum + w, 0), 10, 'F');
      }
      
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      
      currentX = startX + 2;
      
      // Subject name
      this.pdf.text(subject.subject.length > 20 ? subject.subject.substring(0, 20) + '...' : subject.subject, currentX, this.currentY + 5);
      currentX += colWidths[0];
      
      // Hours
      this.pdf.text(subject.hours.toString() + 'h', currentX, this.currentY + 5);
      currentX += colWidths[1];
      
      // Sessions
      this.pdf.text(subject.sessions.toString(), currentX, this.currentY + 5);
      currentX += colWidths[2];
      
      // Progress bar
      const barWidth = 40;
      const barHeight = 4;
      const percentage = (subject.hours / maxHours);
      
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.rect(currentX, this.currentY + 2, barWidth, barHeight, 'F');
      
      this.pdf.setFillColor(139, 92, 246);
      this.pdf.rect(currentX, this.currentY + 2, barWidth * percentage, barHeight, 'F');
      
      this.currentY += 12;
    });

    this.currentY += 10;
  }

  private addInsightsSection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(80);
    
    // Section header
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(245, 158, 11);
    this.pdf.setFont('helvetica', 'bold');
    
    // Enhanced insights header
    this.pdf.setFillColor(245, 158, 11, 0.1);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 8, 220, 18, 3, 3, 'F');
    
    this.pdf.setDrawColor(245, 158, 11, 0.3);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin, this.currentY - 10, this.margin + 60, this.currentY - 10);
    
    this.pdf.text('💡 KEY INSIGHTS & RECOMMENDATIONS', this.margin, this.currentY);
    this.currentY += 18;

    const insights = [
      {
        icon: '📈',
        title: 'Study Consistency',
        description: `You've maintained an average of ${(data.sessions.length / 7).toFixed(1)} sessions per week.`,
        recommendation: 'Try to maintain this consistent pace for optimal learning retention.'
      },
      {
        icon: '⭐',
        title: 'Efficiency Trends',
        description: `Your average efficiency rating is ${data.averageEfficiency.toFixed(1)}/5.`,
        recommendation: data.averageEfficiency >= 4 ? 'Excellent work! Keep up the high efficiency.' : 'Consider shorter, more focused study sessions to improve efficiency.'
      },
      {
        icon: '🎯',
        title: 'Session Duration',
        description: `Average session length: ${this.formatTime(data.averageSessionTime)}.`,
        recommendation: data.averageSessionTime > 120 ? 'Consider breaking longer sessions with short breaks.' : 'You might benefit from slightly longer focused sessions.'
      }
    ];

    insights.forEach(insight => {
      this.addNewPageIfNeeded(25);
      
      // Insight box
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 20, 2, 2, 'F');
      
      this.pdf.setDrawColor(229, 231, 235);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 20, 2, 2, 'S');
      
      // Icon
      this.pdf.setFontSize(14);
      this.pdf.text(insight.icon, this.margin + 3, this.currentY + 7);
      
      // Title
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(insight.title, this.margin + 12, this.currentY + 7);
      
      // Description
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(75, 85, 99);
      const maxWidth = this.pageWidth - 2 * this.margin - 15;
      this.pdf.text(insight.description, this.margin + 3, this.currentY + 12, { maxWidth });
      
      // Recommendation
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.text(`💡 ${insight.recommendation}`, this.margin + 3, this.currentY + 17, { maxWidth });
      
      this.currentY += 25;
    });
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;
    
    // Enhanced footer with gradient
    for (let i = 0; i < 10; i++) {
      const opacity = 0.1 + (i / 10) * 0.1;
      this.pdf.setFillColor(139, 92, 246, opacity);
      this.pdf.rect(0, footerY - 5 + i, this.pageWidth, 1, 'F');
    }
    
    // Add decorative line
    this.pdf.setDrawColor(139, 92, 246, 0.3);
    this.pdf.setLineWidth(1);
    this.pdf.line(this.margin, footerY - 3, this.pageWidth - this.margin, footerY - 3);
    
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(139, 92, 246);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('🚀 StudyFlow Analytics - Powered by AI', this.margin, footerY);
    
    // Add telegram channel in footer
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`💬 Join our community: ${this.telegramChannel}`, this.margin, footerY + 5);
    
    this.pdf.text(`📄 Page ${this.pdf.getNumberOfPages()}`, this.pageWidth - this.margin - 25, footerY);
  }

  async generateReport(data: AnalyticsData, options: ExportOptions): Promise<void> {
    try {
      // Add header
      this.addHeader();

      // Add sections based on options
      if (options.includeSummary) {
        this.addSummarySection(data);
      }

      if (options.includeCharts) {
        await this.addChartSection('weekly-chart', 'Weekly Study Hours');
        await this.addChartSection('daily-chart', 'Daily Performance Trend');
      }

      if (options.includeSubjects) {
        this.addSubjectBreakdown(data);
      }

      if (options.includeEfficiency) {
        await this.addChartSection('efficiency-chart', 'Efficiency Distribution');
      }

      // Always add insights
      this.addInsightsSection(data);

      // Add watermarks to all pages
      this.addWatermark();
      
      // Add footer to all pages
      this.addFooter();

      // Convert to grayscale if requested
      if (options.colorMode === 'grayscale') {
        // Note: jsPDF doesn't have built-in grayscale conversion
        // This would require additional processing
      }

      // Generate filename
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      const filename = `study-analytics-report-${timestamp}.pdf`;

      // Save the PDF
      this.pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}
