import html2pdf from 'html2pdf.js';

interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: string;
  orientation?: 'portrait' | 'landscape';
}

export const exportToPDF = async (
  elementId: string, 
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'StudyPro-Analytics-Report',
    quality = 1.0,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found for PDF export');
  }

  // Create a clone for export to avoid affecting the original
  const exportElement = element.cloneNode(true) as HTMLElement;
  exportElement.id = 'pdf-export-clone';
  
  // Apply export-specific styles
  exportElement.style.background = 'white';
  exportElement.style.padding = '40px';
  exportElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  // Remove hover effects and interactive elements for PDF
  const interactiveElements = exportElement.querySelectorAll('[class*="hover:"], [class*="transition-"], button');
  interactiveElements.forEach(el => {
    (el as HTMLElement).style.transition = 'none';
    (el as HTMLElement).style.transform = 'none';
  });

  // Add advanced watermark
  addAdvancedWatermark(exportElement);
  
  // Temporarily add to document for rendering
  document.body.appendChild(exportElement);
  exportElement.style.position = 'absolute';
  exportElement.style.left = '-9999px';
  exportElement.style.top = '0';

  try {
    const opt = {
      margin: [20, 20, 20, 20],
      filename: `${filename}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: quality },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: format, 
        orientation: orientation,
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'] 
      }
    };

    await html2pdf().set(opt).from(exportElement).save();
  } finally {
    // Clean up
    document.body.removeChild(exportElement);
  }
};

const addAdvancedWatermark = (element: HTMLElement): void => {
  // Create watermark container
  const watermarkContainer = document.createElement('div');
  watermarkContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;

  // Main diagonal watermark
  const mainWatermark = document.createElement('div');
  mainWatermark.innerHTML = `
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      font-weight: 900;
      color: rgba(139, 92, 246, 0.03);
      font-family: system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      user-select: none;
      text-transform: uppercase;
      letter-spacing: 8px;
    ">
      StudyPro Analytics
    </div>
  `;

  // Header watermark
  const headerWatermark = document.createElement('div');
  headerWatermark.innerHTML = `
    <div style="
      position: absolute;
      top: 10px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      color: rgba(139, 92, 246, 0.6);
      font-size: 12px;
      font-weight: 600;
    ">
      <div style="
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">SP</div>
      <span>StudyPro • Analytics Report</span>
    </div>
  `;

  // Footer watermark with timestamp
  const footerWatermark = document.createElement('div');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  footerWatermark.innerHTML = `
    <div style="
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-family: system-ui, -apple-system, sans-serif;
      color: rgba(107, 114, 128, 0.7);
      font-size: 10px;
      text-align: center;
      border-top: 1px solid rgba(139, 92, 246, 0.1);
      padding-top: 8px;
      width: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9), transparent);
    ">
      <div style="margin-bottom: 4px;">
        <strong>StudyPro Analytics Report</strong> • Generated on ${currentDate}
      </div>
      <div style="color: rgba(107, 114, 128, 0.5);">
        www.studypro.com • Confidential & Proprietary
      </div>
    </div>
  `;

  // Corner watermarks
  const cornerWatermarks = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  cornerWatermarks.forEach((corner, index) => {
    const cornerWatermark = document.createElement('div');
    const positions = {
      'top-left': 'top: 15px; left: 15px;',
      'top-right': 'top: 15px; right: 15px;',
      'bottom-left': 'bottom: 60px; left: 15px;',
      'bottom-right': 'bottom: 60px; right: 15px;'
    };

    cornerWatermark.innerHTML = `
      <div style="
        position: absolute;
        ${positions[corner as keyof typeof positions]}
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
        border: 2px solid rgba(139, 92, 246, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: rgba(139, 92, 246, 0.3);
        font-family: system-ui, -apple-system, sans-serif;
      ">
        SP
      </div>
    `;
    watermarkContainer.appendChild(cornerWatermark);
  });

  // Pattern watermark for background
  const patternWatermark = document.createElement('div');
  patternWatermark.innerHTML = `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.02) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.02) 2px, transparent 2px);
      background-size: 100px 100px;
      background-position: 0 0, 50px 50px;
    "></div>
  `;

  // Add all watermarks to container
  watermarkContainer.appendChild(mainWatermark);
  watermarkContainer.appendChild(headerWatermark);
  watermarkContainer.appendChild(footerWatermark);
  watermarkContainer.appendChild(patternWatermark);

  // Make element relative for absolute positioning of watermarks
  element.style.position = 'relative';
  element.appendChild(watermarkContainer);
};

export const showExportSuccess = (): void => {
  // Create success notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 600;
    animation: slideIn 0.3s ease-out forwards;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">✓</div>
      PDF Report Generated Successfully!
    </div>
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
};
