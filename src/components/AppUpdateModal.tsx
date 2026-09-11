import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  DownloadCloud, 
  RefreshCw, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  Smartphone,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { APP_CONFIG, APP_VERSION } from '../config/version';
import { checkForAppUpdates, openUpdateUrl, AppUpdateResult } from '../utils/appUpdateService';
import { useLanguage } from '../context/LanguageContext';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCheckOnOpen?: boolean;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  onClose,
  autoCheckOnOpen = true
}) => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'checking' | 'up_to_date' | 'update_available' | 'error'>('idle');
  const [updateResult, setUpdateResult] = useState<AppUpdateResult | null>(null);

  const runUpdateCheck = useCallback(async () => {
    setStatus('checking');
    try {
      const result = await checkForAppUpdates();
      setUpdateResult(result);
      if (!result.success) {
        setStatus('error');
      } else if (result.hasUpdate) {
        setStatus('update_available');
      } else {
        setStatus('up_to_date');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isOpen && autoCheckOnOpen) {
      runUpdateCheck();
    }
  }, [isOpen, autoCheckOnOpen, runUpdateCheck]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        id="app-update-modal-backdrop"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-update-dialog-title"
          className="relative z-10 w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#0B3D2E] text-white px-6 py-5 flex items-center justify-between border-b border-[#145A43]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#07271D] border border-emerald-600/40 flex items-center justify-center text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 id="app-update-dialog-title" className="font-display font-bold text-lg text-white">
                  {t('app.check_updates', 'Check for Updates')}
                </h3>
                <p className="text-xs text-emerald-200/80 font-mono">
                  Valmiki Tiger Watch • {APP_CONFIG.appId}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="app-update-close-btn"
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* 1. CHECKING / LOADING STATE */}
            {status === 'checking' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-[#0B3D2E] animate-spin" />
                  <RefreshCw className="w-6 h-6 text-[#0B3D2E] absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-stone-900">
                    {t('app.checking_updates', 'Checking for updates...')}
                  </h4>
                  <p className="text-xs text-stone-500 font-mono">
                    Querying official Valmiki Tiger Watch release channel...
                  </p>
                </div>
              </div>
            )}

            {/* 2. UP TO DATE STATE */}
            {status === 'up_to_date' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xl text-emerald-950">
                      {t('app.up_to_date', "You're up to date")}
                    </h4>
                    <p className="text-sm font-bold text-emerald-800 font-mono">
                      Version {APP_VERSION}
                    </p>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'आप वाल्मीकि टाइगर वॉच के नवीनतम आधिकारिक संस्करण का उपयोग कर रहे हैं। सभी फील्ड डेटा और ऑफलाइन क्षमताएं सक्रिय हैं।'
                      : language === 'ur'
                      ? 'آپ والمیکی ٹائیگر واچ کا تازہ ترین سرکاری ورژن استعمال کر رہے ہیں۔ تمام ڈیٹا اور آف لائن خصوصیات فعال ہیں۔'
                      : 'You are running the official release with active offline caching and verified Valmiki Tiger Reserve data.'}
                  </p>
                </div>

                {/* System Specs Pill */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                      Installed Build
                    </span>
                    <span className="font-bold text-stone-900">v{APP_VERSION} (code {APP_CONFIG.versionCode})</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 border-t border-stone-100 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Build Date
                    </span>
                    <span className="text-stone-700">{APP_CONFIG.buildDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 border-t border-stone-100 pt-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Release Channel
                    </span>
                    <span className="text-stone-700 truncate max-w-[200px]">{APP_CONFIG.githubRepo}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={runUpdateCheck}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-stone-600" />
                    <span>Check Again</span>
                  </button>

                  <button
                    onClick={() => openUpdateUrl(APP_CONFIG.githubReleasesUrl)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>View Releases Page</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. UPDATE AVAILABLE STATE */}
            {status === 'update_available' && updateResult && (
              <div className="space-y-6 animate-fade-in">
                {/* Alert Card */}
                <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F27D26] text-stone-950 font-bold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-stone-950" />
                      Update Ready
                    </span>
                    {updateResult.publishedAt && (
                      <span className="text-[11px] font-mono text-stone-500">
                        {new Date(updateResult.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-2xl text-stone-900">
                      {t('app.update_available', 'New version available')}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      A newer release of Valmiki Tiger Watch is available for your device.
                    </p>
                  </div>

                  {/* Version Comparison Box */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/80 border border-amber-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono block">
                        {t('app.current_version', 'Current version')}
                      </span>
                      <span className="font-mono font-bold text-base text-stone-700">
                        {updateResult.currentVersion}
                      </span>
                    </div>

                    <div className="bg-emerald-100/80 border border-emerald-300 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-mono font-bold block">
                        {t('app.latest_version', 'Latest version')}
                      </span>
                      <span className="font-mono font-bold text-base text-emerald-900">
                        {updateResult.latestVersion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Release Notes Preview */}
                {updateResult.releaseNotes && (
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Release Highlights ({updateResult.releaseName || `v${updateResult.latestVersion}`})
                    </span>
                    <div className="text-xs text-stone-600 max-h-32 overflow-y-auto whitespace-pre-wrap font-sans bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                      {updateResult.releaseNotes}
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="space-y-2">
                  <button
                    onClick={() => openUpdateUrl(updateResult.downloadUrl || updateResult.releaseUrl)}
                    id="app-update-now-btn"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0B3D2E] hover:bg-[#145A43] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <DownloadCloud className="w-5 h-5 text-amber-400" />
                    <span>{t('app.update_now', 'Update Now')}</span>
                  </button>

                  <p className="text-[11px] text-center text-stone-500 leading-normal px-2">
                    Opens the official release page. Android will let you confirm and install the update safely without background silent installations.
                  </p>
                </div>
              </div>
            )}

            {/* 4. ERROR / OFFLINE STATE */}
            {status === 'error' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-stone-900">
                      {t('app.update_error', 'Unable to check for updates. Please try again later.')}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                      Could not reach the update server. Your device may be offline or the official release service is temporarily unreachable.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Installed App Version</span>
                    <span className="font-bold text-stone-900">v{APP_VERSION}</span>
                  </div>
                  <div className="flex justify-between font-mono border-t border-stone-100 pt-2">
                    <span>Offline Status</span>
                    <span className="text-emerald-700 font-semibold">Reserve Data Active</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={runUpdateCheck}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={() => openUpdateUrl(APP_CONFIG.githubReleasesUrl)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Open GitHub Releases</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 text-center text-[11px] text-stone-500 font-mono">
            Valmiki Tiger Watch • Version {APP_VERSION}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
