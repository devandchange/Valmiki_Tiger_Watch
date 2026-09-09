import QRCode from 'qrcode';

// In-memory cache to prevent redundant QR code generations
const qrCodeCache = new Map<string, string>();

/**
 * Constructs the canonical web URL linking back to the VTW conservation pledge page.
 * If a certificate number is provided, includes the verification query parameter.
 */
export function getPledgePageUrl(certificateNumber?: string): string {
  let baseUrl = '';

  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    // Handle standard browser environments (http or https)
    if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
      baseUrl = `${origin}${window.location.pathname}`;
    }
  }

  // Fallback to official domain if origin is unavailable or in non-web environment
  if (!baseUrl) {
    baseUrl = 'https://valmikitigerwatch.org';
  }

  // Remove any trailing slash to keep URL clean
  baseUrl = baseUrl.replace(/\/$/, '');

  if (certificateNumber && certificateNumber.trim().length > 0) {
    return `${baseUrl}?tab=pledge&cert=${encodeURIComponent(certificateNumber.trim())}`;
  }

  return `${baseUrl}?tab=pledge`;
}

/**
 * Generates a high-quality Data URL (PNG) representing the QR code
 * that links directly to the VTW Conservation Pledge page / verification.
 */
export async function generateCertificateQrCodeDataUrl(
  certificateNumber?: string,
  width: number = 240
): Promise<string> {
  const targetUrl = getPledgePageUrl(certificateNumber);
  const cacheKey = `${targetUrl}_${width}`;

  if (qrCodeCache.has(cacheKey)) {
    return qrCodeCache.get(cacheKey)!;
  }

  try {
    const dataUrl = await QRCode.toDataURL(targetUrl, {
      width,
      margin: 1,
      color: {
        dark: '#022C22', // Deep forest emerald
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    qrCodeCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch (err) {
    console.warn('Failed to generate certificate QR code:', err);
    // Fallback simple 1x1 transparent or empty string
    return '';
  }
}
