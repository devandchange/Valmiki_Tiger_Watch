import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Phone, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  BellRing,
  Info,
  Radio
} from 'lucide-react';

interface ConservationAlertBannerProps {
  className?: string;
  allowDismiss?: boolean;
  compact?: boolean;
}

export const ConservationAlertBanner: React.FC<ConservationAlertBannerProps> = ({
  className = '',
  allowDismiss = true,
  compact = false
}) => {
  const { alerts, setActiveTab, activeTab } = useData();
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Filter only active alerts
  const activeAlerts = alerts.filter(a => a.active);

  // If no active alerts or user dismissed, return null (unless user is viewing alerts page where full table is shown)
  if (activeAlerts.length === 0 || isDismissed) {
    return null;
  }

  // Ensure current index is within bounds
  const alertIndex = currentIndex % activeAlerts.length;
  const currentAlert = activeAlerts[alertIndex];

  const getSeverityStyles = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          wrapper: 'bg-red-950/95 border-red-500/80 text-red-50 shadow-md shadow-red-950/20',
          badge: 'bg-red-600 text-white animate-pulse',
          iconBg: 'bg-red-500/20 text-red-300 border border-red-500/40',
          accentText: 'text-red-300',
          metaText: 'text-red-200/80',
          btn: 'bg-red-600 hover:bg-red-500 text-white'
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-950/90 border-amber-500/70 text-amber-50 shadow-md shadow-amber-950/20',
          badge: 'bg-amber-500 text-amber-950 font-bold',
          iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          accentText: 'text-amber-300',
          metaText: 'text-amber-200/80',
          btn: 'bg-amber-500 hover:bg-amber-400 text-black'
        };
      default:
        return {
          wrapper: 'bg-[#0B3D2E] border-emerald-500/60 text-emerald-50 shadow-md shadow-emerald-950/20',
          badge: 'bg-emerald-600 text-white',
          iconBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          accentText: 'text-emerald-300',
          metaText: 'text-emerald-200/80',
          btn: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        };
    }
  };

  const styles = getSeverityStyles(currentAlert.severity);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAlerts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAlerts.length) % activeAlerts.length);
  };

  return (
    <div 
      id="conservation-alert-banner"
      role="region" 
      aria-label="Wildlife and Forest Conservation Alert"
      className={`w-full max-w-full rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden ${styles.wrapper} ${className}`}
    >
      <div className="p-3 sm:p-4.5 w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Icon & Alert Content */}
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${styles.iconBg}`}>
              {currentAlert.severity === 'critical' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              {/* Header Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {currentAlert.severity}
                </span>

                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-white">
                  <Radio className="w-3 h-3 animate-pulse text-amber-400" />
                  {language === 'hi' ? 'वन एवं वन्यजीव परामर्श' : language === 'ur' ? 'تحفظی انتباہ' : 'Forest & Wildlife Advisory'}
                </span>

                {activeAlerts.length > 1 && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/30 text-stone-200">
                    {alertIndex + 1} / {activeAlerts.length}
                  </span>
                )}

                <span className={`text-xs font-mono hidden md:inline-flex items-center gap-1 ${styles.metaText}`}>
                  <Clock className="w-3 h-3" />
                  <span>{currentAlert.issuedDate}</span>
                </span>

                {currentAlert.affectedRange && (
                  <span className={`text-xs font-mono hidden md:inline-flex items-center gap-1 ${styles.metaText}`}>
                    <MapPin className="w-3 h-3" />
                    <span>{currentAlert.affectedRange}</span>
                  </span>
                )}
              </div>

              {/* Alert Title & Description */}
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-snug break-words">
                  {currentAlert.title}
                </h4>
                {!compact && (
                  <p className={`text-xs leading-relaxed line-clamp-3 sm:line-clamp-none mt-0.5 break-words ${styles.metaText}`}>
                    {currentAlert.description}
                  </p>
                )}
              </div>

              {/* Authority & Emergency hotline */}
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] font-mono text-stone-300 pt-0.5 break-words">
                <span>
                  <strong>Issuing Authority:</strong> {currentAlert.issuingAuthority || 'Bihar Forest Department & VTR Field Directorate'}
                </span>
                <span className="hidden sm:inline opacity-50">•</span>
                <a 
                  href="tel:18003456188" 
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors underline decoration-amber-400/50 underline-offset-2"
                >
                  <Phone className="w-3 h-3" />
                  <span>VTR Control: 1800-345-6188</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Carousel Controls, Action Button & Dismiss */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
            {activeAlerts.length > 1 && (
              <div className="flex items-center gap-1 bg-black/30 rounded-xl p-0.5 border border-white/10">
                <button
                  onClick={handlePrev}
                  title="Previous Alert"
                  aria-label="Previous Alert"
                  className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  title="Next Alert"
                  aria-label="Next Alert"
                  className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-xs ${styles.btn}`}
            >
              <span>
                {language === 'hi' ? 'सभी परामर्श' : language === 'ur' ? 'تمام الرٹس' : 'View Advisories'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {allowDismiss && (
              <button
                onClick={() => setIsDismissed(true)}
                title="Dismiss banner"
                aria-label="Dismiss alert banner"
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
