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
  private telegramChannel: string = '@studytrackerpro';
  private headerHeight: number = 50;
  private footerHeight: number = 20;
  private contentHeight: number;

  constructor(options: ExportOptions) {
    this.pdf = new jsPDF({
      orientation: options.layout,
      unit: 'mm',
      format: 'a4'
    });
    
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.contentHeight = this.pageHeight - this.headerHeight - this.footerHeight - (2 * this.margin);
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    const maxContentY = this.pageHeight - this.footerHeight - this.margin;
    
    if (this.currentY + requiredSpace > maxContentY) {
      this.finalizePage();
      this.pdf.addPage();
      this.addHeader();
      this.currentY = this.headerHeight + this.margin;
    }
  }

  private finalizePage(): void {
    this.addWatermarkToCurrentPage();
    this.addFooterToCurrentPage();
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  private addWatermarkToCurrentPage(): void {
    // Save current graphics state
    const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
    
    // Create subtle diagonal watermark
    this.pdf.saveGraphicsState();
    
    try {
      // Set very low opacity for watermark
      this.pdf.setGState(this.pdf.GState({ opacity: 0.03 }));
      
      // Main diagonal watermark
      this.pdf.setFontSize(40);
      this.pdf.setTextColor(139, 92, 246);
      this.pdf.setFont('helvetica', 'bold');
      
      const centerX = this.pageWidth / 2;
      const centerY = this.pageHeight / 2;
      
      // Add rotated text watermark
      this.pdf.text('STUDY TRACKER PRO', centerX, centerY, {
        angle: -30,
        align: 'center'
      });
      
      // Add smaller secondary watermark
      this.pdf.setFontSize(12);
      this.pdf.setGState(this.pdf.GState({ opacity: 0.05 }));
      this.pdf.text(this.telegramChannel, centerX, centerY + 20, {
        angle: -30,
        align: 'center'
      });
      
    } catch (error) {
      console.warn('Watermark rendering failed:', error);
    } finally {
      // Always restore graphics state
      this.pdf.restoreGraphicsState();
    }
    
    // Add subtle corner marks with higher opacity
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(139, 92, 246, 0.2);
    this.pdf.setFont('helvetica', 'normal');
    
    // Corner watermarks - ensure they don't overlap with content
    this.pdf.text('StudyFlow', 5, 8);
    this.pdf.text(this.telegramChannel, this.pageWidth - 35, 8);
    this.pdf.text(`Page ${currentPage}`, this.pageWidth - 20, this.pageHeight - 5);
  }

  private addHeader(): void {
    // Reset position for header
    const savedY = this.currentY;
    this.currentY = 0;
    
    // Clean gradient background
    const steps = 25;
    for (let i = 0; i < steps; i++) {
      const opacity = 0.8 - (i / steps) * 0.4;
      const y = i * (this.headerHeight / steps);
      this.pdf.setFillColor(139, 92, 246, opacity);
      this.pdf.rect(0, y, this.pageWidth, this.headerHeight / steps + 1, 'F');
    }
    
    // Add clean bottom border
    this.pdf.setDrawColor(255, 255, 255, 0.3);
    this.pdf.setLineWidth(1);
    this.pdf.line(0, this.headerHeight - 1, this.pageWidth, this.headerHeight - 1);
    
    // Main title with proper spacing
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'bold');
    
    // Use Unicode symbols instead of emojis for better PDF compatibility
    this.pdf.text('STUDY ANALYTICS REPORT', this.margin, 22);
    
    // Add clean subtitle
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text('Comprehensive Performance Analysis & Insights', this.margin, 32);
    
    // Right-aligned info
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(255, 255, 255, 0.8);
    const dateText = `Generated: ${format(new Date(), 'PPP')}`;
    const channelText = this.telegramChannel;
    
    this.pdf.text(dateText, this.pageWidth - this.margin - 80, 22);
    this.pdf.text(channelText, this.pageWidth - this.margin - 80, 32);
    
    // Restore Y position
    this.currentY = this.headerHeight + this.margin;
  }

  private addSummarySection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(80);
    
    // Section header with clean design
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(139, 92, 246);
    this.pdf.setFont('helvetica', 'bold');
    
    // Subtle section header background
    this.pdf.setFillColor(139, 92, 246, 0.08);
    this.pdf.roundedRect(this.margin - 3, this.currentY - 6, 160, 16, 2, 2, 'F');
    
    this.pdf.text('PERFORMANCE OVERVIEW', this.margin, this.currentY);
    this.currentY += 20;

    // Clean card layout
    const cardWidth = (this.pageWidth - 3 * this.margin) / 2;
    const cardHeight = 22;
    
    const summaryData = [
      { title: 'Total Study Time', value: this.formatTime(data.totalStudyTime), symbol: '•' },
      { title: 'Total Sessions', value: data.totalSessions.toString(), symbol: '•' },
      { title: 'Average Session', value: this.formatTime(data.averageSessionTime), symbol: '•' },
      { title: 'Average Efficiency', value: `${data.averageEfficiency.toFixed(1)}/5.0`, symbol: '★' }
    ];

    summaryData.forEach((item, index) => {
      this.addNewPageIfNeeded(cardHeight + 5);
      
      const x = this.margin + (index % 2) * (cardWidth + this.margin);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 8);
      
      // Clean card design
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
      
      // Subtle border
      this.pdf.setDrawColor(226, 232, 240);
      this.pdf.setLineWidth(0.3);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');
      
      // Symbol
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(139, 92, 246);
      this.pdf.text(item.symbol, x + 4, y + 8);
      
      // Title
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(item.title, x + 12, y + 8);
      
      // Value
      this.pdf.setFontSize(13);
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.value, x + 12, y + 16);
    });

    this.currentY += Math.ceil(summaryData.length / 2) * (cardHeight + 8) + 15;
  }

  private async addChartSection(elementId: string, title: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Chart element ${elementId} not found`);
      return;
    }

    this.addNewPageIfNeeded(100);
    
    // Clean section header
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(59, 130, 246);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setFillColor(59, 130, 246, 0.06);
    this.pdf.roundedRect(this.margin - 3, this.currentY - 6, 180, 16, 2, 2, 'F');
    
    this.pdf.text(title.toUpperCase(), this.margin, this.currentY);
    this.currentY += 20;

    try {
      // Improved canvas capture settings
      const canvas = await html2canvas(element, {
        scale: window.devicePixelRatio || 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ensure chart fits on page
      const maxHeight = this.contentHeight * 0.6; // Max 60% of content height
      const finalHeight = Math.min(imgHeight, maxHeight);
      const finalWidth = (finalHeight * canvas.width) / canvas.height;
      
      this.addNewPageIfNeeded(finalHeight + 15);
      
      // Center the image if it's smaller than page width
      const imageX = finalWidth < imgWidth ? this.margin + (imgWidth - finalWidth) / 2 : this.margin;
      
      this.pdf.addImage(imgData, 'JPEG', imageX, this.currentY, finalWidth, finalHeight);
      this.currentY += finalHeight + 20;
      
    } catch (error) {
      console.error(`Failed to capture ${title}:`, error);
      
      // Clean error placeholder
      this.pdf.setFillColor(254, 242, 242);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 2, 2, 'F');
      
      this.pdf.setDrawColor(252, 165, 165);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 2, 2, 'S');
      
      this.pdf.setTextColor(185, 28, 28);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Unable to capture ${title}`, this.margin + 8, this.currentY + 15);
      
      this.currentY += 35;
    }
  }

  private addSubjectBreakdown(data: AnalyticsData): void {
    this.addNewPageIfNeeded(120);
    
    // Clean section header
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(16, 185, 129);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setFillColor(16, 185, 129, 0.06);
    this.pdf.roundedRect(this.margin - 3, this.currentY - 6, 140, 16, 2, 2, 'F');
    
    this.pdf.text('SUBJECT BREAKDOWN', this.margin, this.currentY);
    this.currentY += 20;

    // Process subject data
    const subjectMap = new Map();
    data.sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { 
        subject: session.subject, 
        hours: 0, 
        sessions: 0,
        efficiency: 0,
        efficiencyCount: 0
      };
      current.hours += session.duration / 60;
      current.sessions += 1;
      if (session.efficiency) {
        current.efficiency += session.efficiency;
        current.efficiencyCount += 1;
      }
      subjectMap.set(session.subject, current);
    });

    const subjectData = Array.from(subjectMap.values())
      .map(item => ({
        ...item,
        hours: Math.round(item.hours * 10) / 10,
        avgEfficiency: item.efficiencyCount > 0 ? (item.efficiency / item.efficiencyCount).toFixed(1) : 'N/A'
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);

    if (subjectData.length === 0) {
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.setFontSize(11);
      this.pdf.text('No subject data available', this.margin, this.currentY);
      this.currentY += 25;
      return;
    }

    // Clean table design
    const colWidths = [65, 25, 25, 25, 40];
    const rowHeight = 10;
    const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
    
    // Table header
    this.pdf.setFillColor(139, 92, 246, 0.1);
    this.pdf.roundedRect(this.margin, this.currentY, tableWidth, rowHeight, 1, 1, 'F');
    
    this.pdf.setTextColor(139, 92, 246);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    
    const headers = ['Subject', 'Hours', 'Sessions', 'Efficiency', 'Progress'];
    let currentX = this.margin + 2;
    
    headers.forEach((header, index) => {
      this.pdf.text(header, currentX, this.currentY + 7);
      currentX += colWidths[index];
    });
    
    this.currentY += rowHeight + 3;

    // Table rows
    const maxHours = Math.max(...subjectData.map(s => s.hours));
    
    subjectData.forEach((subject, index) => {
      this.addNewPageIfNeeded(rowHeight + 2);
      
      // Alternate row background
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY - 1, tableWidth, rowHeight, 'F');
      }
      
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(8);
      
      currentX = this.margin + 2;
      
      // Subject name (truncated if too long)
      const subjectName = subject.subject.length > 22 ? 
        subject.subject.substring(0, 22) + '...' : subject.subject;
      this.pdf.text(subjectName, currentX, this.currentY + 6);
      currentX += colWidths[0];
      
      // Hours
      this.pdf.text(subject.hours + 'h', currentX, this.currentY + 6);
      currentX += colWidths[1];
      
      // Sessions
      this.pdf.text(subject.sessions.toString(), currentX, this.currentY + 6);
      currentX += colWidths[2];
      
      // Efficiency
      this.pdf.text(subject.avgEfficiency, currentX, this.currentY + 6);
      currentX += colWidths[3];
      
      // Progress bar
      const barWidth = 30;
      const barHeight = 3;
      const percentage = maxHours > 0 ? (subject.hours / maxHours) : 0;
      
      // Background bar
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.roundedRect(currentX, this.currentY + 4, barWidth, barHeight, 0.5, 0.5, 'F');
      
      // Progress bar
      if (percentage > 0) {
        this.pdf.setFillColor(139, 92, 246);
        this.pdf.roundedRect(currentX, this.currentY + 4, barWidth * percentage, barHeight, 0.5, 0.5, 'F');
      }
      
      this.currentY += rowHeight + 1;
    });

    this.currentY += 15;
  }

  private addInsightsSection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(100);
    
    // Clean section header
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(245, 158, 11);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setFillColor(245, 158, 11, 0.06);
    this.pdf.roundedRect(this.margin - 3, this.currentY - 6, 200, 16, 2, 2, 'F');
    
    this.pdf.text('KEY INSIGHTS & RECOMMENDATIONS', this.margin, this.currentY);
    this.currentY += 20;

    const insights = [
      {
        symbol: '♦',
        title: 'Study Consistency',
        description: `You have maintained ${data.sessions.length} study sessions with an average of ${(data.sessions.length / 7).toFixed(1)} sessions per week.`,
        recommendation: data.sessions.length >= 14 ? 'Excellent consistency! Continue this steady pace for optimal learning retention.' : 'Try to maintain more regular study sessions for better knowledge retention.'
      },
      {
        symbol: '★',
        title: 'Efficiency Analysis',
        description: `Your average efficiency rating is ${data.averageEfficiency.toFixed(1)}/5.0 across all sessions.`,
        recommendation: data.averageEfficiency >= 4 ? 'Outstanding efficiency! Your focused approach is paying off.' : 'Consider implementing the Pomodoro technique or finding a quieter study environment to boost efficiency.'
      },
      {
        symbol: '◆',
        title: 'Session Optimization',
        description: `Your average session duration is ${this.formatTime(data.averageSessionTime)}.`,
        recommendation: data.averageSessionTime > 120 ? 'Consider incorporating 5-10 minute breaks during longer sessions to maintain focus.' : 'Your session length is optimal. You might benefit from slightly longer sessions as your stamina builds.'
      }
    ];

    insights.forEach(insight => {
      this.addNewPageIfNeeded(28);
      
      // Clean insight card
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 24, 2, 2, 'F');
      
      this.pdf.setDrawColor(229, 231, 235);
      this.pdf.setLineWidth(0.3);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 24, 2, 2, 'S');
      
      // Symbol
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(245, 158, 11);
      this.pdf.text(insight.symbol, this.margin + 4, this.currentY + 8);
      
      // Title
      this.pdf.setFontSize(11);
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(insight.title, this.margin + 14, this.currentY + 8);
      
      // Description and recommendation
      const maxWidth = this.pageWidth - 2 * this.margin - 18;
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(75, 85, 99);
      
      // Split long text properly
      const descLines = this.pdf.splitTextToSize(insight.description, maxWidth);
      let textY = this.currentY + 13;
      
      descLines.slice(0, 2).forEach((line: string) => {
        this.pdf.text(line, this.margin + 4, textY);
        textY += 4;
      });
      
      // Recommendation
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.setFont('helvetica', 'italic');
      const recLines = this.pdf.splitTextToSize(`► ${insight.recommendation}`, maxWidth);
      
      recLines.slice(0, 1).forEach((line: string) => {
        this.pdf.text(line, this.margin + 4, textY);
        textY += 4;
      });
      
      this.currentY += 30;
    });
  }

  private addFooterToCurrentPage(): void {
    const footerY = this.pageHeight - this.footerHeight + 5;
    const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
    
    // Clean footer background
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.rect(0, footerY - 2, this.pageWidth, this.footerHeight, 'F');
    
    // Top border line
    this.pdf.setDrawColor(226, 232, 240);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin, footerY, this.pageWidth - this.margin, footerY);
    
    // Footer content
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(139, 92, 246);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('StudyFlow Analytics Report', this.margin, footerY + 6);
    
    // Channel info
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(107, 114, 128);
    this.pdf.text(`Join our community: ${this.telegramChannel}`, this.margin, footerY + 11);
    
    // Page number
    this.pdf.text(`Page ${currentPage}`, this.pageWidth - this.margin - 15, footerY + 8);
  }

  async generateReport(data: AnalyticsData, options: ExportOptions): Promise<void> {
    try {
      // Initialize first page
      this.addHeader();
      this.currentY = this.headerHeight + this.margin;

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

      // Finalize the last page
      this.finalizePage();

      // Convert to grayscale if requested
      if (options.colorMode === 'grayscale') {
        console.log('Grayscale conversion requested (not implemented in jsPDF)');
      }

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      const filename = `studyflow-analytics-${timestamp}.pdf`;

      // Save the PDF
      this.pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error(`Failed to generate PDF report: ${error.message}`);
    }
  }
}
