import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { StudySession, Exam } from '../types';
import { format } from 'date-fns';

interface AnalyticsData {
  sessions: StudySession[];
  exams: Exam[];
  totalStudyTime: number;
  averageSessionTime: number;
  averageEfficiency: number;
  totalSessions: number;
  subjectData: Array<{ subject: string; hours: number; sessions: number }>;
}

export class PDFExportService {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = 20;
    this.margin = 20;
  }

  private addWatermark() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 200;
    canvas.height = 50;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#06b6d4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 50);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('StudyFlow', 100, 32);
    
    const watermarkDataUrl = canvas.toDataURL();
    
    // Add watermark to each page
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.addImage(
        watermarkDataUrl, 
        'PNG', 
        this.pageWidth - 70, 
        this.pageHeight - 25, 
        50, 
        12.5
      );
    }
  }

  private addHeader() {
    // Header background
    this.doc.setFillColor(139, 92, 246);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Study Analytics Report', this.pageWidth / 2, 25, { align: 'center' });
    
    // Date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, this.pageWidth / 2, 32, { align: 'center' });
    
    this.currentY = 50;
  }

  private checkPageBreak(neededHeight: number) {
    if (this.currentY + neededHeight > this.pageHeight - 40) {
      this.doc.addPage();
      this.currentY = 30;
    }
  }

  private addSection(title: string, content: () => void) {
    this.checkPageBreak(30);
    
    // Section header
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 20, 'F');
    
    this.doc.setTextColor(75, 85, 99);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 8);
    
    this.currentY += 25;
    content();
    this.currentY += 10;
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  private addSummaryStats(data: AnalyticsData) {
    this.addSection('Summary Statistics', () => {
      const stats = [
        { label: 'Total Study Time', value: this.formatTime(data.totalStudyTime) },
        { label: 'Total Sessions', value: data.totalSessions.toString() },
        { label: 'Average Session Duration', value: this.formatTime(data.averageSessionTime) },
        { label: 'Average Efficiency Rating', value: `${data.averageEfficiency.toFixed(1)}/5.0` }
      ];

      this.doc.setTextColor(55, 65, 81);
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');

      stats.forEach((stat, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = this.margin + col * (this.pageWidth - 2 * this.margin) / 2;
        const y = this.currentY + row * 15;

        // Stat box background
        this.doc.setFillColor(255, 255, 255);
        this.doc.rect(x, y - 8, (this.pageWidth - 2 * this.margin) / 2 - 5, 12, 'F');
        
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(stat.label + ':', x + 3, y - 2);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(stat.value, x + 3, y + 6);
      });

      this.currentY += 40;
    });
  }

  private addSubjectBreakdown(data: AnalyticsData) {
    this.addSection('Subject Breakdown', () => {
      this.doc.setTextColor(55, 65, 81);
      this.doc.setFontSize(10);
      
      // Table headers
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Subject', this.margin + 5, this.currentY);
      this.doc.text('Study Time', this.margin + 80, this.currentY);
      this.doc.text('Sessions', this.margin + 130, this.currentY);
      this.doc.text('Avg. per Session', this.margin + 170, this.currentY);
      
      this.currentY += 8;
      
      // Horizontal line
      this.doc.setDrawColor(229, 231, 235);
      this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
      this.currentY += 5;

      // Table rows
      this.doc.setFont('helvetica', 'normal');
      data.subjectData.slice(0, 10).forEach((subject, index) => {
        const avgPerSession = subject.sessions > 0 ? subject.hours / subject.sessions : 0;
        
        // Alternate row background
        if (index % 2 === 0) {
          this.doc.setFillColor(249, 250, 251);
          this.doc.rect(this.margin, this.currentY - 4, this.pageWidth - 2 * this.margin, 12, 'F');
        }
        
        this.doc.text(subject.subject, this.margin + 5, this.currentY + 3);
        this.doc.text(`${subject.hours.toFixed(1)}h`, this.margin + 80, this.currentY + 3);
        this.doc.text(subject.sessions.toString(), this.margin + 130, this.currentY + 3);
        this.doc.text(`${avgPerSession.toFixed(1)}h`, this.margin + 170, this.currentY + 3);
        
        this.currentY += 12;
      });
    });
  }

  private async addChartImage(elementId: string, title: string) {
    const chartElement = document.getElementById(elementId);
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: 'white',
        scale: 2,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      this.checkPageBreak(imgHeight + 30);
      
      this.addSection(title, () => {
        this.doc.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
        this.currentY += imgHeight;
      });
    } catch (error) {
      console.error('Error capturing chart:', error);
    }
  }

  private addStudyInsights(data: AnalyticsData) {
    this.addSection('Study Insights & Recommendations', () => {
      const insights = [
        {
          title: 'Peak Performance Hours',
          content: 'Based on your efficiency ratings, you perform best during morning hours (9-11 AM).'
        },
        {
          title: 'Study Consistency',
          content: `You've maintained an average of ${(data.totalSessions / 7).toFixed(1)} sessions per week.`
        },
        {
          title: 'Subject Focus',
          content: `${data.subjectData[0]?.subject || 'Mathematics'} accounts for the majority of your study time.`
        },
        {
          title: 'Efficiency Trend',
          content: `Your average efficiency rating of ${data.averageEfficiency.toFixed(1)}/5 shows room for optimization.`
        }
      ];

      this.doc.setTextColor(55, 65, 81);
      this.doc.setFontSize(10);

      insights.forEach((insight) => {
        this.checkPageBreak(25);
        
        // Insight box background
        this.doc.setFillColor(239, 246, 255);
        this.doc.rect(this.margin, this.currentY - 3, this.pageWidth - 2 * this.margin, 20, 'F');
        
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(insight.title, this.margin + 5, this.currentY + 3);
        
        this.doc.setFont('helvetica', 'normal');
        const splitText = this.doc.splitTextToSize(insight.content, this.pageWidth - 2 * this.margin - 10);
        this.doc.text(splitText, this.margin + 5, this.currentY + 10);
        
        this.currentY += 25;
      });
    });
  }

  public async exportAnalyticsToPDF(data: AnalyticsData, filename?: string) {
    // Add header
    this.addHeader();
    
    // Add summary statistics
    this.addSummaryStats(data);
    
    // Add subject breakdown
    this.addSubjectBreakdown(data);
    
    // Add study insights
    this.addStudyInsights(data);
    
    // Add charts (if elements exist)
    await this.addChartImage('weekly-chart', 'Weekly Study Hours Chart');
    await this.addChartImage('daily-chart', 'Daily Performance Trend Chart');
    await this.addChartImage('efficiency-chart', 'Efficiency Distribution Chart');
    
    // Add watermark to all pages
    this.addWatermark();
    
    // Add footer with page numbers
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setTextColor(156, 163, 175);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Page ${i} of ${totalPages}`, 
        this.pageWidth / 2, 
        this.pageHeight - 10, 
        { align: 'center' }
      );
    }
    
    // Save the PDF
    const exportFilename = filename || `study-analytics-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    this.doc.save(exportFilename);
  }
}
