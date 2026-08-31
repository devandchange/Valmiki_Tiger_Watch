import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'inline' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header', 
  className = '' 
}) => {
  const { language, setLanguage, languages } = useLanguage();

  if (variant === 'compact') {
    return (
      <div 
        role="radiogroup" 
        aria-label="Language Selector"
        className={`inline-flex items-center rounded-full bg-white/10 p-0.5 border border-white/20 ${className}`}
      >
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`Switch language to ${lang.label} (${lang.nativeName})`}
              id={`compact-lang-${lang.code}`}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all font-sans ${
                isActive
                  ? 'bg-[#F27D26] text-white shadow-sm font-bold'
                  : 'text-[#F5F1E6]/80 hover:text-white hover:bg-white/10 font-medium'
              }`}
              title={`Switch to ${lang.label} (${lang.nativeName})`}
            >
              {lang.nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs text-[#F5F1E6]/90 font-medium">
          <Globe className="w-4 h-4 text-[#F27D26]" />
          <span>Select Language / भाषा चुनें / زبان منتخب کریں:</span>
        </div>
        <div 
          role="radiogroup" 
          aria-label="Footer Language Selector"
          className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg border border-white/10"
        >
          {languages.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={`Select ${lang.label} (${lang.nativeName})`}
                id={`footer-lang-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#F27D26] text-white font-bold shadow-sm'
                    : 'text-[#F5F1E6]/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <span>{lang.nativeName}</span>
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default 'header' / 'inline' variant
  return (
    <div 
      role="radiogroup" 
      aria-label="Navbar Language Switcher"
      className={`inline-flex items-center gap-1 bg-[#F5F1E6] p-1 rounded-full border border-[#0B3D2E]/20 shadow-xs ${className}`}
    >
      <div className="pl-2 pr-0.5 text-[#0B3D2E]/70 flex items-center" title="Select Language">
        <Globe className="w-3.5 h-3.5 text-[#0B3D2E]" />
      </div>
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Switch language to ${lang.label} (${lang.nativeName})`}
            onClick={() => setLanguage(lang.code)}
            id={`lang-btn-${lang.code}`}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              isActive
                ? 'bg-[#0B3D2E] text-white shadow-xs font-bold'
                : 'text-[#0B3D2E]/80 hover:text-[#0B3D2E] hover:bg-white/70 font-medium'
            }`}
            title={`Switch to ${lang.label} (${lang.nativeName})`}
          >
            {lang.nativeName}
          </button>
        );
      })}
    </div>
  );
};

