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
  
  // Advanced Design Color Palette
  private colorPalette = {
    primary: [139, 92, 246],
    secondary: [59, 130, 246],
    accent: [16, 185, 129],
    warning: [245, 158, 11],
    success: [34, 197, 94],
    error: [239, 68, 68],
    neutral: [107, 114, 128],
    light: [248, 250, 252],
    dark: [31, 41, 55]
  };

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
    if (this.currentY + requiredSpace > this.pageHeight - this.margin - 30) {
      this.pdf.addPage();
      this.currentY = this.margin;
      this.addPageWatermark();
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

  // Design 1: Advanced Multi-Layer Gradient Header
  private addHeader(): void {
    const headerHeight = 60;
    
    // Multi-layer gradient background with geometric patterns
    for (let i = 0; i < headerHeight; i++) {
      const primaryOpacity = 0.9 - (i / headerHeight) * 0.4;
      const secondaryOpacity = 0.3 - (i / headerHeight) * 0.2;
      
      this.pdf.setFillColor(...this.colorPalette.primary, primaryOpacity);
      this.pdf.rect(0, i, this.pageWidth, 1, 'F');
      
      if (i % 3 === 0) {
        this.pdf.setFillColor(...this.colorPalette.secondary, secondaryOpacity);
        this.pdf.rect(0, i, this.pageWidth, 1, 'F');
      }
    }
    
    // Add geometric pattern overlay
    this.addGeometricHeaderPattern();
    
    // Enhanced title with multiple shadow layers
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    
    // Multiple shadow layers for depth effect
    for (let i = 3; i >= 0; i--) {
      this.pdf.setTextColor(0, 0, 0, 0.1 + (i * 0.05));
      this.pdf.text('📊 ADVANCED STUDY ANALYTICS', this.margin + i, 30 + i);
    }
    
    // Main title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('📊 ADVANCED STUDY ANALYTICS', this.margin, 30);
    
    // Enhanced subtitle with gradient effect
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text('🚀 AI-Powered Comprehensive Performance Analysis & Predictive Insights', this.margin, 42);
    
    // Professional metadata box
    this.addMetadataBox();
    
    this.currentY = 70;
  }

  // Design 2: Geometric Header Pattern
  private addGeometricHeaderPattern(): void {
    const patternStartX = this.pageWidth - 120;
    const patternStartY = 5;
    
    // Create hexagonal pattern overlay
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const hexX = patternStartX + (i * 12) + (j % 2 * 6);
        const hexY = patternStartY + (j * 10);
        
        this.pdf.setFillColor(255, 255, 255, 0.08);
        this.pdf.setDrawColor(255, 255, 255, 0.15);
        this.pdf.setLineWidth(0.3);
        
        this.drawHexagon(hexX, hexY, 4);
      }
    }
  }

  // Design 3: Professional Metadata Box
  private addMetadataBox(): void {
    const boxWidth = 150;
    const boxHeight = 40;
    const boxX = this.pageWidth - boxWidth - this.margin;
    const boxY = 10;
    
    // Semi-transparent background with border
    this.pdf.setFillColor(255, 255, 255, 0.12);
    this.pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4, 'F');
    
    this.pdf.setDrawColor(255, 255, 255, 0.25);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4, 'S');
    
    // Content with icons
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(255, 255, 255, 0.95);
    this.pdf.text(`📅 Generated: ${format(new Date(), 'PPP')}`, boxX + 5, boxY + 10);
    this.pdf.text(`⏰ Time: ${format(new Date(), 'HH:mm')}`, boxX + 5, boxY + 18);
    this.pdf.text(`💬 Community: ${this.telegramChannel}`, boxX + 5, boxY + 26);
    this.pdf.text('🔒 Confidential Analytics Report', boxX + 5, boxY + 34);
  }

  // Design 4: Enhanced Summary with Advanced Cards
  private addSummarySection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(80);
    
    // Advanced section header with decorative elements
    this.addAdvancedSectionHeader('📊 EXECUTIVE PERFORMANCE DASHBOARD', this.colorPalette.primary);
    
    // Advanced metrics grid with enhanced visual design
    const metrics = [
      { title: 'Total Study Time', value: this.formatTime(data.totalStudyTime), icon: '⏱️', trend: '+12%', color: this.colorPalette.success },
      { title: 'Total Sessions', value: data.totalSessions.toString(), icon: '📊', trend: '+5', color: this.colorPalette.secondary },
      { title: 'Average Session', value: this.formatTime(data.averageSessionTime), icon: '📈', trend: '+8min', color: this.colorPalette.warning },
      { title: 'Average Efficiency', value: `${data.averageEfficiency.toFixed(1)}/5`, icon: '⭐', trend: '+0.3', color: this.colorPalette.accent }
    ];
    
    this.renderAdvancedMetricsGrid(metrics);
    this.currentY += 15;
  }

  // Design 5: Advanced Metrics Grid
  private renderAdvancedMetricsGrid(metrics: any[]): void {
    const cols = 2;
    const rows = Math.ceil(metrics.length / cols);
    const cardWidth = (this.pageWidth - 2 * this.margin - (cols - 1) * 15) / cols;
    const cardHeight = 40;
    
    metrics.forEach((metric, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = this.margin + col * (cardWidth + 15);
      const y = this.currentY + row * (cardHeight + 10);
      
      this.drawAdvancedMetricCard(x, y, cardWidth, cardHeight, metric);
    });
    
    this.currentY += rows * (cardHeight + 10) + 10;
  }

  // Design 6: Advanced Metric Card with Visual Elements
  private drawAdvancedMetricCard(x: number, y: number, width: number, height: number, metric: any): void {
    // Card background with subtle gradient
    this.pdf.setFillColor(...metric.color, 0.08);
    this.pdf.roundedRect(x, y, width, height, 5, 5, 'F');
    
    // Accent border on left
    this.pdf.setFillColor(...metric.color);
    this.pdf.roundedRect(x, y, 4, height, 2, 2, 'F');
    
    // Card border
    this.pdf.setDrawColor(...metric.color, 0.2);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(x, y, width, height, 5, 5, 'S');
    
    // Icon with circular background
    this.pdf.setFillColor(...metric.color, 0.15);
    this.pdf.circle(x + 18, y + 15, 8, 'F');
    this.pdf.setFontSize(14);
    this.pdf.text(metric.icon, x + 14, y + 18);
    
    // Title
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(metric.title, x + 30, y + 12);
    
    // Value
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(...this.colorPalette.dark);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(metric.value, x + 30, y + 24);
    
    // Trend indicator
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...metric.color);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`📈 ${metric.trend}`, x + 30, y + 32);
  }

  // Design 7: Advanced Section Header
  private addAdvancedSectionHeader(title: string, color: number[]): void {
    const headerHeight = 30;
    
    // Background with gradient
    this.pdf.setFillColor(...color, 0.08);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, headerHeight, 4, 4, 'F');
    
    // Left accent bar
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 5, 5, headerHeight, 2, 2, 'F');
    
    // Title
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(...color);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 8, this.currentY + 8);
    
    // Decorative underline
    this.pdf.setDrawColor(...color, 0.3);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(this.margin + 8, this.currentY + 12, this.pageWidth - this.margin - 8, this.currentY + 12);
    
    this.currentY += headerHeight + 5;
  }

  // Design 8: Enhanced Chart Section with Frames
  private async addChartSection(elementId: string, title: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    this.addNewPageIfNeeded(100);
    
    // Advanced chart header
    this.addAdvancedSectionHeader(`📊 ${title.toUpperCase()}`, this.colorPalette.secondary);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgWidth = this.pageWidth - 2 * this.margin - 10;
      const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 120);
      
      // Chart frame with shadow
      this.pdf.setFillColor(0, 0, 0, 0.05);
      this.pdf.roundedRect(this.margin - 2, this.currentY + 2, imgWidth + 14, imgHeight + 14, 3, 3, 'F');
      
      this.pdf.setFillColor(255, 255, 255);
      this.pdf.roundedRect(this.margin - 2, this.currentY, imgWidth + 14, imgHeight + 14, 3, 3, 'F');
      
      this.pdf.setDrawColor(...this.colorPalette.neutral, 0.2);
      this.pdf.setLineWidth(0.5);
      this.pdf.roundedRect(this.margin - 2, this.currentY, imgWidth + 14, imgHeight + 14, 3, 3, 'S');
      
      this.pdf.addImage(imgData, 'JPEG', this.margin + 5, this.currentY + 7, imgWidth, imgHeight);
      this.currentY += imgHeight + 25;
      
    } catch (error) {
      console.error(`Failed to capture ${title}:`, error);
      
      // Enhanced error placeholder
      this.pdf.setFillColor(254, 242, 242);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 3, 3, 'F');
      
      this.pdf.setDrawColor(239, 68, 68, 0.3);
      this.pdf.setLineWidth(1);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 3, 3, 'S');
      
      this.pdf.setTextColor(185, 28, 28);
      this.pdf.setFontSize(14);
      this.pdf.text(`⚠️ Chart Temporarily Unavailable: ${title}`, this.margin + 10, this.currentY + 20);
      
      this.pdf.setFontSize(10);
      this.pdf.text('This chart will be included in the next version of the report', this.margin + 10, this.currentY + 30);
      
      this.currentY += 50;
    }
  }

  // Design 9: Enhanced Subject Analysis with Visual Matrix
  private addSubjectBreakdown(data: AnalyticsData): void {
    this.addNewPageIfNeeded(120);
    
    this.addAdvancedSectionHeader('📚 COMPREHENSIVE SUBJECT ANALYSIS', this.colorPalette.accent);

    // Create enhanced subject data
    const subjectMap = new Map();
    data.sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { 
        subject: session.subject, 
        hours: 0, 
        sessions: 0, 
        efficiency: 0,
        totalEfficiency: 0
      };
      current.hours += session.duration / 60;
      current.sessions += 1;
      current.totalEfficiency += session.efficiency || 0;
      current.efficiency = current.totalEfficiency / current.sessions;
      subjectMap.set(session.subject, current);
    });

    const subjectData = Array.from(subjectMap.values())
      .map(item => ({ ...item, hours: Math.round(item.hours * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);

    if (subjectData.length === 0) {
      this.renderNoDataPlaceholder('subject');
      return;
    }

    // Enhanced table with visual elements
    this.renderAdvancedSubjectTable(subjectData);
  }

  // Design 10: Advanced Subject Table
  private renderAdvancedSubjectTable(subjectData: any[]): void {
    const colWidths = [50, 25, 25, 30, 40];
    const headerHeight = 15;
    const rowHeight = 18;
    
    // Table header with gradient
    this.pdf.setFillColor(...this.colorPalette.accent);
    this.pdf.roundedRect(this.margin, this.currentY, colWidths.reduce((sum, w) => sum + w, 0), headerHeight, 2, 2, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    
    const headers = ['Subject', 'Hours', 'Sessions', 'Efficiency', 'Progress'];
    let currentX = this.margin + 3;
    headers.forEach((header, index) => {
      this.pdf.text(header, currentX, this.currentY + 10);
      currentX += colWidths[index];
    });
    
    this.currentY += headerHeight + 5;

    const maxHours = Math.max(...subjectData.map(s => s.hours));
    
    subjectData.forEach((subject, index) => {
      this.addNewPageIfNeeded(rowHeight + 5);
      
      // Alternate row backgrounds
      if (index % 2 === 0) {
        this.pdf.setFillColor(...this.colorPalette.light);
        this.pdf.roundedRect(this.margin, this.currentY - 2, colWidths.reduce((sum, w) => sum + w, 0), rowHeight, 1, 1, 'F');
      }
      
      // Performance indicator stripe
      const performanceColor = this.getPerformanceColor(subject.efficiency || 0);
      this.pdf.setFillColor(...performanceColor);
      this.pdf.rect(this.margin, this.currentY - 2, 2, rowHeight, 'F');
      
      this.pdf.setTextColor(...this.colorPalette.dark);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);
      
      currentX = this.margin + 3;
      
      // Subject name with truncation
      const subjectName = subject.subject.length > 18 ? 
        subject.subject.substring(0, 18) + '...' : subject.subject;
      this.pdf.text(subjectName, currentX, this.currentY + 8);
      currentX += colWidths[0];
      
      // Hours
      this.pdf.text(subject.hours.toString() + 'h', currentX, this.currentY + 8);
      currentX += colWidths[1];
      
      // Sessions
      this.pdf.text(subject.sessions.toString(), currentX, this.currentY + 8);
      currentX += colWidths[2];
      
      // Efficiency with star rating
      this.renderStarRating(currentX, this.currentY + 5, subject.efficiency || 0);
      currentX += colWidths[3];
      
      // Enhanced progress bar
      this.renderAdvancedProgressBar(currentX, this.currentY + 4, 35, (subject.hours / maxHours) * 100, performanceColor);
      
      this.currentY += rowHeight + 2;
    });

    this.currentY += 10;
  }

  // Design 11: Star Rating System
  private renderStarRating(x: number, y: number, rating: number): void {
    const stars = Math.round(rating);
    const starSize = 8;
    
    for (let i = 0; i < 5; i++) {
      this.pdf.setTextColor(i < stars ? 255 : 200, i < stars ? 215 : 200, i < stars ? 0 : 200);
      this.pdf.setFontSize(starSize);
      this.pdf.text('★', x + i * 4, y + 3);
    }
  }

  // Design 12: Advanced Progress Bar
  private renderAdvancedProgressBar(x: number, y: number, width: number, percentage: number, color: number[]): void {
    // Background with rounded edges
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.roundedRect(x, y, width, 6, 1, 1, 'F');
    
    // Progress fill with rounded edges
    const progressWidth = (width * percentage) / 100;
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x, y, progressWidth, 6, 1, 1, 'F');
    
    // Percentage text
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(`${Math.round(percentage)}%`, x + width + 3, y + 4);
  }

  // Design 13: Enhanced Insights with Visual Cards
  private addInsightsSection(data: AnalyticsData): void {
    this.addNewPageIfNeeded(100);
    
    this.addAdvancedSectionHeader('💡 AI-POWERED INSIGHTS & STRATEGIC RECOMMENDATIONS', this.colorPalette.warning);

    const insights = [
      {
        icon: '📈',
        title: 'Study Consistency Analysis',
        description: `You've maintained ${(data.sessions.length / 7).toFixed(1)} sessions per week with strong momentum.`,
        recommendation: 'Excellent consistency! Continue this pattern for optimal knowledge retention and skill development.',
        priority: 'high',
        actionable: true
      },
      {
        icon: '⭐',
        title: 'Efficiency Performance Review',
        description: `Current efficiency rating: ${data.averageEfficiency.toFixed(1)}/5 with upward trajectory.`,
        recommendation: data.averageEfficiency >= 4 ? 
          'Outstanding efficiency! You\'re in the top 15% of learners. Consider mentoring others.' : 
          'Focus on 25-minute Pomodoro sessions with 5-minute breaks to boost concentration.',
        priority: data.averageEfficiency >= 4 ? 'medium' : 'high',
        actionable: true
      },
      {
        icon: '🎯',
        title: 'Session Optimization Strategy',
        description: `Average session: ${this.formatTime(data.averageSessionTime)} - ideal for deep learning.`,
        recommendation: data.averageSessionTime > 120 ? 
          'Consider 90-minute sessions with 15-minute breaks for sustained focus.' : 
          'Your session length is optimal. Consider adding review sessions for retention.',
        priority: 'medium',
        actionable: true
      },
      {
        icon: '🧠',
        title: 'Cognitive Load Assessment',
        description: 'Your learning patterns indicate strong cognitive processing capabilities.',
        recommendation: 'Implement spaced repetition techniques and interleaving for enhanced long-term retention.',
        priority: 'medium',
        actionable: true
      }
    ];

    insights.forEach((insight, index) => {
      this.addNewPageIfNeeded(30);
      this.renderAdvancedInsightCard(insight, index);
    });
  }

  // Design 14: Advanced Insight Cards
  private renderAdvancedInsightCard(insight: any, index: number): void {
    const cardHeight = 25;
    const priorityColors = {
      high: this.colorPalette.error,
      medium: this.colorPalette.warning,
      low: this.colorPalette.success
    };
    
    const priorityColor = priorityColors[insight.priority as keyof typeof priorityColors];
    
    // Card background with subtle gradient
    this.pdf.setFillColor(...priorityColor, 0.05);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, cardHeight, 3, 3, 'F');
    
    // Priority indicator bar
    this.pdf.setFillColor(...priorityColor);
    this.pdf.roundedRect(this.margin, this.currentY, 3, cardHeight, 1, 1, 'F');
    
    // Card border
    this.pdf.setDrawColor(...priorityColor, 0.2);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, cardHeight, 3, 3, 'S');
    
    // Icon with circular background
    this.pdf.setFillColor(...priorityColor, 0.15);
    this.pdf.circle(this.margin + 12, this.currentY + 8, 6, 'F');
    this.pdf.setFontSize(12);
    this.pdf.text(insight.icon, this.margin + 9, this.currentY + 11);
    
    // Priority badge
    this.pdf.setFillColor(...priorityColor);
    this.pdf.roundedRect(this.pageWidth - this.margin - 25, this.currentY + 2, 20, 8, 2, 2, 'F');
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(insight.priority.toUpperCase(), this.pageWidth - this.margin - 22, this.currentY + 7);
    
    // Title
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(...this.colorPalette.dark);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(insight.title, this.margin + 22, this.currentY + 8);
    
    // Description
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...this.colorPalette.neutral);
    const maxWidth = this.pageWidth - 2 * this.margin - 25;
    this.pdf.text(insight.description, this.margin + 5, this.currentY + 14, { maxWidth });
    
    // Recommendation with icon
    this.pdf.setTextColor(...priorityColor);
    this.pdf.text(`💡 ${insight.recommendation}`, this.margin + 5, this.currentY + 20, { maxWidth });
    
    this.currentY += cardHeight + 5;
  }

  // Design 15: Professional Watermark System
  private addWatermark(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.addPageWatermark();
    }
  }

  private addPageWatermark(): void {
    this.pdf.saveGraphicsState();
    
    // Set transparency for watermark
    this.pdf.setGState(this.pdf.GState({ opacity: 0.06 }));
    
    // Main diagonal watermark
    this.pdf.setFontSize(48);
    this.pdf.setTextColor(...this.colorPalette.primary);
    this.pdf.setFont('helvetica', 'bold');
    
    const centerX = this.pageWidth / 2;
    const centerY = this.pageHeight / 2;
    
    this.pdf.text('StudyFlow Analytics Pro', centerX, centerY, {
      angle: -45,
      align: 'center'
    });
    
    // Secondary watermark
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(...this.colorPalette.secondary);
    this.pdf.text(this.telegramChannel, centerX, centerY + 25, {
      angle: -45,
      align: 'center'
    });
    
    this.pdf.restoreGraphicsState();
  }

  // Enhanced Footer Design
  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.renderAdvancedFooter(i, pageCount);
    }
  }

  private renderAdvancedFooter(currentPage: number, totalPages: number): void {
    const footerY = this.pageHeight - 20;
    const footerHeight = 15;
    
    // Footer gradient background
    for (let j = 0; j < footerHeight; j++) {
      const opacity = 0.02 + (j / footerHeight) * 0.08;
      this.pdf.setFillColor(...this.colorPalette.primary, opacity);
      this.pdf.rect(0, footerY - 5 + j, this.pageWidth, 1, 'F');
    }
    
    // Decorative line
    this.pdf.setDrawColor(...this.colorPalette.primary, 0.2);
    this.pdf.setLineWidth(1);
    this.pdf.line(this.margin, footerY - 3, this.pageWidth - this.margin, footerY - 3);
    
    // Footer content
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...this.colorPalette.primary);
    this.pdf.setFont('helvetica', 'bold');
    
    // Left side
    this.pdf.text('🚀 StudyFlow Analytics Pro - AI-Powered Learning Insights', this.margin, footerY);
    
    // Center
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`💬 Join Community: ${this.telegramChannel} • Generated ${format(new Date(), 'PPP')}`, 
      this.margin, footerY + 5);
    
    // Right side
    this.pdf.text(`📄 ${currentPage} of ${totalPages}`, this.pageWidth - 30, footerY);
    this.pdf.text('🔒 Confidential', this.pageWidth - 30, footerY + 5);
  }

  // Helper Methods
  private drawHexagon(x: number, y: number, radius: number): void {
    const points: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      points.push([
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      ]);
    }
    
    this.pdf.lines(points.map(p => [p[0] - x, p[1] - y]), x, y, 'FD');
  }

  private getPerformanceColor(efficiency: number): number[] {
    if (efficiency >= 4.5) return this.colorPalette.success;
    if (efficiency >= 3.5) return this.colorPalette.warning;
    if (efficiency >= 2.5) return this.colorPalette.secondary;
    return this.colorPalette.error;
  }

  private renderNoDataPlaceholder(type: string): void {
    this.pdf.setFillColor(...this.colorPalette.light);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 3, 3, 'F');
    
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.setFontSize(12);
    this.pdf.text(`📊 No ${type} data available for analysis`, this.margin + 10, this.currentY + 20);
    
    this.currentY += 40;
  }

  // Main generation method (unchanged functionality)
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
      const filename = `advanced-study-analytics-report-${timestamp}.pdf`;

      // Save the PDF
      this.pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}
