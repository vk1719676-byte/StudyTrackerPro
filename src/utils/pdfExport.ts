import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, filename: string = 'analytics-report') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Configure html2canvas for high quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling to fit page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    // Center the image
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // Add the main content
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    // Add advanced watermark
    addAdvancedWatermark(pdf, pdfWidth, pdfHeight);
    
    // Save the PDF
    pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

const addAdvancedWatermark = (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
  // Save current state
  pdf.saveGraphicsState();
  
  // Set transparency
  pdf.setGState(new pdf.GState({ opacity: 0.1 }));
  
  // Add diagonal watermark text
  pdf.setFontSize(60);
  pdf.setTextColor(139, 92, 246); // Violet color
  pdf.setFont('helvetica', 'bold');
  
  // Calculate center position
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Rotate and add main watermark
  pdf.text('StudyFlow Analytics', centerX, centerY, {
    angle: -45,
    align: 'center',
    baseline: 'middle'
  });
  
  // Add smaller watermark elements
  pdf.setFontSize(20);
  pdf.setGState(new pdf.GState({ opacity: 0.05 }));
  
  // Top corners
  pdf.text('StudyFlow', 20, 20, { angle: 0 });
  pdf.text('Premium Report', pageWidth - 20, 20, { angle: 0, align: 'right' });
  
  // Bottom corners
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10, { angle: 0 });
  pdf.text('studyflow.com', pageWidth - 20, pageHeight - 10, { angle: 0, align: 'right' });
  
  // Add subtle background pattern
  pdf.setGState(new pdf.GState({ opacity: 0.02 }));
  pdf.setFontSize(100);
  
  // Create pattern of faded logos
  for (let x = 0; x < pageWidth; x += 80) {
    for (let y = 0; y < pageHeight; y += 80) {
      pdf.text('SF', x, y, { angle: -30 });
    }
  }
  
  // Restore state
  pdf.restoreGraphicsState();
  
  // Add header with logo area and branding
  pdf.setGState(new pdf.GState({ opacity: 0.8 }));
  pdf.setFillColor(139, 92, 246);
  pdf.rect(0, 0, pageWidth, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('StudyFlow Analytics Dashboard', 10, 9);
  
  // Add generation timestamp
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - 10, 9, { align: 'right' });
  
  // Add footer
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text('Confidential Study Report', 10, pageHeight - 4);
  pdf.text('studyflow.com', pageWidth - 10, pageHeight - 4, { align: 'right' });
  
  pdf.restoreGraphicsState();
};
