/**
 * Valmiki Tiger Watch - Native & Web Social Sharing Utility
 * Supports Capacitor native share sheet, navigator.share, WhatsApp, Facebook, and clipboard copy.
 */

export interface SharePayload {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}

export async function shareContent(payload: SharePayload): Promise<{ success: boolean; method: 'native' | 'whatsapp' | 'copied' | 'error' }> {
  const currentUrl = payload.url || (typeof window !== 'undefined' ? window.location.href : 'https://valmikitigerwatch.in');
  const shareText = `${payload.title}\n\n${payload.text}\n\nRead more on Valmiki Tiger Watch: ${currentUrl}`;

  // 1. Try Native Capacitor Share if running in Android app
  if (typeof window !== 'undefined' && (window as any).Capacitor?.isPluginAvailable?.('Share')) {
    try {
      const { Share } = (window as any).Capacitor.Plugins;
      await Share.share({
        title: payload.title,
        text: payload.text,
        url: currentUrl,
        dialogTitle: payload.dialogTitle || 'Share via Valmiki Tiger Watch'
      });
      return { success: true, method: 'native' };
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('Capacitor native share skipped:', e);
      }
    }
  }

  // 2. Try Standard Web Share API (Mobile Browsers / Desktop Safari & Edge)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: currentUrl
      });
      return { success: true, method: 'native' };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { success: false, method: 'native' }; // User dismissed sheet
      }
      console.warn('Navigator.share error, falling back:', e);
    }
  }

  // 3. Fallback: Copy to Clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'copied' };
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }

  return { success: false, method: 'error' };
}

export function openWhatsAppShare(title: string, url?: string, text?: string): void {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const message = encodeURIComponent(`*${title}*\n${text ? text + '\n' : ''}${currentUrl}\n\nValmiki Tiger Watch`);
  window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank', 'noopener,noreferrer');
}

export function openFacebookShare(url?: string): void {
  const currentUrl = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''));
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'noopener,noreferrer');
}
