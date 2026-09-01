import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertOctagon,
  Info,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const AlertsSection: React.FC = () => {
  const { alerts } = useData();
  const { language, isRtl } = useLanguage();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => 
    filterSeverity === 'all' || a.severity === filterSeverity
  );

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          badge: 'bg-red-600 text-white',
          border: 'border-red-500/80',
          bg: 'bg-red-950/10',
          iconBg: 'bg-red-100 text-red-700'
        };
      case 'warning':
        return {
          badge: 'bg-amber-500 text-black',
          border: 'border-amber-500/80',
          bg: 'bg-amber-950/10',
          iconBg: 'bg-amber-100 text-amber-800'
        };
      default:
        return {
          badge: 'bg-blue-600 text-white',
          border: 'border-blue-500/80',
          bg: 'bg-blue-950/10',
          iconBg: 'bg-blue-100 text-blue-800'
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi' ? 'फील्ड सुरक्षा एवं आपातकालीन परामर्श' : language === 'ur' ? 'ایمرجنسی و حفاظتی انتباہات' : 'Field Safety & Seasonal Advisories'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'प्रामाणिक वन विभाग बुलेटिन' : 'Official Forest Advisories'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          {language === 'hi' 
            ? 'संरक्षण परामर्श एवं रेंज सुरक्षा अलर्ट' 
            : language === 'ur'
            ? 'حفاظتی ایڈوائزری اور رینج الرٹس'
            : 'Conservation Advisories & Range Alerts'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'मौसमी बाढ़, सूखे के दौरान जंगल की आग की सतर्कता, और सीमांत कृषि बफर क्षेत्रों में बाघ व हाथी आवागमन के संबंध में आधिकारिक सुरक्षा सूचनाएं।'
            : language === 'ur'
            ? 'سیلابی صورتحال، جنگل میں آگ کے خطرات، اور بفر زون میں جنگلی جانوروں کی نقل و حرکت کے متعلق مصدقہ معلومات۔'
            : 'Verified safety bulletins regarding seasonal flood washouts, dry-season forest fire vigilance, and perimeter agricultural buffer movement protocols.'}
        </p>

        {/* 24/7 Helpline Box */}
        <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-red-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-red-600 text-white rounded-xl flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {language === 'hi' ? 'वीटीआर 24/7 आपातकालीन नियंत्रण कक्ष' : language === 'ur' ? '24/7 ایمرجنسی کنٹرول روم' : 'VTR 24/7 Emergency Control Room'}
              </span>
              <span className="text-red-200/80 text-[11px]">
                {language === 'hi' ? 'जंगल में आग, घायल वन्यजीव या भटकते बाघ की तत्काल सूचना दें' : 'For forest fire distress, injured wildlife, or tiger straying reports'}
              </span>
            </div>
          </div>
          <div className="font-mono text-amber-300 font-bold text-sm bg-black/40 px-3 py-1.5 rounded-xl border border-red-700/50">
            Toll-Free: 1800-345-6188
          </div>
        </div>
      </div>

      {/* Advisory Authenticity Banner */}
      <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-700 font-mono flex items-center gap-2.5">
        <Radio className="w-4 h-4 text-emerald-800 flex-shrink-0 animate-pulse" />
        <span>
          <strong>Authenticity Notice:</strong> All advisories reflect genuine seasonal protocols and forest department circulars. No fabricated or sensationalized alerts are ever published.
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {[
          { id: 'all', label: language === 'hi' ? 'सभी परामर्श' : 'All Advisories' },
          { id: 'critical', label: language === 'hi' ? 'अति महत्वपूर्ण' : 'Critical' },
          { id: 'warning', label: language === 'hi' ? 'सावधानी' : 'Warning' },
          { id: 'info', label: language === 'hi' ? 'सूचना' : 'Info' }
        ].map((sev) => (
          <button
            key={sev.id}
            onClick={() => setFilterSeverity(sev.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-colors ${
              filterSeverity === sev.id
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {sev.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border ${style.border} shadow-sm space-y-4`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${style.badge}`}>
                      {alert.severity} Level
                    </span>
                    <span className="font-mono text-xs text-stone-500 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 ml-1" />
                      Issued: {alert.date || alert.issuedDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>{alert.affectedRange}</span>
                    </span>
                    {alert.active ? (
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                        ACTIVE ADVISORY
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                        RESOLVED
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  {alert.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                  {alert.description}
                </p>

                <div className="pt-2 flex flex-wrap justify-between items-center text-xs text-stone-500 font-mono gap-2 border-t border-stone-100">
                  <span>Issued by: <strong>{alert.source || alert.issuingAuthority}</strong></span>
                  <span>Advisory Ref: #{alert.id.toUpperCase()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="font-display font-bold text-xl text-stone-900">
              {language === 'hi' ? 'इस श्रेणी में कोई सक्रिय चेतावनी नहीं है' : 'No Active Advisories in this Category'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {language === 'hi' 
                ? 'वर्तमान में सभी चयनित वन क्षेत्रों में स्थितियां सामान्य एवं सुरक्षित हैं।' 
                : 'All safari routes and buffer range sectors are currently operating under standard seasonal conditions.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
