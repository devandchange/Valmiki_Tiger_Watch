import html2canvasPro from 'html2canvas-pro';
import { toCanvas as htmlToImageCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { TigerPledgeCertificate, CertificateAdminSettings } from '../types';

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
 * Mathematically converts an oklch(...) color string to standard rgb(...) / rgba(...)
 * for Android WebView and canvas rendering engines that lack native OKLCH parser support.
 */
export function oklchToRgb(colorStr: string): string | null {
  const match = colorStr.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
  if (!match) return null;

  const rawL = match[1];
  const L = rawL.endsWith('%') ? parseFloat(rawL) / 100 : parseFloat(rawL);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);
  const rawA = match[4];
  const alpha = rawA ? (rawA.endsWith('%') ? parseFloat(rawA) / 100 : parseFloat(rawA)) : 1;

  if (isNaN(L) || isNaN(C) || isNaN(H)) return null;

  // OKLCH -> OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab -> LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS -> Linear sRGB
  const rLin = +4.0767434752 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Linear sRGB to standard gamma sRGB (0..255)
  const toSrgb = (c: number): number => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? Math.round(12.92 * clamped * 255)
      : Math.round((1.055 * Math.pow(clamped, 1 / 2.4) - 0.055) * 255);
  };

  const r = toSrgb(rLin);
  const g = toSrgb(gLin);
  const bVal = toSrgb(bLin);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${bVal})`;
}

/**
 * Normalizes any modern CSS color value (oklch, color-mix, lab, lch) to standard
 * RGB / RGBA hexadecimal notation using standalone mathematical conversion with canvas fallback.
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

  // 1. Precise mathematical conversion for OKLCH
  if (colorStr.includes('oklch')) {
    const converted = oklchToRgb(colorStr);
    if (converted) return converted;
  }

  // 2. Browser Canvas 2D test
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#010203';
      ctx.fillStyle = colorStr;
      if (ctx.fillStyle !== '#010203' && ctx.fillStyle !== 'rgb(1, 2, 3)') {
        return ctx.fillStyle; // Native browser successfully parsed it
      }
    }
  } catch {
    // Non-blocking fallback
  }
  return '#1C1917';
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
 * Ensures all web fonts, images, QR code, and signature assets inside the certificate
 * preview element are fully loaded and decoded in memory before capturing.
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

  // 2. Find all images inside the certificate element (QR code, logo, signature)
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
      setTimeout(finish, 2000);
    });
  });

  await Promise.all(imagePromises);

  // 3. Yield to ensure layout and styles are stabilized
  await new Promise((resolve) => setTimeout(resolve, 80));
}

/**
 * Validates that:
 * 1. Canvas is present and has meaningful dimensions
 * 2. Aspect ratio matches A4 landscape (width > height)
 */
export function isCanvasValidCertificate(canvas: HTMLCanvasElement): boolean {
  if (!canvas || canvas.width < 1200 || canvas.height < 800) {
    console.warn(`Canvas dimension check failed: ${canvas?.width}x${canvas?.height}`);
    return false;
  }
  // Must be A4 Landscape: width must be greater than height
  if (canvas.width <= canvas.height) {
    console.warn('Canvas must be landscape (width > height)');
    return false;
  }
  return true;
}

/**
 * Extracts a TigerPledgeCertificate from the DOM element or datasets if available.
 */
function extractCertificateFromElement(element: HTMLElement | null): TigerPledgeCertificate | null {
  if (!element) return null;
  try {
    const jsonStr =
      element.getAttribute('data-certificate-json') ||
      element.querySelector('[data-certificate-json]')?.getAttribute('data-certificate-json');
    if (jsonStr) {
      return JSON.parse(jsonStr) as TigerPledgeCertificate;
    }
  } catch {
    // Non-blocking
  }
  return null;
}

/**
 * Extracts CertificateAdminSettings from the DOM element or datasets if available.
 */
function extractSettingsFromElement(element: HTMLElement | null): CertificateAdminSettings | undefined {
  if (!element) return undefined;
  try {
    const jsonStr =
      element.getAttribute('data-settings-json') ||
      element.querySelector('[data-settings-json]')?.getAttribute('data-settings-json');
    if (jsonStr) {
      return JSON.parse(jsonStr) as CertificateAdminSettings;
    }
  } catch {
    // Non-blocking
  }
  return undefined;
}

/**
 * Single, unified certificate rendering function.
 * Exports the ORIGINAL preview component (CertificatePreview) EXACTLY as rendered in the UI.
 * Never redesigns the certificate.
 * Conforms strictly to A4 LANDSCAPE (never portrait) at ultra-high resolution (~3508 × 2480, 300 DPI).
 */
export async function renderCertificateToCanvas(
  element: HTMLElement | null,
  certificate?: TigerPledgeCertificate,
  _settings?: CertificateAdminSettings
): Promise<HTMLCanvasElement> {
  // 1. Locate the live CertificatePreview DOM element
  let targetElement = element;
  if (!targetElement && certificate?.certificateNumber) {
    targetElement = document.getElementById(`certificate-${certificate.certificateNumber}`);
  }
  if (!targetElement) {
    targetElement = document.querySelector('[id^="certificate-"]');
  }

  if (!targetElement) {
    throw new Error(
      'Certificate preview element not found. Please ensure the certificate preview is displayed on screen.'
    );
  }

  // 2. Ensure all fonts and images (QR code, logo, signature) inside CertificatePreview are ready
  await waitForCertificateReady(targetElement);

  // 3. Normalize modern color models so canvas engines render without errors
  sanitizeElementColors(targetElement);

  const effectiveCert = certificate || extractCertificateFromElement(targetElement);

  // 4. Standardize export canvas dimensions to A4 landscape (3508 × 2480, 300 DPI)
  // CRITICAL: Do NOT use the screenshot viewport width for export.
  // We uncouple export rendering from mobile/responsive screen sizes, giving the
  // certificate a full 1200px landscape layout before scaling to 3508px.
  const exportBaseWidth = 1200;
  const exportBaseHeight = 848; // Math.round(1200 / 1.414)
  const targetA4Width = 3508;
  const exportScale = targetA4Width / exportBaseWidth; // ~2.92333

  // Method 1 (Primary): html2canvas-pro on the live CertificatePreview element
  // Directly renders the DOM tree to 2D Canvas without attempting to read remote cross-origin CSS rules.
  try {
    const canvas = await html2canvasPro(targetElement, {
      scale: exportScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFAF5',
      logging: false,
      windowWidth: 1440,
      windowHeight: 1024,
      onclone: (clonedDoc) => {
        const cloned =
          clonedDoc.getElementById(targetElement!.id) ||
          clonedDoc.querySelector(`[id="${targetElement!.id}"]`) ||
          clonedDoc.querySelector('[data-certificate-number]');
        if (cloned) {
          const el = cloned as HTMLElement;
          // Standardize certificate dimensions to full landscape width (never screenshot viewport width)
          el.style.width = `${exportBaseWidth}px`;
          el.style.minWidth = `${exportBaseWidth}px`;
          el.style.maxWidth = `${exportBaseWidth}px`;
          el.style.height = `${exportBaseHeight}px`;
          el.style.minHeight = `${exportBaseHeight}px`;
          el.style.maxHeight = `${exportBaseHeight}px`;
          el.style.boxShadow = 'none';
          el.style.transform = 'none';

          // Ensure certificate number display has full width and zero clipping
          const certNumDisplay = el.querySelector('[data-certificate-number-display]') as HTMLElement | null;
          if (certNumDisplay) {
            certNumDisplay.style.overflow = 'visible';
            certNumDisplay.style.textOverflow = 'clip';
            certNumDisplay.style.whiteSpace = 'nowrap';
            certNumDisplay.style.width = 'max-content';
            certNumDisplay.style.minWidth = 'max-content';
            certNumDisplay.style.maxWidth = 'none';
            certNumDisplay.style.display = 'block';
            if (effectiveCert?.certificateNumber) {
              certNumDisplay.textContent = effectiveCert.certificateNumber;
            }
          }

          const certNumContainer = el.querySelector('[data-certificate-number-container]') as HTMLElement | null;
          if (certNumContainer) {
            certNumContainer.style.overflow = 'visible';
            certNumContainer.style.minWidth = 'max-content';
            certNumContainer.style.width = 'auto';
            certNumContainer.style.maxWidth = 'none';
          }

          // Fallback: search for certificate number text in any cloned child element
          if (!certNumDisplay && effectiveCert?.certificateNumber) {
            const allElements = el.querySelectorAll('*');
            for (const child of Array.from(allElements)) {
              if (child.textContent && child.textContent.includes(effectiveCert.certificateNumber)) {
                const htmlChild = child as HTMLElement;
                htmlChild.style.overflow = 'visible';
                htmlChild.style.textOverflow = 'clip';
                htmlChild.style.whiteSpace = 'nowrap';
                htmlChild.style.width = 'max-content';
                htmlChild.style.minWidth = 'max-content';
                htmlChild.style.maxWidth = 'none';
                htmlChild.textContent = effectiveCert.certificateNumber;
                break;
              }
            }
          }

          sanitizeElementColors(el);
        }
      }
    });

    if (canvas && isCanvasValidCertificate(canvas)) {
      return canvas;
    }
  } catch (proErr) {
    console.warn('html2canvas-pro render warning, attempting fallback:', proErr);
  }

  // Method 2 (Secondary Fallback): html-to-image toCanvas with skipFonts: true
  // Explicitly skips font downloading/parsing from document.styleSheets to avoid cross-origin cssRules security exceptions.
  try {
    const canvas = await htmlToImageCanvas(targetElement, {
      pixelRatio: exportScale,
      backgroundColor: '#FCFAF5',
      cacheBust: false,
      skipFonts: true,
      style: {
        boxShadow: 'none',
        margin: '0px',
        width: `${exportBaseWidth}px`,
        maxWidth: `${exportBaseWidth}px`,
        height: `${exportBaseHeight}px`
      }
    });

    if (canvas && isCanvasValidCertificate(canvas)) {
      return canvas;
    }
  } catch (imgErr) {
    console.warn('html-to-image canvas capture error:', imgErr);
  }

  throw new Error('Failed to generate complete certificate canvas. Please try again.');
}

/**
 * Standardized Certificate Filename Formatter:
 * Output: VTW-Certificate-[certificate-number].[ext]
 */
export function formatCertificateFilename(
  certNumber: string | undefined,
  ext: 'pdf' | 'jpg' | 'png',
  fallbackName?: string
): string {
  if (certNumber && certNumber.trim().length > 0) {
    const cleanNum = certNumber.trim().replace(/[^\w-]/g, '_');
    return `VTW-Certificate-${cleanNum}.${ext}`;
  }
  if (fallbackName && fallbackName.endsWith(`.${ext}`)) {
    return fallbackName;
  }
  return `VTW-Certificate.${ext}`;
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
 * Downloads the certificate as a high-resolution A4 LANDSCAPE JPG image (3508 × 2480).
 */
export async function downloadCertificateAsJpg(
  element: HTMLElement | null,
  filename?: string,
  quality: number = 0.98,
  certificate?: TigerPledgeCertificate,
  settings?: CertificateAdminSettings
): Promise<ExportResult> {
  try {
    const canvas = await renderCertificateToCanvas(element, certificate, settings);
    const effectiveCert = certificate || extractCertificateFromElement(element);
    const finalFilename = formatCertificateFilename(effectiveCert?.certificateNumber, 'jpg', filename);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob || blob.size < 5000) {
      return { success: false, error: 'Verification failed: Generated JPG image is incomplete or empty.' };
    }

    const base64 = await blobToBase64(blob);
    const result = await deliverFile(blob, base64, finalFilename, 'image/jpeg', 'download');
    return { ...result, format: 'jpg', filename: finalFilename };
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
 * Downloads the certificate as a high-resolution A4 LANDSCAPE PNG image (3508 × 2480).
 */
export async function downloadCertificateAsPng(
  element: HTMLElement | null,
  filename?: string,
  certificate?: TigerPledgeCertificate,
  settings?: CertificateAdminSettings
): Promise<ExportResult> {
  try {
    const canvas = await renderCertificateToCanvas(element, certificate, settings);
    const effectiveCert = certificate || extractCertificateFromElement(element);
    const finalFilename = formatCertificateFilename(effectiveCert?.certificateNumber, 'png', filename);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob || blob.size < 5000) {
      return { success: false, error: 'Verification failed: Generated PNG image is incomplete or empty.' };
    }

    const base64 = await blobToBase64(blob);
    const result = await deliverFile(blob, base64, finalFilename, 'image/png', 'download');
    return { ...result, format: 'png', filename: finalFilename };
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
 * Downloads the certificate element as an A4 LANDSCAPE PDF document (297mm × 210mm).
 */
export async function downloadCertificateAsPdf(
  element: HTMLElement | null,
  filename?: string,
  certificate?: TigerPledgeCertificate,
  settings?: CertificateAdminSettings
): Promise<ExportResult> {
  try {
    const canvas = await renderCertificateToCanvas(element, certificate, settings);
    const imgData = canvas.toDataURL('image/png');

    const effectiveCert = certificate || extractCertificateFromElement(element);
    const finalFilename = formatCertificateFilename(effectiveCert?.certificateNumber, 'pdf', filename);

    // Exact A4 landscape jsPDF configuration: width 297mm x height 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 landscape dimensions: 297mm width x 210mm height
    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      297,
      210,
      undefined,
      'FAST'
    );

    const pdfBlob = pdf.output('blob');
    if (!pdfBlob || pdfBlob.size < 5000) {
      return { success: false, error: 'Verification failed: Generated PDF document is incomplete or empty.' };
    }

    const base64 = await blobToBase64(pdfBlob);
    const result = await deliverFile(pdfBlob, base64, finalFilename, 'application/pdf', 'download');
    return { ...result, format: 'pdf', filename: finalFilename };
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
  element: HTMLElement | null,
  format: 'pdf' | 'jpg' | 'png' = 'pdf',
  customFilename?: string,
  certificate?: TigerPledgeCertificate,
  settings?: CertificateAdminSettings
): Promise<ExportResult> {
  try {
    const effectiveCert = certificate || extractCertificateFromElement(element);
    const finalFilename = formatCertificateFilename(effectiveCert?.certificateNumber, format, customFilename);

    const canvas = await renderCertificateToCanvas(element, certificate, settings);

    let blob: Blob | null = null;
    let mimeType: 'application/pdf' | 'image/jpeg' | 'image/png' = 'application/pdf';

    if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      blob = pdf.output('blob');
      mimeType = 'application/pdf';
    } else if (format === 'png') {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      mimeType = 'image/png';
    } else {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.98));
      mimeType = 'image/jpeg';
    }

    if (!blob || blob.size < 5000) {
      return { success: false, error: 'Verification failed: Generated share file is empty or corrupted.' };
    }

    const base64 = await blobToBase64(blob);
    return await deliverFile(blob, base64, finalFilename, mimeType, 'share');
  } catch (error: any) {
    console.error('Error sharing certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to prepare certificate for sharing.'
    };
  }
}

/**
 * Prints the certificate directly in A4 LANDSCAPE format (297mm × 210mm).
 */
export async function printCertificate(
  element: HTMLElement | null,
  title: string = 'Valmiki Tiger Watch Pledge Certificate',
  certificate?: TigerPledgeCertificate,
  settings?: CertificateAdminSettings
): Promise<ExportResult> {
  try {
    const isNative = Capacitor.isNativePlatform();
    const effectiveCert = certificate || extractCertificateFromElement(element);
    const finalFilename = formatCertificateFilename(effectiveCert?.certificateNumber, 'pdf');

    if (isNative) {
      return await shareCertificate(element, 'pdf', finalFilename, certificate, settings);
    }

    // Web browser printing: A4 Landscape
    const canvas = await renderCertificateToCanvas(element, certificate, settings);
    const imgData = canvas.toDataURL('image/png');

    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
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
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 297mm;
                  height: 210mm;
                  background-color: #FCFAF5;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                img {
                  width: 297mm;
                  height: 210mm;
                  max-width: 297mm;
                  max-height: 210mm;
                  object-fit: contain;
                  display: block;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <img src="${imgData}" onload="window.focus(); setTimeout(function() { window.print(); window.close(); }, 350);" />
            </body>
          </html>
        `);
        printWindow.document.close();
        return {
          success: true,
          message: 'Certificate print dialog opened.',
          filename: finalFilename
        };
      }
    } catch (winErr) {
      console.warn('Print popup blocked, falling back to direct window.print:', winErr);
    }

    // Direct browser print fallback
    window.print();
    return {
      success: true,
      message: 'Certificate print dialog opened.',
      filename: finalFilename
    };
  } catch (error: any) {
    console.error('Error printing certificate:', error);
    return {
      success: false,
      error: error?.message || 'Failed to open print dialog.'
    };
  }
}
