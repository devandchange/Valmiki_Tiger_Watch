import React, { useState } from 'react';
import {
  Compass,
  Droplets,
  Wind,
  CloudRain,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Clock,
  Sun,
  Sunset,
  Sunrise,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Thermometer,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { WeatherIcon } from '../WeatherIcon';

export const WeatherSection: React.FC = () => {
  const {
    weatherData,
    isWeatherLoading,
    weatherError,
    refreshWeather,
    selectedWeatherZone,
    setSelectedWeatherZone,
    weatherSettings
  } = useData();
  const { t, language } = useLanguage();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isManualRefreshing || isWeatherLoading) return;
    setIsManualRefreshing(true);
    try {
      await refreshWeather(true);
    } finally {
      setTimeout(() => setIsManualRefreshing(false), 700);
    }
  };

  const formatClockTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getConditionText = (condition?: { en: string; hi: string; ur: string }) => {
    if (!condition) return '';
    if (language === 'hi') return condition.hi;
    if (language === 'ur') return condition.ur;
    return condition.en;
  };

  const activeAlerts = (weatherData?.alerts || []).filter(
    (a) => !weatherSettings || weatherSettings.enableWeatherAlerts !== false
  );

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header with Zone Selector */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <Radio className="h-3 w-3 animate-pulse" />
                  REAL-TIME METEOROLOGICAL OBSERVATIONS
                </span>
                <span className="rounded-full border border-stone-700 bg-stone-800/80 px-2.5 py-0.5 text-xs text-stone-300">
                  Open-Meteo VTR
                </span>
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {t('weather.title')}
              </h1>
              <p className="mt-1 text-stone-300 text-sm sm:text-base">
                {t('weather.subtitle')} • {t('weather.location_note')}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  {weatherData?.location?.coordinates
                    ? `${weatherData.location.coordinates.latitude.toFixed(4)}°N, ${weatherData.location.coordinates.longitude.toFixed(4)}°E`
                    : '27.4283°N, 83.9015°E'}
                </span>
                <span>•</span>
                <span>Elevation: ~135m MSL</span>
              </div>
            </div>

            {/* Zone Selector & Refresh Control */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex flex-col">
                <label htmlFor="reserve-zone-selector" className="text-[11px] font-medium text-stone-400 mb-1">
                  {t('weather.select_zone')}
                </label>
                <select
                  id="reserve-zone-selector"
                  value={selectedWeatherZone}
                  onChange={(e) => setSelectedWeatherZone(e.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-800/90 px-3.5 py-2 text-xs font-medium text-stone-200 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="valmikinagar">Valmiki Nagar Core (Main Gate)</option>
                  <option value="manguraha">Manguraha Forest Range</option>
                  <option value="gobardhana">Gobardhana Range (Highlands)</option>
                  <option value="harnatanr">Harnatanr Buffer &amp; Grasslands</option>
                </select>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isManualRefreshing || isWeatherLoading}
                className="self-end sm:self-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-semibold text-stone-200 shadow hover:border-amber-500 hover:bg-stone-750 hover:text-white disabled:opacity-50 transition-all mt-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isManualRefreshing || isWeatherLoading ? 'animate-spin text-amber-400' : 'text-stone-400'
                  }`}
                />
                <span>
                  {isManualRefreshing || isWeatherLoading ? t('weather.refreshing') : t('weather.refresh')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Severe Weather Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="rounded-2xl border border-amber-500/50 bg-amber-950/30 p-5 backdrop-blur-md shadow-lg">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-amber-300">
                    {language === 'hi'
                      ? activeAlerts[0].titleHi
                      : language === 'ur'
                      ? activeAlerts[0].titleUr
                      : activeAlerts[0].titleEn}
                  </h2>
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    {activeAlerts[0].severity}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-stone-300 leading-relaxed">
                  {language === 'hi'
                    ? activeAlerts[0].descriptionHi
                    : language === 'ur'
                    ? activeAlerts[0].descriptionUr
                    : activeAlerts[0].descriptionEn}
                </p>
                {activeAlerts[0].precautions && activeAlerts[0].precautions.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-200/90 border-t border-amber-500/30 pt-3">
                    {activeAlerts[0].precautions.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Conditions Showcase */}
        {weatherError && !weatherData?.current ? (
          <div className="rounded-3xl border border-stone-800 bg-stone-900 p-12 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-stone-500" />
            <h2 className="mt-4 text-lg font-bold text-white">{t('weather.unavailable')}</h2>
            <p className="mt-2 text-sm text-stone-400">{weatherError}</p>
            <button
              onClick={handleRefresh}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t('weather.retry')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Current Metrics Box */}
            <div className="lg:col-span-8 rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 backdrop-blur shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                    Live Forest Conditions
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    {weatherData?.location?.referencePoint || 'Valmiki Nagar Core Gate'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-800/80 rounded-full px-3.5 py-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    Observed: {formatClockTime(weatherData?.current?.time || weatherData?.fetchedAt)}
                  </span>
                </div>
              </div>

              {/* Temperature & Icon Big Display */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl border border-stone-700 bg-gradient-to-br from-stone-800 to-stone-900 shadow-inner">
                    <WeatherIcon
                      condition={weatherData?.current?.condition}
                      isDay={weatherData?.current?.isDay}
                      className="h-14 w-14 sm:h-16 sm:w-16"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
                        {weatherData?.current?.temperature !== undefined
                          ? `${Math.round(weatherData.current.temperature)}°C`
                          : '--'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-stone-400">
                      {t('weather.feels_like')}{' '}
                      <span className="text-base font-semibold text-stone-200">
                        {weatherData?.current?.apparentTemperature !== undefined
                          ? `${Math.round(weatherData.current.apparentTemperature)}°C`
                          : '--'}
                      </span>
                    </div>
                    <div className="mt-1 text-base font-bold text-amber-400">
                      {getConditionText(weatherData?.current?.condition)}
                    </div>
                  </div>
                </div>

                {/* Sun Position (Sunrise & Sunset) */}
                <div className="w-full sm:w-auto rounded-2xl border border-stone-800 bg-stone-950/60 p-4 sm:min-w-[200px]">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-800/80 pb-2 mb-3">
                    Solar Cycle (VTR)
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-stone-300">
                        <Sunrise className="h-4 w-4 text-amber-400" />
                        <span>{t('weather.sunrise')}</span>
                      </span>
                      <span className="font-semibold text-white">
                        {formatClockTime(weatherData?.current?.sunrise)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-stone-300">
                        <Sunset className="h-4 w-4 text-orange-400" />
                        <span>{t('weather.sunset')}</span>
                      </span>
                      <span className="font-semibold text-white">
                        {formatClockTime(weatherData?.current?.sunset)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <CloudRain className="h-4 w-4 text-blue-400" />
                    <span>{t('weather.rain_prob')}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.precipitationProbability !== undefined
                      ? `${weatherData.current.precipitationProbability}%`
                      : '0%'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    Precipitation: {weatherData?.current?.precipitation || 0} mm
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Droplets className="h-4 w-4 text-cyan-400" />
                    <span>{t('weather.humidity')}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.relativeHumidity !== undefined
                      ? `${weatherData.current.relativeHumidity}%`
                      : '--'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    Dewpoint ~
                    {weatherData?.current?.temperature && weatherData?.current?.relativeHumidity
                      ? `${Math.round(
                          weatherData.current.temperature -
                            (100 - weatherData.current.relativeHumidity) / 5
                        )}°C`
                      : '--'}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Wind className="h-4 w-4 text-emerald-400" />
                    <span>{t('weather.wind')}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.windSpeed !== undefined
                      ? `${Math.round(weatherData.current.windSpeed)} km/h`
                      : '--'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400 flex items-center gap-1">
                    <Compass className="h-3 w-3 text-stone-400" />
                    <span>
                      {weatherData?.current?.windDirectionCardinal || 'Variable'}{' '}
                      ({weatherData?.current?.windDirection ?? 0}°)
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Eye className="h-4 w-4 text-amber-400" />
                    <span>{t('weather.visibility')}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.visibilityKm !== undefined
                      ? `${weatherData.current.visibilityKm.toFixed(1)} km`
                      : '10.0 km'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    {weatherData?.current?.visibilityKm && weatherData.current.visibilityKm < 3
                      ? 'Restricted by mist/fog'
                      : 'Clear forest sightlines'}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Sun className="h-4 w-4 text-orange-400" />
                    <span>{t('weather.uv_index')}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.uvIndex !== undefined
                      ? weatherData.current.uvIndex.toFixed(1)
                      : '0.0'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    {weatherData?.current?.uvIndex && weatherData.current.uvIndex >= 6
                      ? 'High canopy exposure'
                      : 'Moderate / Safe'}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                  <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Thermometer className="h-4 w-4 text-red-400" />
                    <span>Atmospheric Status</span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-white">
                    {weatherData?.current?.isDay ? 'Diurnal Phase' : 'Nocturnal Phase'}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    VTR Tiger Habitat
                  </div>
                </div>
              </div>
            </div>

            {/* Side Overview / Quick Safari Guidance */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 backdrop-blur shadow-xl">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Safari &amp; Visiting Conditions</span>
                </h2>
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                    <span className="font-semibold text-emerald-400 block mb-1">
                      Jeep Safaris (Valmiki Nagar)
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      {weatherData?.current?.precipitation && weatherData.current.precipitation > 5
                        ? 'Forest tracks may be muddy. Safari gypsies operate under Forest Department caution.'
                        : 'Forest tracks are in good condition. Standard morning (6:00 - 9:30 AM) and evening (3:00 - 6:00 PM) safaris recommended.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                    <span className="font-semibold text-cyan-400 block mb-1">
                      Gandak River Boat Patrols
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      {weatherData?.current?.windSpeed && weatherData.current.windSpeed > 35
                        ? 'Brisk river winds recorded. River excursions require life-vest precautions.'
                        : 'River waters steady. Good conditions for aquatic fauna, gharials, and riverine birds.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                    <span className="font-semibold text-amber-400 block mb-1">
                      Tiger Sighting Probabilities
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      {t('weather.impact_tigers_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Source Badge */}
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5 text-xs text-stone-400">
                <div className="flex items-center gap-2 font-semibold text-stone-200">
                  <Info className="h-4 w-4 text-amber-400" />
                  <span>{t('weather.source')}</span>
                </div>
                <p className="mt-2 text-stone-300 leading-relaxed">
                  Real-time meteorological observations provided via Open-Meteo High-Resolution Numerical Weather Prediction (NWP) model with WMO ground-station reconciliation for Valmiki Tiger Reserve.
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-stone-800/80 pt-2.5 text-[11px]">
                  <span>TTL Cache: 10 mins</span>
                  <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                  >
                    <span>Open-Meteo.com</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 24-Hour Hourly Forecast Section */}
        {weatherData?.hourly && weatherData.hourly.length > 0 && (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 backdrop-blur shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">{t('weather.hourly_title')}</h2>
              </div>
              <span className="text-xs text-stone-400">Next 24 Hours Interval</span>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-3 pt-1 w-full max-w-full touch-pan-x scrollbar-thin scrollbar-thumb-stone-700">
              {weatherData.hourly.map((item, idx) => {
                const hourDate = new Date(item.time);
                const hourLabel = hourDate.toLocaleTimeString(
                  language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-IN',
                  { hour: 'numeric', hour12: true }
                );
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between rounded-2xl border border-stone-800 bg-stone-950/60 p-3.5 min-w-[96px] text-center shrink-0 hover:border-amber-500/40 transition-colors"
                  >
                    <span className="text-xs font-semibold text-stone-300">{hourLabel}</span>
                    <div className="my-3 flex h-10 w-10 items-center justify-center">
                      <WeatherIcon
                        condition={item.condition}
                        isDay={item.isDay}
                        className="h-8 w-8"
                      />
                    </div>
                    <span className="text-base font-extrabold text-white">
                      {Math.round(item.temperature)}°C
                    </span>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-400">
                      <CloudRain className="h-3 w-3" />
                      <span>{item.precipitationProbability}%</span>
                    </div>
                    <span className="mt-1 text-[10px] text-stone-400">
                      {Math.round(item.windSpeed)} km/h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7-Day Extended Forecast Section */}
        {weatherData?.daily && weatherData.daily.length > 0 && (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 backdrop-blur shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">{t('weather.daily_title')}</h2>
              </div>
              <span className="text-xs text-stone-400">Next 7 Days Forecast</span>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3.5">
              {weatherData.daily.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div className="border-b border-stone-800/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      {idx === 0 ? 'Today' : formatDateDisplay(day.date).split(',')[0]}
                    </span>
                    <span className="text-[11px] text-stone-400">{day.date}</span>
                  </div>

                  <div className="my-4 flex items-center justify-center">
                    <WeatherIcon condition={day.condition} className="h-10 w-10" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold text-stone-200">
                      {getConditionText(day.condition)}
                    </div>
                    <div className="mt-1.5 flex items-baseline justify-center gap-2">
                      <span className="text-base font-extrabold text-white">
                        {Math.round(day.temperatureMax)}°
                      </span>
                      <span className="text-xs text-stone-400">
                        {Math.round(day.temperatureMin)}°C
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-stone-800/80 pt-2.5 space-y-1 text-[11px] text-stone-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-blue-400">
                        <CloudRain className="h-3 w-3" />
                        <span>Rain</span>
                      </span>
                      <span className="font-semibold text-stone-200">
                        {day.precipitationProbabilityMax}%
                      </span>
                    </div>
                    {day.precipitationSum > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Amt:</span>
                        <span className="text-stone-300">{day.precipitationSum.toFixed(1)} mm</span>
                      </div>
                    )}
                    {day.uvIndexMax !== undefined && (
                      <div className="flex items-center justify-between">
                        <span>Max UV:</span>
                        <span className="text-stone-300">{day.uvIndexMax.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wildlife & Visitor Information Guidance Section */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl">
          <div className="border-b border-stone-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>{t('weather.wildlife_title')}</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-white">
              Ecological Weather Influence &amp; Forest Advisory
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              {t('weather.wildlife_subtitle')}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tiger Sighting & Behaviour */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>{t('weather.impact_tigers')}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t('weather.impact_tigers_desc')}
              </p>
            </div>

            {/* Herbivore Movement */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <span>{t('weather.impact_wildlife')}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t('weather.impact_wildlife_desc')}
              </p>
            </div>

            {/* Safaris & Excursions */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                <span>{t('weather.impact_safaris')}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t('weather.impact_safaris_desc')}
              </p>
            </div>

            {/* Forest Roads & Tracks */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-orange-400 flex items-center gap-2">
                <span>{t('weather.impact_roads')}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t('weather.impact_roads_desc')}
              </p>
            </div>

            {/* Visitor Safety & Hydration */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <span>{t('weather.impact_safety')}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t('weather.impact_safety_desc')}
              </p>
            </div>

            {/* Rainfall & Forest Ecology */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
              <h3 className="text-base font-bold text-indigo-400 flex items-center gap-2">
                <span>Gandak Basin &amp; Forest Hydrology</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Valmiki&apos;s bhabar and terai soils absorb significant rainfall, nourishing dense cane brakes, sal forest, and elephant corridors. Always respect temporary seasonal zoning closures declared by the VTR Field Director.
              </p>
            </div>
          </div>

          {/* Mandatory Disclaimer Box */}
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200/90 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 uppercase tracking-wider block mb-0.5">
                Official Advisory Disclaimer
              </span>
              <p className="leading-relaxed">
                {t('weather.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
