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
    const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
    
    this.pdf.saveGraphicsState();
    
    try {
      // Premium diagonal watermark with multiple layers
      this.pdf.setGState(this.pdf.GState({ opacity: 0.02 }));
      
      // Large background watermark
      this.pdf.setFontSize(60);
      this.pdf.setTextColor(99, 102, 241);
      this.pdf.setFont('helvetica', 'bold');
      
      const centerX = this.pageWidth / 2;
      const centerY = this.pageHeight / 2;
      
      // Main diagonal watermark
      this.pdf.text('STUDYFLOW', centerX, centerY, {
        angle: -35,
        align: 'center'
      });
      
      // Secondary watermark layer
      this.pdf.setFontSize(20);
      this.pdf.setGState(this.pdf.GState({ opacity: 0.015 }));
      this.pdf.text('PREMIUM ANALYTICS', centerX, centerY + 25, {
        angle: -35,
        align: 'center'
      });
      
      // Tertiary watermark layer
      this.pdf.setFontSize(14);
      this.pdf.setGState(this.pdf.GState({ opacity: 0.02 }));
      this.pdf.text(this.telegramChannel, centerX, centerY + 45, {
        angle: -35,
        align: 'center'
      });
      
    } catch (error) {
      console.warn('Watermark rendering failed:', error);
    } finally {
      this.pdf.restoreGraphicsState();
    }
    
    // Premium corner branding
    this.pdf.setFontSize(6);
    this.pdf.setTextColor(99, 102, 241, 0.15);
    this.pdf.setFont('helvetica', 'normal');
    
    // Elegant corner marks
    this.pdf.text('StudyFlow Pro', 3, 6);
    this.pdf.text('Premium Report', this.pageWidth - 25, 6);
  }

  private addHeader(): void {
    const savedY = this.currentY;
    this.currentY = 0;
    
    // Premium gradient background - lighter and more elegant
    const steps = 30;
    for (let i = 0; i < steps; i++) {
      const opacity = 0.12 - (i / steps) * 0.08;
      const y = i * (this.headerHeight / steps);
      this.pdf.setFillColor(99, 102, 241, opacity);
      this.pdf.rect(0, y, this.pageWidth, this.headerHeight / steps + 1, 'F');
    }
    
    // Elegant bottom accent line
    this.pdf.setDrawColor(99, 102, 241, 0.3);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(0, this.headerHeight - 0.5, this.pageWidth, this.headerHeight - 0.5);
    
    // Clean, professional title without icons
    this.pdf.setFontSize(26);
    this.pdf.setTextColor(31, 41, 55);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('STUDY ANALYTICS REPORT', this.margin, 24);
    
    // Professional subtitle
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(75, 85, 99);
    this.pdf.text('Comprehensive Performance Analysis & Insights', this.margin, 34);
    
    // Clean right-aligned information
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(107, 114, 128);
    const dateText = `Generated: ${format(new Date(), 'PPP')}`;
    const channelText = `Community: ${this.telegramChannel}`;
    
    this.pdf.text(dateText, this.pageWidth - this.margin - 85, 24);
    this.pdf.text(channelText, this.pageWidth - this.margin - 85, 34);
    
    this.currentY = this.headerHeight + this.margin;
  }

  private addSummarySection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(80);
    
    // Clean section header without icons
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.setFont('helvetica', 'bold');
    
    // Premium section header with accent line
    this.pdf.setDrawColor(99, 102, 241, 0.4);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 50, this.currentY + 2);
    
    this.pdf.text('PERFORMANCE OVERVIEW', this.margin, this.currentY);
    this.currentY += 20;

    // Premium card layout
    const cardWidth = (this.pageWidth - 3 * this.margin) / 2;
    const cardHeight = 22;
    
    const summaryData = [
      { title: 'Total Study Time', value: this.formatTime(data.totalStudyTime), symbol: '◆' },
      { title: 'Total Sessions', value: data.totalSessions.toString(), symbol: '◇' },
      { title: 'Average Session', value: this.formatTime(data.averageSessionTime), symbol: '◈' },
      { title: 'Average Efficiency', value: `${data.averageEfficiency.toFixed(1)}/5.0`, symbol: '◉' }
    ];

    summaryData.forEach((item, index) => {
      this.addNewPageIfNeeded(cardHeight + 5);
      
      const x = this.margin + (index % 2) * (cardWidth + this.margin);
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 8);
      
      // Premium card design with subtle gradient
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
      
      // Premium border
      this.pdf.setDrawColor(209, 213, 219);
      this.pdf.setLineWidth(0.3);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');
      
      // Clean symbol
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(99, 102, 241);
      this.pdf.text(item.symbol, x + 4, y + 8);
      
      // Professional title
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
    
    // Professional section header without icons
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(37, 99, 235);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setDrawColor(37, 99, 235, 0.4);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 40, this.currentY + 2);
    
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
      
      // Premium error placeholder
      this.pdf.setFillColor(254, 242, 242, 0.5);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 2, 2, 'F');
      
      this.pdf.setDrawColor(248, 113, 113, 0.3);
      this.pdf.setLineWidth(0.3);
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
    
    // Professional section header without icons
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(5, 150, 105);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setDrawColor(5, 150, 105, 0.4);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 45, this.currentY + 2);
    
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

    // Premium table design
    const colWidths = [65, 25, 25, 25, 40];
    const rowHeight = 10;
    const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
    
    // Premium table header
    this.pdf.setFillColor(99, 102, 241, 0.08);
    this.pdf.roundedRect(this.margin, this.currentY, tableWidth, rowHeight, 1, 1, 'F');
    
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    
    const headers = ['Subject', 'Hours', 'Sessions', 'Efficiency', 'Progress'];
    let currentX = this.margin + 2;
    
    headers.forEach((header, index) => {
      this.pdf.text(header, currentX, this.currentY + 7);
      currentX += colWidths[index];
    });
    
    this.currentY += rowHeight + 3;

    // Premium table rows
    const maxHours = Math.max(...subjectData.map(s => s.hours));
    
    subjectData.forEach((subject, index) => {
      this.addNewPageIfNeeded(rowHeight + 2);
      
      // Premium alternate row background
      if (index % 2 === 0) {
        this.pdf.setFillColor(249, 250, 251);
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
      
      // Premium background bar
      this.pdf.setFillColor(229, 231, 235, 0.6);
      this.pdf.roundedRect(currentX, this.currentY + 4, barWidth, barHeight, 0.5, 0.5, 'F');
      
      // Premium progress bar
      if (percentage > 0) {
        this.pdf.setFillColor(99, 102, 241);
        this.pdf.roundedRect(currentX, this.currentY + 4, barWidth * percentage, barHeight, 0.5, 0.5, 'F');
      }
      
      this.currentY += rowHeight + 1;
    });

    this.currentY += 15;
  }

  private addInsightsSection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(100);
    
    // Professional section header without icons
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(217, 119, 6);
    this.pdf.setFont('helvetica', 'bold');
    
    this.pdf.setDrawColor(217, 119, 6, 0.4);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 60, this.currentY + 2);
    
    this.pdf.text('KEY INSIGHTS & RECOMMENDATIONS', this.margin, this.currentY);
    this.currentY += 20;

    const insights = [
      {
        symbol: '◆',
        title: 'Study Consistency',
        description: `You have maintained ${data.sessions.length} study sessions with an average of ${(data.sessions.length / 7).toFixed(1)} sessions per week.`,
        recommendation: data.sessions.length >= 14 ? 'Excellent consistency! Continue this steady pace for optimal learning retention.' : 'Try to maintain more regular study sessions for better knowledge retention.'
      },
      {
        symbol: '◉',
        title: 'Efficiency Analysis',
        description: `Your average efficiency rating is ${data.averageEfficiency.toFixed(1)}/5.0 across all sessions.`,
        recommendation: data.averageEfficiency >= 4 ? 'Outstanding efficiency! Your focused approach is paying off.' : 'Consider implementing the Pomodoro technique or finding a quieter study environment to boost efficiency.'
      },
      {
        symbol: '◈',
        title: 'Session Optimization',
        description: `Your average session duration is ${this.formatTime(data.averageSessionTime)}.`,
        recommendation: data.averageSessionTime > 120 ? 'Consider incorporating 5-10 minute breaks during longer sessions to maintain focus.' : 'Your session length is optimal. You might benefit from slightly longer sessions as your stamina builds.'
      }
    ];

    insights.forEach(insight => {
      this.addNewPageIfNeeded(28);
      
      // Premium insight card
      this.pdf.setFillColor(250, 251, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 24, 2, 2, 'F');
      
      this.pdf.setDrawColor(209, 213, 219, 0.5);
      this.pdf.setLineWidth(0.3);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 24, 2, 2, 'S');
      
      // Premium symbol
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(217, 119, 6);
      this.pdf.text(insight.symbol, this.margin + 4, this.currentY + 8);
      
      // Professional title
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
      
      // Premium recommendation
      this.pdf.setTextColor(5, 150, 105);
      this.pdf.setFont('helvetica', 'italic');
      const recLines = this.pdf.splitTextToSize(`▶ ${insight.recommendation}`, maxWidth);
      
      recLines.slice(0, 1).forEach((line: string) => {
        this.pdf.text(line, this.margin + 4, textY);
        textY += 4;
      });
      
      this.currentY += 30;
    });
  }

  private addFooterToCurrentPage(): void {
    const footerY = this.pageHeight - this.footerHeight + 3;
    const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
    
    // Premium footer with subtle gradient
    const footerSteps = 8;
    for (let i = 0; i < footerSteps; i++) {
      const opacity = 0.02 + (i / footerSteps) * 0.04;
      const y = footerY - 2 + i * (this.footerHeight / footerSteps);
      this.pdf.setFillColor(99, 102, 241, opacity);
      this.pdf.rect(0, y, this.pageWidth, this.footerHeight / footerSteps + 1, 'F');
    }
    
    // Premium top accent line
    this.pdf.setDrawColor(99, 102, 241, 0.2);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, footerY - 1, this.pageWidth - this.margin, footerY - 1);
    
    // Premium footer content
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('StudyFlow Premium Analytics', this.margin, footerY + 6);
    
    // Community info
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(107, 114, 128);
    this.pdf.text(`Community: ${this.telegramChannel}`, this.margin, footerY + 12);
    
    // Premium page number
    this.pdf.setTextColor(99, 102, 241);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${currentPage}`, this.pageWidth - this.margin - 8, footerY + 9);
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
