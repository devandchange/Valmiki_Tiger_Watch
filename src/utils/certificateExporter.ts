import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportResult {
  success: boolean;
  error?: string;
  filename?: string;
}

/**
 * Ensures all images and fonts inside the certificate element are fully loaded
 * before running html2canvas to guarantee no missing logos or signatures.
 */
async function waitForElementReady(element: HTMLElement): Promise<void> {
  // 1. Wait for document web fonts if available
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-blocking
    }
  }

  // 2. Find and wait for all images inside the certificate
  const images = Array.from(element.querySelectorAll('img'));
  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const onDone = () => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        resolve();
      };
      img.addEventListener('load', onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
      // Fallback timeout in case image never triggers event
      setTimeout(onDone, 2000);
    });
  });

  await Promise.all(imagePromises);

  // Small frame yield to let browser complete paint cycle
  await new Promise((resolve) => setTimeout(resolve, 60));
}

/**
 * Downloads the certificate element as a high-resolution JPG image.
 * Uses 3x DPI scaling for print-ready clarity and preserves exact certificate proportions.
 */
export async function downloadCertificateAsJpg(
  element: HTMLElement,
  filename: string = 'Valmiki-Tiger-Watch-Pledge-Certificate.jpg',
  quality: number = 0.98
): Promise<ExportResult> {
  try {
    await waitForElementReady(element);

    const canvas = await html2canvas(element, {
      scale: 3, // 3x scale for crisp 300 DPI equivalent print clarity
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ success: false, error: 'Could not generate JPG image data.' });
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
          resolve({ success: true, filename });
        },
        'image/jpeg',
        quality
      );
    });
  } catch (error: any) {
    console.error('Error generating JPG certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate JPG certificate. Please try again.'
    };
  }
}

/**
 * Downloads the certificate element as a high-resolution A4 PDF document.
 * Automatically fits the standard A4 landscape proportions (297x210 mm) without distortion.
 */
export async function downloadCertificateAsPdf(
  element: HTMLElement,
  filename: string = 'Valmiki-Tiger-Watch-Pledge-Certificate.pdf',
  forceOrientation?: 'portrait' | 'landscape'
): Promise<ExportResult> {
  try {
    await waitForElementReady(element);

    const isLandscape =
      forceOrientation === 'landscape' ||
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

    return { success: true, filename };
  } catch (error: any) {
    console.error('Error generating PDF certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PDF certificate. Please try again.'
    };
  }
}

/**
 * Downloads the certificate element as a high-resolution PNG image.
 */
export async function downloadCertificateAsPng(
  element: HTMLElement,
  filename: string = 'Valmiki-Tiger-Watch-Pledge-Certificate.png'
): Promise<ExportResult> {
  try {
    await waitForElementReady(element);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Could not generate PNG image data.' });
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
        resolve({ success: true, filename });
      }, 'image/png');
    });
  } catch (error: any) {
    console.error('Error generating PNG certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PNG certificate. Please try again.'
    };
  }
}
