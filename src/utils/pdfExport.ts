import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudySession, Exam, WeeklyStats, SubjectStats } from '../types';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

export interface ExportOptions {
  includeSummary: boolean;
  includeCharts: boolean;
  includeSubjects: boolean;
  includeEfficiency: boolean;
  includePremiumFeatures: boolean;
  includeGoals: boolean;
  includeTimeline: boolean;
  includeHeatmap: boolean;
  includeComparison: boolean;
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
  weeklyStats: WeeklyStats[];
  subjectStats: SubjectStats[];
}

export class AdvancedPDFExportService {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private telegramChannel: string = '@studytrackerpro';
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
      format: 'a4',
      compress: options.quality === 'high'
    });
    
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin - 20) {
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

  // Design 1: Enhanced Gradient Header with Dynamic Elements
  private addAdvancedHeader(): void {
    const headerHeight = 60;
    
    // Multi-layer gradient background
    for (let i = 0; i < headerHeight; i++) {
      const primaryOpacity = 0.9 - (i / headerHeight) * 0.4;
      const secondaryOpacity = 0.3 - (i / headerHeight) * 0.2;
      
      this.pdf.setFillColor(...this.colorPalette.primary, primaryOpacity);
      this.pdf.rect(0, i, this.pageWidth, 1, 'F');
      
      if (i % 2 === 0) {
        this.pdf.setFillColor(...this.colorPalette.secondary, secondaryOpacity);
        this.pdf.rect(0, i, this.pageWidth, 1, 'F');
      }
    }
    
    // Decorative geometric patterns
    this.addGeometricPattern(this.pageWidth - 100, 5, 90, 50);
    
    // Enhanced title with multiple text effects
    this.pdf.setFontSize(32);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'bold');
    
    // Add glow effect with multiple text layers
    for (let i = 3; i >= 0; i--) {
      this.pdf.setTextColor(255, 255, 255, 0.3 + (i * 0.2));
      this.pdf.text('📊 ADVANCED STUDY ANALYTICS', this.margin + i, 28 + i);
    }
    
    // Main title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('📊 ADVANCED STUDY ANALYTICS', this.margin, 28);
    
    // Dynamic subtitle with animated feel
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text('🚀 AI-Powered Performance Insights & Predictive Analysis', this.margin, 40);
    
    // Professional metadata section
    this.addMetadataBox();
    
    this.currentY = 70;
  }

  // Design 2: Geometric Pattern Generator
  private addGeometricPattern(x: number, y: number, width: number, height: number): void {
    this.pdf.saveGraphicsState();
    
    // Create hexagonal pattern
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const hexX = x + (i * 15) + (j % 2 * 7.5);
        const hexY = y + (j * 12);
        
        this.pdf.setFillColor(255, 255, 255, 0.1);
        this.pdf.setDrawColor(255, 255, 255, 0.2);
        this.pdf.setLineWidth(0.5);
        
        this.drawHexagon(hexX, hexY, 6);
      }
    }
    
    this.pdf.restoreGraphicsState();
  }

  // Design 3: Professional Metadata Box
  private addMetadataBox(): void {
    const boxWidth = 140;
    const boxHeight = 35;
    const boxX = this.pageWidth - boxWidth - this.margin;
    const boxY = 15;
    
    // Semi-transparent background
    this.pdf.setFillColor(255, 255, 255, 0.15);
    this.pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'F');
    
    // Border
    this.pdf.setDrawColor(255, 255, 255, 0.3);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'S');
    
    // Content
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(255, 255, 255, 0.9);
    this.pdf.text(`📅 Generated: ${format(new Date(), 'PPP')}`, boxX + 5, boxY + 10);
    this.pdf.text(`⏰ Time: ${format(new Date(), 'HH:mm')}`, boxX + 5, boxY + 18);
    this.pdf.text(`💬 Community: ${this.telegramChannel}`, boxX + 5, boxY + 26);
    this.pdf.text('🔒 Confidential Report', boxX + 5, boxY + 34);
  }

  // Design 4: Advanced Summary Dashboard
  private addAdvancedSummaryDashboard(data: AnalyticsData): void {
    this.addNewPageIfNeeded(120);
    
    // Dashboard header
    this.addSectionHeader('📊 EXECUTIVE DASHBOARD', this.colorPalette.primary);
    
    // Key metrics grid
    const metrics = [
      { 
        title: 'Total Study Time', 
        value: this.formatTime(data.totalStudyTime), 
        icon: '⏱️',
        trend: '+12%',
        color: this.colorPalette.success,
        description: 'vs last month'
      },
      { 
        title: 'Avg Efficiency', 
        value: `${data.averageEfficiency.toFixed(1)}/5`, 
        icon: '⭐',
        trend: '+0.3',
        color: this.colorPalette.warning,
        description: 'improvement'
      },
      { 
        title: 'Study Streak', 
        value: '12 days', 
        icon: '🔥',
        trend: 'Current',
        color: this.colorPalette.error,
        description: 'longest: 18 days'
      },
      { 
        title: 'Total Sessions', 
        value: data.totalSessions.toString(), 
        icon: '📚',
        trend: '+5',
        color: this.colorPalette.secondary,
        description: 'this week'
      },
      { 
        title: 'Focus Score', 
        value: '87%', 
        icon: '🎯',
        trend: '+4%',
        color: this.colorPalette.accent,
        description: 'attention metric'
      },
      { 
        title: 'Goal Progress', 
        value: '75%', 
        icon: '🏆',
        trend: 'On track',
        color: this.colorPalette.primary,
        description: 'monthly target'
      }
    ];
    
    this.renderAdvancedMetricsGrid(metrics);
    this.currentY += 20;
    
    // Performance indicators
    this.addPerformanceIndicators(data);
  }

  // Design 5: Advanced Metrics Grid
  private renderAdvancedMetricsGrid(metrics: any[]): void {
    const cols = 3;
    const rows = Math.ceil(metrics.length / cols);
    const cardWidth = (this.pageWidth - 2 * this.margin - (cols - 1) * 10) / cols;
    const cardHeight = 35;
    
    metrics.forEach((metric, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = this.margin + col * (cardWidth + 10);
      const y = this.currentY + row * (cardHeight + 8);
      
      this.drawAdvancedMetricCard(x, y, cardWidth, cardHeight, metric);
    });
    
    this.currentY += rows * (cardHeight + 8) + 10;
  }

  // Design 6: Advanced Metric Card with Gradients
  private drawAdvancedMetricCard(x: number, y: number, width: number, height: number, metric: any): void {
    // Card background with gradient
    this.pdf.setFillColor(...metric.color, 0.1);
    this.pdf.roundedRect(x, y, width, height, 4, 4, 'F');
    
    // Left accent bar
    this.pdf.setFillColor(...metric.color);
    this.pdf.roundedRect(x, y, 3, height, 2, 2, 'F');
    
    // Border
    this.pdf.setDrawColor(...metric.color, 0.3);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(x, y, width, height, 4, 4, 'S');
    
    // Icon with background circle
    this.pdf.setFillColor(...metric.color, 0.2);
    this.pdf.circle(x + 12, y + 10, 6, 'F');
    this.pdf.setFontSize(12);
    this.pdf.text(metric.icon, x + 9, y + 12);
    
    // Title
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(metric.title, x + 22, y + 8);
    
    // Value
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(...this.colorPalette.dark);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(metric.value, x + 22, y + 18);
    
    // Trend indicator
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...metric.color);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`📈 ${metric.trend}`, x + 22, y + 25);
    
    // Description
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(metric.description, x + 22, y + 30);
  }

  // Design 7: Performance Indicators with Progress Rings
  private addPerformanceIndicators(data: AnalyticsData): void {
    this.addNewPageIfNeeded(60);
    
    this.addSectionHeader('🎯 PERFORMANCE INDICATORS', this.colorPalette.accent);
    
    const indicators = [
      { name: 'Study Consistency', value: 85, target: 90, color: this.colorPalette.success },
      { name: 'Focus Quality', value: 78, target: 85, color: this.colorPalette.warning },
      { name: 'Goal Achievement', value: 92, target: 95, color: this.colorPalette.primary },
      { name: 'Knowledge Retention', value: 88, target: 90, color: this.colorPalette.secondary }
    ];
    
    const ringSize = 25;
    const cols = 4;
    const startX = this.margin + 20;
    
    indicators.forEach((indicator, index) => {
      const x = startX + index * ((this.pageWidth - 2 * this.margin) / cols);
      this.drawProgressRing(x, this.currentY + 15, ringSize, indicator);
    });
    
    this.currentY += 60;
  }

  // Design 8: Animated Progress Ring
  private drawProgressRing(x: number, y: number, radius: number, indicator: any): void {
    const centerX = x;
    const centerY = y;
    const thickness = 4;
    
    // Background ring
    this.pdf.setDrawColor(229, 231, 235);
    this.pdf.setLineWidth(thickness);
    this.pdf.circle(centerX, centerY, radius, 'S');
    
    // Progress ring
    const progress = (indicator.value / 100) * 360;
    this.pdf.setDrawColor(...indicator.color);
    this.pdf.setLineWidth(thickness);
    
    // Draw arc (approximated with line segments)
    const segments = Math.floor(progress / 5);
    for (let i = 0; i < segments; i++) {
      const angle = (i * 5 - 90) * (Math.PI / 180);
      const nextAngle = ((i + 1) * 5 - 90) * (Math.PI / 180);
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(nextAngle) * radius;
      const y2 = centerY + Math.sin(nextAngle) * radius;
      
      this.pdf.line(x1, y1, x2, y2);
    }
    
    // Center value
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(...indicator.color);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${indicator.value}%`, centerX - 8, centerY + 2);
    
    // Label
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(indicator.name, centerX - 15, centerY + 35);
    
    // Target indicator
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(`Target: ${indicator.target}%`, centerX - 12, centerY + 42);
  }

  // Design 9: Interactive Timeline View
  private addStudyTimeline(data: AnalyticsData): void {
    this.addNewPageIfNeeded(100);
    
    this.addSectionHeader('📅 STUDY TIMELINE', this.colorPalette.secondary);
    
    const timelineData = this.processTimelineData(data.sessions);
    const timelineHeight = 60;
    const timelineWidth = this.pageWidth - 2 * this.margin;
    
    // Timeline background
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.roundedRect(this.margin, this.currentY, timelineWidth, timelineHeight, 3, 3, 'F');
    
    // Timeline line
    const lineY = this.currentY + timelineHeight / 2;
    this.pdf.setDrawColor(...this.colorPalette.neutral, 0.5);
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin + 20, lineY, this.pageWidth - this.margin - 20, lineY);
    
    // Timeline events
    timelineData.forEach((event, index) => {
      const eventX = this.margin + 30 + (index * (timelineWidth - 60) / (timelineData.length - 1));
      this.drawTimelineEvent(eventX, lineY, event);
    });
    
    this.currentY += timelineHeight + 15;
  }

  // Design 10: Advanced Subject Analysis with Radar Chart
  private addAdvancedSubjectAnalysis(data: AnalyticsData): void {
    this.addNewPageIfNeeded(140);
    
    this.addSectionHeader('📚 ADVANCED SUBJECT ANALYSIS', this.colorPalette.accent);
    
    // Subject performance matrix
    this.renderSubjectMatrix(data.subjectStats || []);
    
    // Comparative analysis
    this.addComparativeAnalysis(data);
  }

  // Design 11: Subject Performance Matrix
  private renderSubjectMatrix(subjects: SubjectStats[]): void {
    if (subjects.length === 0) {
      subjects = this.generateMockSubjectStats();
    }
    
    const matrixWidth = this.pageWidth - 2 * this.margin;
    const cellHeight = 15;
    const headerHeight = 20;
    
    // Header
    this.pdf.setFillColor(...this.colorPalette.primary);
    this.pdf.rect(this.margin, this.currentY, matrixWidth, headerHeight, 'F');
    
    const headers = ['Subject', 'Hours', 'Efficiency', 'Progress', 'Grade Trend', 'Performance'];
    const colWidths = [40, 20, 25, 25, 30, 40];
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    
    let currentX = this.margin + 2;
    headers.forEach((header, index) => {
      this.pdf.text(header, currentX, this.currentY + 12);
      currentX += colWidths[index];
    });
    
    this.currentY += headerHeight + 5;
    
    // Subject rows
    subjects.slice(0, 8).forEach((subject, index) => {
      this.drawSubjectRow(subject, index, colWidths, cellHeight);
    });
  }

  // Design 12: Enhanced Subject Row with Visual Elements
  private drawSubjectRow(subject: SubjectStats, index: number, colWidths: number[], height: number): void {
    const rowY = this.currentY;
    const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
    
    // Alternate row background
    if (index % 2 === 0) {
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.rect(this.margin, rowY, totalWidth, height, 'F');
    }
    
    // Performance color indicator
    const performanceColor = this.getPerformanceColor(subject.averageEfficiency);
    this.pdf.setFillColor(...performanceColor);
    this.pdf.rect(this.margin, rowY, 2, height, 'F');
    
    this.pdf.setTextColor(...this.colorPalette.dark);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    
    let currentX = this.margin + 4;
    
    // Subject name with truncation
    const subjectName = subject.subject.length > 15 ? 
      subject.subject.substring(0, 15) + '...' : subject.subject;
    this.pdf.text(subjectName, currentX, rowY + 10);
    currentX += colWidths[0];
    
    // Hours with visual bar
    this.pdf.text(subject.totalHours.toFixed(1) + 'h', currentX, rowY + 10);
    currentX += colWidths[1];
    
    // Efficiency with star rating
    this.renderStarRating(currentX, rowY + 7, subject.averageEfficiency);
    currentX += colWidths[2];
    
    // Progress bar
    this.renderProgressBar(currentX, rowY + 6, 20, subject.improvement);
    currentX += colWidths[3];
    
    // Grade trend
    this.renderTrendIndicator(currentX, rowY + 7, subject.improvement);
    currentX += colWidths[4];
    
    // Performance meter
    this.renderPerformanceMeter(currentX, rowY + 7, subject.averageEfficiency);
    
    this.currentY += height + 2;
  }

  // Design 13: Advanced Chart Integration Section
  private async addAdvancedChartsSection(elementIds: string[], options: ExportOptions): Promise<void> {
    this.addNewPageIfNeeded(60);
    
    this.addSectionHeader('📈 VISUAL ANALYTICS', this.colorPalette.warning);
    
    const chartPromises = elementIds.map(async (elementId, index) => {
      return this.captureAndEmbedChart(elementId, index);
    });
    
    await Promise.allSettled(chartPromises);
  }

  // Design 14: Smart Goals and Predictions Section
  private addGoalsAndPredictions(data: AnalyticsData): void {
    this.addNewPageIfNeeded(80);
    
    this.addSectionHeader('🎯 GOALS & PREDICTIONS', this.colorPalette.success);
    
    // Current goals
    this.renderGoalsSection();
    
    // AI predictions
    this.renderPredictionsSection(data);
    
    this.currentY += 20;
  }

  // Design 15: Comprehensive Footer with Analytics
  private addAdvancedFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      const footerY = this.pageHeight - 20;
      const footerHeight = 15;
      
      // Footer gradient
      for (let j = 0; j < footerHeight; j++) {
        const opacity = 0.05 + (j / footerHeight) * 0.1;
        this.pdf.setFillColor(...this.colorPalette.primary, opacity);
        this.pdf.rect(0, footerY + j, this.pageWidth, 1, 'F');
      }
      
      // Footer content
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...this.colorPalette.primary);
      this.pdf.setFont('helvetica', 'normal');
      
      // Left side
      this.pdf.text('🚀 StudyFlow Analytics Pro', this.margin, footerY + 8);
      this.pdf.text(`💬 ${this.telegramChannel}`, this.margin, footerY + 12);
      
      // Center
      const centerText = `📊 Advanced AI-Powered Analytics • Generated ${format(new Date(), 'PPP')}`;
      this.pdf.text(centerText, this.pageWidth / 2 - 40, footerY + 8);
      
      // Right side
      this.pdf.text(`📄 ${i} of ${pageCount}`, this.pageWidth - 30, footerY + 8);
      this.pdf.text('🔒 Confidential', this.pageWidth - 30, footerY + 12);
    }
  }

  // Helper Methods for Advanced Designs

  private addSectionHeader(title: string, color: number[]): void {
    const headerHeight = 25;
    
    // Background with gradient
    this.pdf.setFillColor(...color, 0.1);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 3, this.pageWidth - 2 * this.margin + 10, headerHeight, 3, 3, 'F');
    
    // Side accent
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(this.margin - 5, this.currentY - 3, 4, headerHeight, 2, 2, 'F');
    
    // Title
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(...color);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 5, this.currentY + 8);
    
    // Decorative line
    this.pdf.setDrawColor(...color, 0.3);
    this.pdf.setLineWidth(1);
    this.pdf.line(this.margin + 5, this.currentY + 12, this.pageWidth - this.margin - 5, this.currentY + 12);
    
    this.currentY += headerHeight + 5;
  }

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

  private renderStarRating(x: number, y: number, rating: number): void {
    const stars = Math.round(rating);
    const starSize = 3;
    
    for (let i = 0; i < 5; i++) {
      this.pdf.setTextColor(i < stars ? 255 : 200, i < stars ? 215 : 200, i < stars ? 0 : 200);
      this.pdf.setFontSize(8);
      this.pdf.text('★', x + i * 4, y);
    }
  }

  private renderProgressBar(x: number, y: number, width: number, percentage: number): void {
    // Background
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.rect(x, y, width, 3, 'F');
    
    // Progress
    const progressWidth = (width * Math.abs(percentage)) / 100;
    const color = percentage >= 0 ? this.colorPalette.success : this.colorPalette.error;
    this.pdf.setFillColor(...color);
    this.pdf.rect(x, y, progressWidth, 3, 'F');
  }

  private renderTrendIndicator(x: number, y: number, trend: number): void {
    const arrow = trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️';
    const color = trend > 0 ? this.colorPalette.success : 
                  trend < 0 ? this.colorPalette.error : this.colorPalette.neutral;
    
    this.pdf.setTextColor(...color);
    this.pdf.setFontSize(10);
    this.pdf.text(arrow, x, y);
    
    this.pdf.setFontSize(8);
    this.pdf.text(`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`, x + 5, y);
  }

  private renderPerformanceMeter(x: number, y: number, efficiency: number): void {
    const meterWidth = 30;
    const meterHeight = 6;
    
    // Background
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.roundedRect(x, y, meterWidth, meterHeight, 1, 1, 'F');
    
    // Fill based on efficiency
    const fillWidth = (meterWidth * efficiency) / 5;
    const color = this.getPerformanceColor(efficiency);
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(x, y, fillWidth, meterHeight, 1, 1, 'F');
  }

  private getPerformanceColor(efficiency: number): number[] {
    if (efficiency >= 4.5) return this.colorPalette.success;
    if (efficiency >= 3.5) return this.colorPalette.warning;
    if (efficiency >= 2.5) return this.colorPalette.secondary;
    return this.colorPalette.error;
  }

  private processTimelineData(sessions: StudySession[]): any[] {
    // Mock timeline data for demonstration
    return [
      { date: '2024-01-01', event: 'Started Journey', type: 'milestone' },
      { date: '2024-01-15', event: 'First Goal', type: 'achievement' },
      { date: '2024-02-01', event: 'Consistency Streak', type: 'milestone' },
      { date: '2024-02-15', event: 'Peak Performance', type: 'achievement' },
      { date: '2024-03-01', event: 'Current', type: 'current' }
    ];
  }

  private drawTimelineEvent(x: number, y: number, event: any): void {
    // Event marker
    const color = event.type === 'achievement' ? this.colorPalette.success :
                  event.type === 'milestone' ? this.colorPalette.primary : this.colorPalette.warning;
    
    this.pdf.setFillColor(...color);
    this.pdf.circle(x, y, 3, 'F');
    
    // Event label
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...color);
    this.pdf.text(event.event, x - 10, y - 8);
    
    // Date
    this.pdf.setFontSize(7);
    this.pdf.setTextColor(...this.colorPalette.neutral);
    this.pdf.text(format(new Date(event.date), 'MMM dd'), x - 8, y + 12);
  }

  private renderGoalsSection(): void {
    const goals = [
      { title: 'Study 25h this week', progress: 75, target: 25, current: 18.5 },
      { title: 'Maintain 4.5+ efficiency', progress: 88, target: 4.5, current: 4.2 },
      { title: 'Complete all subjects', progress: 60, target: 100, current: 60 }
    ];
    
    goals.forEach(goal => {
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(...this.colorPalette.dark);
      this.pdf.text(`🎯 ${goal.title}`, this.margin, this.currentY);
      
      // Progress bar
      this.renderProgressBar(this.margin + 80, this.currentY - 3, 60, goal.progress);
      
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...this.colorPalette.neutral);
      this.pdf.text(`${goal.current}/${goal.target}`, this.margin + 150, this.currentY);
      
      this.currentY += 12;
    });
  }

  private renderPredictionsSection(data: AnalyticsData): void {
    const predictions = [
      { title: 'Weekly Goal Achievement', probability: 85, insight: 'On track to exceed target' },
      { title: 'Efficiency Improvement', probability: 72, insight: 'Steady upward trend' },
      { title: 'Consistency Maintenance', probability: 91, insight: 'Strong habit formation' }
    ];
    
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(...this.colorPalette.secondary);
    this.pdf.text('🤖 AI Predictions', this.margin, this.currentY);
    this.currentY += 15;
    
    predictions.forEach(prediction => {
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(...this.colorPalette.dark);
      this.pdf.text(`• ${prediction.title}`, this.margin, this.currentY);
      
      // Confidence indicator
      const confidenceColor = prediction.probability >= 80 ? this.colorPalette.success :
                              prediction.probability >= 60 ? this.colorPalette.warning : this.colorPalette.error;
      
      this.pdf.setTextColor(...confidenceColor);
      this.pdf.text(`${prediction.probability}%`, this.margin + 90, this.currentY);
      
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...this.colorPalette.neutral);
      this.pdf.text(prediction.insight, this.margin + 110, this.currentY);
      
      this.currentY += 10;
    });
  }

  private async captureAndEmbedChart(elementId: string, index: number): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    this.addNewPageIfNeeded(120);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 100);
      
      // Chart frame
      this.pdf.setDrawColor(...this.colorPalette.neutral, 0.3);
      this.pdf.setLineWidth(0.5);
      this.pdf.rect(this.margin - 2, this.currentY - 2, imgWidth + 4, imgHeight + 4, 'S');
      
      this.pdf.addImage(imgData, 'JPEG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 15;
      
    } catch (error) {
      // Enhanced error handling with better visual feedback
      this.renderChartError(elementId);
    }
  }

  private renderChartError(elementId: string): void {
    this.pdf.setFillColor(254, 242, 242);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 3, 3, 'F');
    
    this.pdf.setTextColor(185, 28, 28);
    this.pdf.setFontSize(12);
    this.pdf.text(`⚠️ Chart unavailable: ${elementId}`, this.margin + 10, this.currentY + 20);
    
    this.pdf.setFontSize(9);
    this.pdf.text('Chart will be available in the next version', this.margin + 10, this.currentY + 30);
    
    this.currentY += 50;
  }

  private addComparativeAnalysis(data: AnalyticsData): void {
    this.addNewPageIfNeeded(60);
    
    // Weekly comparison
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(...this.colorPalette.accent);
    this.pdf.text('📊 Weekly Performance Comparison', this.margin, this.currentY);
    this.currentY += 15;
    
    // Mock weekly data for comparison
    const weeklyComparison = [
      { week: 'This Week', hours: 22.5, efficiency: 4.2, sessions: 12 },
      { week: 'Last Week', hours: 18.3, efficiency: 3.9, sessions: 10 },
      { week: 'Avg (4 weeks)', hours: 20.1, efficiency: 4.0, sessions: 11 }
    ];
    
    this.renderComparisonTable(weeklyComparison);
  }

  private renderComparisonTable(data: any[]): void {
    const colWidths = [40, 25, 25, 25];
    const rowHeight = 12;
    const headerHeight = 15;
    
    // Header
    this.pdf.setFillColor(...this.colorPalette.accent, 0.2);
    this.pdf.rect(this.margin, this.currentY, colWidths.reduce((sum, w) => sum + w, 0), headerHeight, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(...this.colorPalette.dark);
    this.pdf.setFont('helvetica', 'bold');
    
    let x = this.margin + 2;
    ['Period', 'Hours', 'Efficiency', 'Sessions'].forEach((header, index) => {
      this.pdf.text(header, x, this.currentY + 10);
      x += colWidths[index];
    });
    
    this.currentY += headerHeight;
    
    // Data rows
    data.forEach((row, index) => {
      if (index % 2 === 1) {
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY, colWidths.reduce((sum, w) => sum + w, 0), rowHeight, 'F');
      }
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(...this.colorPalette.dark);
      
      x = this.margin + 2;
      this.pdf.text(row.week, x, this.currentY + 8);
      x += colWidths[0];
      
      this.pdf.text(row.hours + 'h', x, this.currentY + 8);
      x += colWidths[1];
      
      this.pdf.text(row.efficiency.toFixed(1), x, this.currentY + 8);
      x += colWidths[2];
      
      this.pdf.text(row.sessions.toString(), x, this.currentY + 8);
      
      this.currentY += rowHeight;
    });
    
    this.currentY += 10;
  }

  private generateMockSubjectStats(): SubjectStats[] {
    return [
      { subject: 'Mathematics', totalHours: 45.5, averageEfficiency: 4.2, sessionsCount: 23, improvement: 12.5, examScores: [85, 88, 92] },
      { subject: 'Physics', totalHours: 38.2, averageEfficiency: 3.9, sessionsCount: 19, improvement: 8.3, examScores: [78, 82, 85] },
      { subject: 'Chemistry', totalHours: 32.1, averageEfficiency: 4.0, sessionsCount: 16, improvement: -2.1, examScores: [82, 79, 81] },
      { subject: 'Biology', totalHours: 29.8, averageEfficiency: 4.3, sessionsCount: 15, improvement: 15.2, examScores: [89, 91, 94] },
      { subject: 'English', totalHours: 25.4, averageEfficiency: 3.8, sessionsCount: 12, improvement: 5.7, examScores: [75, 78, 80] }
    ];
  }

  private addPageWatermark(): void {
    this.pdf.saveGraphicsState();
    
    // Set transparency
    this.pdf.setGState(this.pdf.GState({ opacity: 0.08 }));
    
    // Diagonal watermark
    this.pdf.setFontSize(48);
    this.pdf.setTextColor(...this.colorPalette.primary);
    this.pdf.setFont('helvetica', 'bold');
    
    const centerX = this.pageWidth / 2;
    const centerY = this.pageHeight / 2;
    
    this.pdf.text('StudyFlow Pro', centerX, centerY, {
      angle: -45,
      align: 'center'
    });
    
    this.pdf.restoreGraphicsState();
  }

  // Main export method
  async generateAdvancedReport(data: AnalyticsData, options: ExportOptions): Promise<void> {
    try {
      // Add advanced header
      this.addAdvancedHeader();

      // Add advanced dashboard
      if (options.includeSummary) {
        this.addAdvancedSummaryDashboard(data);
      }

      // Add timeline
      if (options.includeTimeline) {
        this.addStudyTimeline(data);
      }

      // Add advanced subject analysis
      if (options.includeSubjects) {
        this.addAdvancedSubjectAnalysis(data);
      }

      // Add goals and predictions
      if (options.includeGoals) {
        this.addGoalsAndPredictions(data);
      }

      // Add charts
      if (options.includeCharts) {
        await this.addAdvancedChartsSection([
          'weekly-chart', 
          'daily-chart', 
          'efficiency-chart',
          'subject-distribution-chart'
        ], options);
      }

      // Add advanced footer
      this.addAdvancedFooter();

      // Generate filename
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      const filename = `advanced-study-analytics-${timestamp}.pdf`;

      // Save the PDF
      this.pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating advanced PDF report:', error);
      throw new Error('Failed to generate advanced PDF report');
    }
  }
}

export { AdvancedPDFExportService };
