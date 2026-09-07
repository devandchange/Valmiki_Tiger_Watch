import React, { useState } from 'react';
import {
  Compass,
  Droplets,
  Wind,
  CloudRain,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { WeatherIcon } from '../WeatherIcon';

export const WeatherCard: React.FC = () => {
  const {
    weatherData,
    isWeatherLoading,
    weatherError,
    refreshWeather,
    weatherSettings,
    setActiveTab
  } = useData();
  const { t, language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // If weather card is disabled in admin settings, do not render
  if (weatherSettings && !weatherSettings.enableWeatherCard) {
    return null;
  }

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshing || isWeatherLoading) return;
    setIsRefreshing(true);
    try {
      await refreshWeather(true);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const formatTime = (isoString?: string) => {
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

  const getConditionText = () => {
    if (!weatherData?.current) return '';
    if (language === 'hi') return weatherData.current.condition.hi;
    if (language === 'ur') return weatherData.current.condition.ur;
    return weatherData.current.condition.en;
  };

  const activeAlerts = (weatherData?.alerts || []).filter(
    (a) => !weatherSettings || weatherSettings.enableWeatherAlerts !== false
  );

  return (
    <section className="mb-10 w-full" aria-label="VTR Weather Overview">
      <div className="relative overflow-hidden rounded-2xl border border-stone-800/80 bg-gradient-to-br from-stone-900 via-stone-900/95 to-stone-950 p-5 md:p-7 shadow-xl backdrop-blur-md">
        {/* Subtle background ambient forest glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />

        {/* Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/70 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-stone-100 flex items-center gap-2">
                  {t('weather.title')}
                </h2>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  LIVE VTR
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  {weatherData?.location?.name || 'Valmiki Tiger Reserve, West Champaran, Bihar'}
                </span>
                <span className="hidden sm:inline text-stone-500">•</span>
                <span className="hidden sm:inline text-stone-400">
                  {weatherData?.location?.referencePoint || 'Valmiki Nagar Core Gate'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isWeatherLoading}
              title={t('weather.refresh')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700/80 bg-stone-800/80 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/50 hover:bg-stone-700/80 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing || isWeatherLoading ? 'animate-spin text-amber-400' : 'text-stone-400'
                }`}
              />
              <span className="hidden xs:inline">
                {isRefreshing || isWeatherLoading ? t('weather.refreshing') : t('weather.refresh')}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-500 hover:shadow"
            >
              <span>{t('weather.view_full')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Active Weather Alert (if severe conditions detected) */}
        {activeAlerts.length > 0 && (
          <div className="relative z-10 mt-4 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3.5 text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wide text-amber-300">
                    {language === 'hi'
                      ? activeAlerts[0].titleHi
                      : language === 'ur'
                      ? activeAlerts[0].titleUr
                      : activeAlerts[0].titleEn}
                  </span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                    {activeAlerts[0].severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-stone-300 leading-relaxed">
                  {language === 'hi'
                    ? activeAlerts[0].descriptionHi
                    : language === 'ur'
                    ? activeAlerts[0].descriptionUr
                    : activeAlerts[0].descriptionEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Weather Card Body */}
        {weatherError && !weatherData?.current ? (
          <div className="relative z-10 py-8 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-stone-500" />
            <p className="mt-3 text-sm font-medium text-stone-300">{t('weather.unavailable')}</p>
            <p className="mt-1 text-xs text-stone-500">{weatherError}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-stone-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('weather.retry')}</span>
            </button>
          </div>
        ) : (
          <div className="relative z-10 mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Primary Temp & Condition Block */}
            <div className="md:col-span-5 flex items-center gap-4 border-b border-stone-800/60 pb-5 md:border-b-0 md:border-r md:pr-6 md:pb-0">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-stone-700/60 bg-stone-800/60 shadow-inner">
                <WeatherIcon
                  condition={weatherData?.current?.condition}
                  isDay={weatherData?.current?.isDay}
                  className="h-12 w-12"
                />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                    {weatherData?.current?.temperature !== undefined
                      ? `${Math.round(weatherData.current.temperature)}°C`
                      : '--'}
                  </span>
                  <span className="text-xs text-stone-400">
                    {t('weather.feels_like')}{' '}
                    <strong className="text-stone-200">
                      {weatherData?.current?.apparentTemperature !== undefined
                        ? `${Math.round(weatherData.current.apparentTemperature)}°C`
                        : '--'}
                    </strong>
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-400">
                    {getConditionText() || 'Observing Reserve Atmosphere'}
                  </span>
                  {weatherData?.current?.isDay ? (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300">
                      Day
                    </span>
                  ) : (
                    <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] text-indigo-300">
                      Night
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Rain Probability */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/40 p-3">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                  <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                  <span>{t('weather.rain_prob')}</span>
                </div>
                <div className="mt-1.5 text-lg font-bold text-stone-100">
                  {weatherData?.current?.precipitationProbability !== undefined
                    ? `${weatherData.current.precipitationProbability}%`
                    : '0%'}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {weatherData?.current?.precipitation !== undefined &&
                  weatherData.current.precipitation > 0
                    ? `${weatherData.current.precipitation} mm`
                    : 'Dry forest'}
                </div>
              </div>

              {/* Relative Humidity */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/40 p-3">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{t('weather.humidity')}</span>
                </div>
                <div className="mt-1.5 text-lg font-bold text-stone-100">
                  {weatherData?.current?.relativeHumidity !== undefined
                    ? `${weatherData.current.relativeHumidity}%`
                    : '--'}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {weatherData?.current?.relativeHumidity &&
                  weatherData.current.relativeHumidity > 75
                    ? 'Dense humidity'
                    : 'Moderate'}
                </div>
              </div>

              {/* Wind Speed */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/40 p-3">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                  <Wind className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t('weather.wind')}</span>
                </div>
                <div className="mt-1.5 text-lg font-bold text-stone-100">
                  {weatherData?.current?.windSpeed !== undefined
                    ? `${Math.round(weatherData.current.windSpeed)} km/h`
                    : '--'}
                </div>
                <div className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                  <Compass className="h-3 w-3 text-stone-400" />
                  <span>{weatherData?.current?.windDirectionCardinal || 'N/A'}</span>
                </div>
              </div>

              {/* Visibility / Outlook */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/40 p-3">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t('weather.visibility')}</span>
                </div>
                <div className="mt-1.5 text-lg font-bold text-stone-100">
                  {weatherData?.current?.visibilityKm !== undefined
                    ? `${weatherData.current.visibilityKm.toFixed(1)} km`
                    : '10+ km'}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {weatherData?.current?.uvIndex !== undefined
                    ? `UV: ${weatherData.current.uvIndex.toFixed(1)}`
                    : 'Forest Clear'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Meta Details */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/60 pt-3 text-[11px] text-stone-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              {t('weather.last_updated')}:{' '}
              <strong className="text-stone-300 font-medium">
                {formatTime(weatherData?.current?.time || weatherData?.fetchedAt)}
              </strong>
            </span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="text-stone-400 hidden sm:inline">
              {weatherData?.source || 'Open-Meteo VTR Feed'}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('weather')}
            className="group flex items-center gap-1 text-amber-400 transition-colors hover:text-amber-300 font-medium"
          >
            <span>{t('weather.hourly_title')} &amp; 7-Day Guide</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
