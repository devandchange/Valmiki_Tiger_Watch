import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Downloads an HTML element as a high-resolution PNG image.
 * Uses high pixel ratio scale (e.g. 3) to achieve print-ready 300 DPI equivalent clarity.
 */
export async function downloadCertificateAsPng(
  element: HTMLElement,
  filename: string = 'Valmiki_Tiger_Protection_Pledge_Certificate.png'
): Promise<ExportResult> {
  try {
    // Generate high-DPI canvas
    const canvas = await html2canvas(element, {
      scale: 3, // 3x scale for crisp printing & retina displays
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    // Convert to high-res PNG blob and trigger download
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Failed to generate PNG blob.' });
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve({ success: true });
      }, 'image/png');
    });
  } catch (error: any) {
    console.error('Error generating PNG certificate:', error);
    return { success: false, error: error?.message || 'Error generating PNG' };
  }
}

/**
 * Downloads an HTML element as a high-resolution A4 PDF.
 * Automatically selects landscape (297x210mm) or portrait (210x297mm) based on element aspect ratio.
 */
export async function downloadCertificateAsPdf(
  element: HTMLElement,
  filename: string = 'Valmiki_Tiger_Protection_Pledge_Certificate.pdf',
  forceOrientation?: 'portrait' | 'landscape'
): Promise<ExportResult> {
  try {
    const isLandscape = forceOrientation === 'landscape' || 
      (forceOrientation !== 'portrait' && element.scrollWidth >= element.scrollHeight);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const orientation = isLandscape ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = isLandscape ? 297 : 210;
    const pdfHeight = isLandscape ? 210 : 297;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(filename);

    return { success: true };
  } catch (error: any) {
    console.error('Error generating PDF certificate:', error);
    return { success: false, error: error?.message || 'Error generating PDF' };
  }
}
