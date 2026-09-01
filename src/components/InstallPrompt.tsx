import React from 'react';
import { useData } from '../context/DataContext';
import { Download, X, Smartphone, Globe, CheckCircle2, ShieldCheck, Wifi } from 'lucide-react';

interface InstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ isOpen, onClose }) => {
  const { canInstallPwa, installPwa } = useData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B3D2E] text-[#F5F1E6] max-w-lg w-full rounded-2xl border border-[#145A43] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#07271D] px-6 py-4 border-b border-emerald-900 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow bg-[#0B3D2E]">
              <img src="/icons/icon-192.png" alt="Valmiki Tiger Watch Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Install Valmiki Tiger Watch</h3>
              <p className="text-xs text-amber-400 font-mono">Progressive Web App (PWA)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Install Valmiki Tiger Watch directly on your home screen or desktop. No app store download required. Enjoy seamless offline access to tiger records, wildlife field guides, and emergency hotlines even when patrolling deep in remote forest tracts.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#07271D] rounded-xl border border-emerald-800/50 flex items-start space-x-2">
              <Wifi className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Offline Ready</span>
                <span className="text-[11px] text-emerald-300/80">Cached field guides & emergency contacts</span>
              </div>
            </div>
            <div className="p-3 bg-[#07271D] rounded-xl border border-emerald-800/50 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Zero Login Required</span>
                <span className="text-[11px] text-emerald-300/80">Immediate public conservation access</span>
              </div>
            </div>
          </div>

          {/* Quick Install Action if browser supported */}
          {canInstallPwa ? (
            <div className="pt-2">
              <button
                onClick={() => {
                  installPwa();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Add to Home Screen Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-[#07271D] p-4 rounded-xl border border-emerald-800/50 text-xs">
              <span className="font-semibold text-amber-300 block">How to install manually:</span>
              
              <div className="space-y-2 text-emerald-200/90">
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-amber-400 font-bold">1.</span>
                  <span><strong>iOS (Safari):</strong> Tap the <em>Share icon</em> (square with arrow) and select <strong>"Add to Home Screen"</strong>.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-amber-400 font-bold">2.</span>
                  <span><strong>Android (Chrome):</strong> Tap the <em>three dots menu</em> in the top right and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-amber-400 font-bold">3.</span>
                  <span><strong>Desktop (Chrome/Edge):</strong> Click the install icon in the address bar on the right side.</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs text-emerald-300/70 hover:text-emerald-200 underline font-mono"
            >
              Continue in Browser Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
