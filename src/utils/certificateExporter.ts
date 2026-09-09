import html2canvasPro from 'html2canvas-pro';
import { toCanvas as htmlToImageCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface ExportResult {
  success: boolean;
  error?: string;
  filename?: string;
  isNative?: boolean;
  uri?: string;
  size?: number;
  format?: 'pdf' | 'jpg' | 'png';
  message?: string;
}

/**
 * Strips the data URI scheme if present, returning pure base64 string
 */
function cleanBase64(dataUrlOrBase64: string): string {
  const idx = dataUrlOrBase64.indexOf('base64,');
  if (idx !== -1) {
    return dataUrlOrBase64.substring(idx + 7);
  }
  return dataUrlOrBase64;
}

/**
 * Converts a Blob to a pure Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      resolve(cleanBase64(res));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Normalizes any modern CSS color value (oklch, color-mix, lab, lch) to standard
 * RGB / RGBA hexadecimal notation using native browser canvas context.
 */
export function normalizeColorToRgb(colorStr: string): string {
  if (!colorStr) return colorStr;
  if (
    !colorStr.includes('oklch') &&
    !colorStr.includes('color-mix') &&
    !colorStr.includes('lab') &&
    !colorStr.includes('lch')
  ) {
    return colorStr;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorStr;
      return ctx.fillStyle; // Native browser returns "rgb(...)" or "rgba(...)"
    }
  } catch {
    // Non-blocking fallback
  }
  return '#000000';
}

/**
 * Sanitizes an entire DOM tree by converting any modern/unsupported color values
 * (oklch, color-mix, lab, lch) to standard rgb/rgba/hex on all elements.
 */
export function sanitizeElementColors(rootElement: HTMLElement): void {
  const COLOR_PROPS: (keyof CSSStyleDeclaration)[] = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor'
  ];

  const elements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))] as HTMLElement[];

  for (const el of elements) {
    if (!el.style) continue;

    // Check and normalize inline styles
    for (const prop of COLOR_PROPS) {
      const val = el.style[prop] as string;
      if (
        val &&
        (val.includes('oklch') || val.includes('color-mix') || val.includes('lab') || val.includes('lch'))
      ) {
        (el.style as any)[prop] = normalizeColorToRgb(val);
      }
    }

    // Check and normalize computed styles
    try {
      const computed = window.getComputedStyle(el);
      for (const prop of COLOR_PROPS) {
        const val = computed[prop] as string;
        if (
          val &&
          (val.includes('oklch') || val.includes('color-mix') || val.includes('lab') || val.includes('lch'))
        ) {
          (el.style as any)[prop] = normalizeColorToRgb(val);
        }
      }
    } catch {
      // Non-blocking
    }
  }
}

/**
 * Ensures all web fonts, images, and signature assets inside the certificate
 * element are fully loaded and decoded in memory before rendering.
 */
export async function waitForCertificateReady(element: HTMLElement): Promise<void> {
  // 1. Wait for document fonts if available
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-blocking fallback
    }
  }

  // 2. Find all images inside the certificate element
  const images = Array.from(element.querySelectorAll('img'));
  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const finish = () => {
        img.removeEventListener('load', finish);
        img.removeEventListener('error', finish);
        resolve();
      };
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
      // Fallback timeout in case event does not fire
      setTimeout(finish, 2000);
    });
  });

  await Promise.all(imagePromises);

  // 3. Small paint frame yield to ensure DOM layout and styles are stabilized
  await new Promise((resolve) => setTimeout(resolve, 80));
}

/**
 * Single, unified certificate rendering function.
 * Generates an ultra-crisp 3x DPI canvas from the exact same DOM element
 * displayed in the live preview.
 *
 * Employs dual-engine fallback:
 * 1. Primary: html2canvas-pro (native oklch/lab/color-mix support + onclone sanitization)
 * 2. Fallback: html-to-image (native foreignObject rendering)
 */
export async function renderCertificateToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  await waitForCertificateReady(element);

  // Attempt 1: Primary render with html2canvas-pro
  try {
    const canvas = await html2canvasPro(element, {
      scale: 3, // 300 DPI equivalent for print-grade sharpness
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      imageTimeout: 15000,
      windowWidth: 1024,
      windowHeight: 768,
      onclone: (clonedDoc) => {
        const cloned = clonedDoc.getElementById(element.id);
        if (cloned) {
          cloned.style.visibility = 'visible';
          cloned.style.display = 'block';
          cloned.style.width = '842px';
          cloned.style.minWidth = '842px';
          cloned.style.maxWidth = '842px';
          cloned.style.height = '595px';
          cloned.style.minHeight = '595px';
          cloned.style.maxHeight = '595px';
          cloned.style.transform = 'none';
          cloned.style.boxSizing = 'border-box';

          // Deeply sanitize cloned certificate elements to eliminate any oklch
          sanitizeElementColors(cloned);
        }

        // Sanitize any style sheets in the cloned document that might contain oklch
        try {
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach((s) => {
            if (s.textContent && (s.textContent.includes('oklch') || s.textContent.includes('color-mix'))) {
              s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, (match) => {
                return normalizeColorToRgb(match) || '#000000';
              });
            }
          });
        } catch {
          // Non-blocking
        }
      }
    });

    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (proErr) {
    console.warn('html2canvas-pro render encountered an issue, falling back to html-to-image:', proErr);
  }

  // Attempt 2: Fallback to html-to-image
  try {
    const fallbackCanvas = await htmlToImageCanvas(element, {
      backgroundColor: '#FCFAF5',
      pixelRatio: 3,
      canvasWidth: 842 * 3,
      canvasHeight: 595 * 3,
      cacheBust: false
    });

    if (fallbackCanvas && fallbackCanvas.width > 0 && fallbackCanvas.height > 0) {
      return fallbackCanvas;
    }
  } catch (fallbackErr) {
    console.error('All certificate canvas rendering strategies failed:', fallbackErr);
    throw new Error('Failed to render certificate. Please ensure all images and fonts have loaded.');
  }

  throw new Error('Failed to generate high-resolution certificate canvas.');
}

/**
 * Saves or shares generated file with comprehensive support for:
 * 1. Android APK (via Capacitor Filesystem + Native Share Sheet)
 * 2. Mobile Browsers (via Web Share API or direct download)
 * 3. Desktop Browsers (via standard Blob <a download>)
 */
async function deliverFile(
  blob: Blob,
  base64Data: string,
  filename: string,
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png',
  action: 'download' | 'share' | 'print'
): Promise<ExportResult> {
  const isNative = Capacitor.isNativePlatform();

  // ==========================================
  // ANDROID APK / CAPACITOR NATIVE ENVIRONMENT
  // ==========================================
  if (isNative) {
    try {
      // 1. Write file to Cache directory
      const cacheResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true
      });

      // 2. Also save to Documents directory for permanent device storage
      await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      }).catch((e) => console.warn('Could not mirror to Documents directory:', e));

      // 3. Strict zero-byte and existence verification
      const stat = await Filesystem.stat({
        path: filename,
        directory: Directory.Cache
      });

      if (!stat || stat.size === 0) {
        throw new Error('Verification failed: Generated file is empty or missing on device.');
      }

      // 4. Prompt Android Native Dialog to Open, Save, or Share
      await Share.share({
        title: 'Valmiki Tiger Watch Pledge Certificate',
        text: 'Official Tiger Protection Pledge Certificate issued by Valmiki Tiger Watch.',
        url: cacheResult.uri,
        dialogTitle: action === 'share' ? 'Share Certificate' : 'Save / Open Certificate'
      });

      return {
        success: true,
        filename,
        isNative: true,
        uri: cacheResult.uri,
        size: stat.size,
        message: 'Certificate saved and ready to open or share.'
      };
    } catch (err: any) {
      console.error('Capacitor native file handling error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to save certificate to Android storage.',
        isNative: true
      };
    }
  }

  // ==========================================
  // WEB BROWSER / DESKTOP / PREVIEW ENVIRONMENT
  // ==========================================
  if (action === 'share' && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Valmiki Tiger Watch Pledge Certificate',
          text: 'Official Tiger Protection Pledge Certificate',
          files: [file]
        });
        return { success: true, filename, isNative: false, message: 'Certificate shared successfully.' };
      }
    } catch (shareErr: any) {
      // If user cancelled or browser denied share, continue to standard download fallback
      if (shareErr?.name === 'AbortError') {
        return { success: true, filename, isNative: false, message: 'Share action cancelled.' };
      }
    }
  }

  // Standard Web Download Trigger
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);

    return {
      success: true,
      filename,
      isNative: false,
      size: blob.size,
      message: 'Certificate downloaded successfully.'
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to initiate download in browser.',
      isNative: false
    };
  }
}

/**
 * Downloads the certificate element as a high-resolution JPG image.
 */
export async function downloadCertificateAsJpg(
  element: HTMLElement,
  filename: string = 'Valmiki-Tiger-Watch-Pledge-Certificate.jpg',
  quality: number = 0.98
): Promise<ExportResult> {
  try {
    const canvas = await renderCertificateToCanvas(element);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) {
      return { success: false, error: 'Failed to create JPG image blob.' };
    }

    const base64 = await blobToBase64(blob);
    const result = await deliverFile(blob, base64, filename, 'image/jpeg', 'download');
    return { ...result, format: 'jpg' };
  } catch (error: any) {
    console.error('Error generating JPG certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate JPG certificate. Please try again.',
      format: 'jpg'
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
    const canvas = await renderCertificateToCanvas(element);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) {
      return { success: false, error: 'Failed to create PNG image blob.' };
    }

    const base64 = await blobToBase64(blob);
    const result = await deliverFile(blob, base64, filename, 'image/png', 'download');
    return { ...result, format: 'png' };
  } catch (error: any) {
    console.error('Error generating PNG certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PNG certificate. Please try again.',
      format: 'png'
    };
  }
}

/**
 * Downloads the certificate element as a high-resolution A4 Landscape PDF document.
 */
export async function downloadCertificateAsPdf(
  element: HTMLElement,
  filename: string = 'Valmiki-Tiger-Watch-Pledge-Certificate.pdf'
): Promise<ExportResult> {
  try {
    const canvas = await renderCertificateToCanvas(element);
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 Landscape dimensions: 297mm x 210mm
    const pdfWidth = 297;
    const pdfHeight = 210;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const pdfBlob = pdf.output('blob');
    const base64 = await blobToBase64(pdfBlob);

    const result = await deliverFile(pdfBlob, base64, filename, 'application/pdf', 'download');
    return { ...result, format: 'pdf' };
  } catch (error: any) {
    console.error('Error generating PDF certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PDF certificate. Please try again.',
      format: 'pdf'
    };
  }
}

/**
 * Shares the certificate file using native Android Share Sheet or Web Share API.
 */
export async function shareCertificate(
  element: HTMLElement,
  format: 'pdf' | 'jpg' | 'png' = 'pdf',
  customFilename?: string
): Promise<ExportResult> {
  try {
    const filename = customFilename || (
      format === 'pdf' ? 'Valmiki-Tiger-Watch-Pledge-Certificate.pdf' :
      format === 'png' ? 'Valmiki-Tiger-Watch-Pledge-Certificate.png' :
      'Valmiki-Tiger-Watch-Pledge-Certificate.jpg'
    );

    const canvas = await renderCertificateToCanvas(element);

    let blob: Blob | null = null;
    let mimeType: 'application/pdf' | 'image/jpeg' | 'image/png' = 'application/pdf';

    if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      blob = pdf.output('blob');
      mimeType = 'application/pdf';
    } else if (format === 'png') {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      mimeType = 'image/png';
    } else {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.98));
      mimeType = 'image/jpeg';
    }

    if (!blob) {
      return { success: false, error: 'Could not generate certificate data to share.' };
    }

    const base64 = await blobToBase64(blob);
    return await deliverFile(blob, base64, filename, mimeType, 'share');
  } catch (error: any) {
    console.error('Error sharing certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to share certificate.'
    };
  }
}

/**
 * Prints the certificate directly.
 * In desktop/web browser, opens an isolated high-resolution print window.
 * In Android APK (where window.print is restricted), shares the PDF/JPG so
 * the user can print using Android Print Service or their connected printer.
 */
export async function printCertificate(
  element: HTMLElement,
  title: string = 'Valmiki Tiger Watch Pledge Certificate'
): Promise<ExportResult> {
  try {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // In Android WebView, window.print() is often unsupported or broken.
      // We generate the PDF and open the native system share/print dialog.
      return await shareCertificate(element, 'pdf', 'Valmiki-Tiger-Watch-Pledge-Certificate.pdf');
    }

    // Web browser printing
    const canvas = await renderCertificateToCanvas(element);
    const imgData = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Popup blocked, fallback to downloading PDF
      return await downloadCertificateAsPdf(element);
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #FCFAF5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            img {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" onload="window.focus(); window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();

    return {
      success: true,
      message: 'Certificate print dialog opened.'
    };
  } catch (error: any) {
    console.error('Error printing certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to open print dialog.'
    };
  }
}
