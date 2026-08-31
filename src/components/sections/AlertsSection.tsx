import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertOctagon,
  Info
} from 'lucide-react';

export const AlertsSection: React.FC = () => {
  const { alerts } = useData();
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
          bg: 'bg-red-950/10'
        };
      case 'warning':
        return {
          badge: 'bg-amber-500 text-black',
          border: 'border-amber-500/80',
          bg: 'bg-amber-950/10'
        };
      default:
        return {
          badge: 'bg-blue-600 text-white',
          border: 'border-blue-500/80',
          bg: 'bg-blue-950/10'
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Field Safety & Emergency Advisories</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Conservation Advisories & Range Alerts
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Real-time safety bulletins regarding seasonal flood washouts, dry-season forest fire vigilance, and perimeter agricultural buffer movement protocols.
        </p>

        {/* 24/7 Helpline Box */}
        <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-red-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 text-white rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">VTR 24/7 Emergency Control Room</span>
              <span>For forest fire distress, injured wildlife, or tiger straying reports</span>
            </div>
          </div>
          <div className="font-mono text-amber-300 font-bold text-sm bg-black/40 px-3 py-1.5 rounded-xl border border-red-700/50">
            Toll-Free: 1800-345-6188
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['all', 'critical', 'warning', 'info'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-colors ${
              filterSeverity === sev
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {sev === 'all' ? 'All Advisories' : sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border ${style.border} shadow-sm space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${style.badge}`}>
                    {alert.severity} Level
                  </span>
                  <span className="font-mono text-xs text-stone-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Issued: {alert.date}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                    Range: {alert.affectedRange}
                  </span>
                  {alert.active ? (
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      RESOLVED
                    </span>
                  )}
                </div>
              </div>

              <h2 className="font-display font-bold text-xl text-stone-900">
                {alert.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {alert.description}
              </p>

              <div className="pt-2 flex flex-wrap justify-between items-center text-xs text-stone-500 font-mono gap-2">
                <span>Issued by: <strong>{alert.source}</strong></span>
                <span>Advisory Ref: #{alert.id.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
