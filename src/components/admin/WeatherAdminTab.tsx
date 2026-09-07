import React, { useState } from 'react';
import {
  CloudSun,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  KeyRound,
  MapPin,
  Clock,
  Bell,
  Layout,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Radio,
  Thermometer
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { WeatherAdminSettings } from '../../types';
import { VTR_WEATHER_ZONES } from '../../server/weatherService';

interface WeatherAdminTabProps {
  showToast: (msg: string) => void;
}

export const WeatherAdminTab: React.FC<WeatherAdminTabProps> = ({ showToast }) => {
  const {
    weatherSettings,
    updateWeatherSettings,
    weatherData,
    isWeatherLoading,
    weatherError,
    refreshWeather
  } = useData();

  // Local state for form editing
  const [provider, setProvider] = useState<'open-meteo' | 'custom'>(weatherSettings.provider || 'open-meteo');
  const [apiKey, setApiKey] = useState(weatherSettings.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [defaultZoneId, setDefaultZoneId] = useState(weatherSettings.defaultZoneId || 'valmikinagar');
  const [refreshIntervalMinutes, setRefreshIntervalMinutes] = useState(weatherSettings.refreshIntervalMinutes || 30);
  const [enableWeatherAlerts, setEnableWeatherAlerts] = useState(weatherSettings.enableWeatherAlerts ?? true);
  const [enableWeatherCard, setEnableWeatherCard] = useState(weatherSettings.enableWeatherCard ?? true);
  const [attribution, setAttribution] = useState(weatherSettings.dataSourceAttribution || 'Open-Meteo Weather API & WMO Global Observation System');
  
  // Custom coordinate overrides
  const selectedZone = VTR_WEATHER_ZONES.find(z => z.id === defaultZoneId) || VTR_WEATHER_ZONES[0];
  const [customLat, setCustomLat] = useState(selectedZone.latitude.toString());
  const [customLng, setCustomLng] = useState(selectedZone.longitude.toString());
  const [customElevation, setCustomElevation] = useState(selectedZone.elevationMeters.toString());

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleZoneChange = (zoneId: string) => {
    setDefaultZoneId(zoneId);
    const found = VTR_WEATHER_ZONES.find(z => z.id === zoneId);
    if (found) {
      setCustomLat(found.latitude.toString());
      setCustomLng(found.longitude.toString());
      setCustomElevation(found.elevationMeters.toString());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Partial<WeatherAdminSettings> = {
      provider,
      apiKey: apiKey.trim(),
      defaultZoneId,
      refreshIntervalMinutes: Number(refreshIntervalMinutes),
      enableWeatherAlerts,
      enableWeatherCard,
      dataSourceAttribution: attribution.trim(),
      lastUpdated: new Date().toISOString()
    };

    updateWeatherSettings(updated);
    showToast('Weather configuration saved and synchronized.');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset weather configuration to system defaults (Open-Meteo, Valmiki Nagar, 30 min refresh)?')) {
      setProvider('open-meteo');
      setApiKey('');
      setDefaultZoneId('valmikinagar');
      setRefreshIntervalMinutes(30);
      setEnableWeatherAlerts(true);
      setEnableWeatherCard(true);
      setAttribution('Open-Meteo Weather API & WMO Global Observation System');
      const defZone = VTR_WEATHER_ZONES[0];
      setCustomLat(defZone.latitude.toString());
      setCustomLng(defZone.longitude.toString());
      setCustomElevation(defZone.elevationMeters.toString());
      
      updateWeatherSettings({
        provider: 'open-meteo',
        apiKey: '',
        defaultZoneId: 'valmikinagar',
        refreshIntervalMinutes: 30,
        enableWeatherAlerts: true,
        enableWeatherCard: true,
        dataSourceAttribution: 'Open-Meteo Weather API & WMO Global Observation System',
        lastUpdated: new Date().toISOString()
      });
      showToast('Weather settings reset to default.');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      await refreshWeather();
      setTestResult({
        success: true,
        message: 'Successfully connected to weather service and updated live observations.'
      });
      showToast('Live weather data updated successfully.');
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to fetch weather data. Check network or configuration.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 text-emerald-100">
      {/* Top Banner */}
      <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20 mt-0.5">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span>Real-Time Weather System Configuration</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-300 font-normal">
                VTR Meteorology Engine
              </span>
            </h3>
            <p className="text-xs text-emerald-300/80 mt-1 max-w-2xl leading-relaxed">
              Configure real-time weather monitoring for Valmiki Tiger Reserve, West Champaran, Bihar. Manage Open-Meteo WMO telemetry, automated refresh intervals, safari advisories, and home card visibility.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || isWeatherLoading}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isTesting || isWeatherLoading ? 'animate-spin' : ''}`} />
            <span>{isTesting || isWeatherLoading ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Live System Diagnostics / Current Weather Card */}
      <div className="bg-[#07271D]/90 p-4 sm:p-5 rounded-2xl border border-emerald-800/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/40 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-300">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Active Telemetry Feed Status</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <span className={`w-2 h-2 rounded-full ${weatherData ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span>{weatherData ? (weatherData.cached ? 'Serving Cached/Live Data' : 'Live Upstream Connected') : 'Offline / Unavailable'}</span>
            </span>
          </div>
        </div>

        {weatherData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#0B3D2E] p-3 rounded-xl border border-emerald-800/40">
              <div className="text-[10px] text-emerald-400/80 uppercase">Station Location</div>
              <div className="text-sm font-bold text-white truncate mt-0.5">{weatherData.location.name}</div>
              <div className="text-[10px] text-emerald-300/70">{weatherData.location.latitude.toFixed(4)}°N, {weatherData.location.longitude.toFixed(4)}°E</div>
            </div>

            <div className="bg-[#0B3D2E] p-3 rounded-xl border border-emerald-800/40">
              <div className="text-[10px] text-emerald-400/80 uppercase">Current Temperature</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {weatherData.current.temperature !== undefined ? `${Math.round(weatherData.current.temperature)}°C` : 'N/A'}
              </div>
              <div className="text-[10px] text-emerald-300/70">Feels like {Math.round(weatherData.current.apparentTemperature)}°C</div>
            </div>

            <div className="bg-[#0B3D2E] p-3 rounded-xl border border-emerald-800/40">
              <div className="text-[10px] text-emerald-400/80 uppercase">Observed Condition</div>
              <div className="text-sm font-bold text-white truncate mt-0.5">
                {weatherData.current.condition.en}
              </div>
              <div className="text-[10px] text-emerald-300/70">Rain Prob: {weatherData.current.precipitationProbability}%</div>
            </div>

            <div className="bg-[#0B3D2E] p-3 rounded-xl border border-emerald-800/40">
              <div className="text-[10px] text-emerald-400/80 uppercase">Last Synchronized</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {new Date(weatherData.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[10px] text-emerald-300/70 truncate">{weatherData.dataSource}</div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-red-950/40 rounded-xl border border-red-800/40 text-xs text-red-300 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Weather telemetry currently unavailable. Click &apos;Test Connection&apos; to initiate a real-time fetch.</span>
          </div>
        )}

        {testResult && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            testResult.success ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200' : 'bg-red-950/60 border-red-700/60 text-red-200'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: API Provider & Key */}
          <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
              <Radio className="w-4 h-4" />
              <span>1. Weather API Provider & Service</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5">Selected Weather Service</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="open-meteo">Open-Meteo (Recommended • Real-time WMO Telemetry • Free & Reliable)</option>
                <option value="custom">Custom Provider / Secondary Weather Gateway</option>
              </select>
              <p className="text-[11px] text-emerald-400/70 mt-1 leading-relaxed">
                Open-Meteo provides hyper-accurate hourly and 7-day numerical forecasts for Valmiki Tiger Reserve coordinates without requiring proprietary API key quotas.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>API Key (Optional for Open-Meteo)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-[11px] font-mono text-emerald-400 hover:text-white flex items-center gap-1"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showApiKey ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Optional API key for commercial / enterprise proxies..."
                className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[10px] font-mono text-emerald-400/60 mt-1">
                Keys remain server-side and are never transmitted to client browsers.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5">
                Data Source Attribution Label
              </label>
              <input
                type="text"
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
                placeholder="e.g. Open-Meteo Weather API & WMO Global Observation System"
                className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[11px] text-emerald-400/70 mt-1">
                Public attribution displayed on weather badges and footer disclaimers.
              </p>
            </div>
          </div>

          {/* Column 2: Default Coordinates & Primary Location */}
          <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
              <MapPin className="w-4 h-4" />
              <span>2. Default Geographic Coordinates</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5">
                Primary Reference Zone (Default Location)
              </label>
              <select
                value={defaultZoneId}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {VTR_WEATHER_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.rangeName}) — {zone.latitude}°N, {zone.longitude}°E
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-400/70 mt-1">
                Valmiki Nagar (West Champaran, Bihar, India) serves as the primary meteorological reference point for VTR.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-emerald-300 mb-1">Latitude (°N)</label>
                <input
                  type="text"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-full p-2 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-emerald-300 mb-1">Longitude (°E)</label>
                <input
                  type="text"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  className="w-full p-2 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-emerald-300 mb-1">Elevation (m)</label>
                <input
                  type="text"
                  value={customElevation}
                  onChange={(e) => setCustomElevation(e.target.value)}
                  className="w-full p-2 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-[#0B3D2E]/80 rounded-xl border border-emerald-700/50 text-[11px] font-mono text-emerald-200">
              <span className="font-bold text-amber-300">Selected Range Info: </span>
              <span>{selectedZone.description}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Intervals and Display Toggles */}
        <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider border-b border-emerald-800 pb-2">
            <Clock className="w-4 h-4" />
            <span>3. Refresh Interval & Display Toggles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Refresh Interval */}
            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5">
                Automated Background Refresh Interval
              </label>
              <select
                value={refreshIntervalMinutes}
                onChange={(e) => setRefreshIntervalMinutes(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0B3D2E] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value={15}>Every 15 minutes (High frequency)</option>
                <option value={30}>Every 30 minutes (Default recommended)</option>
                <option value={45}>Every 45 minutes</option>
                <option value={60}>Every 60 minutes (1 Hour)</option>
                <option value={120}>Every 120 minutes (2 Hours)</option>
              </select>
              <p className="text-[11px] text-emerald-400/70 mt-1">
                Data is cached locally in browser storage (<code className="text-amber-300">vtw_weather_cache_v1</code>) and in the server proxy to ensure instant loads.
              </p>
            </div>

            {/* Toggle 1: Home Page Card */}
            <div className="p-4 bg-[#0B3D2E] rounded-xl border border-emerald-700/60 flex items-start space-x-3">
              <input
                type="checkbox"
                id="enableWeatherCard"
                checked={enableWeatherCard}
                onChange={(e) => setEnableWeatherCard(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-400 focus:ring-amber-400 focus:ring-offset-emerald-900"
              />
              <div>
                <label htmlFor="enableWeatherCard" className="text-xs font-bold text-white cursor-pointer block">
                  Enable Home Page Weather Card
                </label>
                <p className="text-[11px] text-emerald-300/80 mt-0.5 leading-relaxed">
                  Display the prominent VTR Real-Time Weather card directly below the main hero banner on the home page.
                </p>
              </div>
            </div>

            {/* Toggle 2: Weather Alerts */}
            <div className="p-4 bg-[#0B3D2E] rounded-xl border border-emerald-700/60 flex items-start space-x-3">
              <input
                type="checkbox"
                id="enableWeatherAlerts"
                checked={enableWeatherAlerts}
                onChange={(e) => setEnableWeatherAlerts(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-400 focus:ring-amber-400 focus:ring-offset-emerald-900"
              />
              <div>
                <label htmlFor="enableWeatherAlerts" className="text-xs font-bold text-white cursor-pointer block">
                  Enable Weather Advisories & Alerts
                </label>
                <p className="text-[11px] text-emerald-300/80 mt-0.5 leading-relaxed">
                  Calculate and present automated forest safari caution warnings for extreme rainfall (&gt;25mm), high heat (&gt;40°C), or dense winter fog.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 text-stone-950" />
            <span>Save Weather Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
