import React, { useState } from 'react';
import { WifiOff, ChevronRight, X, ShieldCheck, Database } from 'lucide-react';
import { useData } from '../context/DataContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useData();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // If online, don't display
  if (isOnline) {
    return null;
  }

  // If user dismissed current toast, show a subtle floating badge instead
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 md:bottom-6 left-4 z-40 flex items-center gap-2 bg-[#0B3D2E]/95 border border-amber-500/60 text-amber-300 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-xs font-mono transition-all hover:bg-[#07271D]"
        title="Operating in offline field mode"
      >
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline Mode Active</span>
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 max-w-sm w-[calc(100%-1.5rem)] sm:w-auto bg-[#0B3D2E]/95 text-stone-100 border border-amber-500/60 rounded-xl shadow-2xl p-3 backdrop-blur-md transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 flex-shrink-0 mt-0.5">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white font-display">Offline Field Mode</h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono font-semibold">
                  Cached Data
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-snug">
                You are offline in remote terrain. All tiger profiles, safari zones, maps, and field guides remain available.
              </p>
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="mt-1.5 text-[10px] text-amber-300 hover:text-amber-200 underline font-mono flex items-center gap-1"
              >
                <span>{isDetailsOpen ? 'Hide cached info' : 'View cached resources'}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${isDetailsOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-stone-400 hover:text-stone-200 p-1 -mr-1 -mt-1 rounded hover:bg-black/20"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isDetailsOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-emerald-800/80 text-[11px] text-emerald-200/90 space-y-1.5 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Database className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>Full species catalog & identification keys cached</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span>Forest division emergency hotlines & zones available</span>
            </div>
            <div className="text-[10px] text-stone-400 pt-1">
              Data auto-syncs when cellular signal returns.
            </div>
          </div>
        )}
      </div>
    </>
  );
};
