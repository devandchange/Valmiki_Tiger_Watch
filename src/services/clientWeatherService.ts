/**
 * Valmiki Tiger Watch - Client Weather Service
 * 
 * Provides resilient, real-time meteorological weather data for Valmiki Tiger Reserve.
 * Powered by Open-Meteo (WMO World Meteorological Organization observation system).
 * Works seamlessly on Web, Local Dev, Cloud Run, and Capacitor Android APK.
 * 
 * Never throws "Unexpected token '<'" when backend is unavailable or when running locally on Android.
 * Open-Meteo is 100% free, requires NO API keys, and requires NO Google Cloud billing.
 */

import { VTRWeatherResponse, CurrentWeatherData, HourlyForecastItem, DailyForecastItem, WeatherAlert, WeatherConditionInfo } from '../types';

export interface VTRZoneCoordinate {
  id: string;
  name: string;
  rangeName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  description: string;
}

export const VTR_WEATHER_ZONES: VTRZoneCoordinate[] = [
  {
    id: 'valmikinagar',
    name: 'Valmiki Nagar Core (Main Gate)',
    rangeName: 'Valmiki Nagar Range',
    latitude: 27.4294,
    longitude: 83.9048,
    elevationMeters: 135,
    description: 'Core ecotourism gate, Gandak River confluence, and historical forest range office.'
  },
  {
    id: 'manguraha',
    name: 'Manguraha Range',
    rangeName: 'Manguraha Forest Division',
    latitude: 27.2790,
    longitude: 84.4420,
    elevationMeters: 110,
    description: 'Dense sal forest range with prominent predator corridors and high herbivore density.'
  },
  {
    id: 'gobardhana',
    name: 'Gobardhana Range',
    rangeName: 'Gobardhana Range',
    latitude: 27.3150,
    longitude: 84.3210,
    elevationMeters: 120,
    description: 'Pristine riparian woodland adjacent to Someshwar Hill foothills.'
  },
  {
    id: 'harnatanr',
    name: 'Harnatanr Range',
    rangeName: 'Harnatanr Forest Range',
    latitude: 27.2180,
    longitude: 84.1480,
    elevationMeters: 98,
    description: 'Southern buffer and grassland fringe with active community anti-poaching squads.'
  }
];

export function getWmoCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: { en: 'Clear Sky', hi: 'साफ़ आसमान', ur: 'صاف آسمان' },
        iconType: isDay ? 'clear-day' : 'clear-night'
      };
    case 1:
      return {
        code,
        label: { en: 'Mainly Clear', hi: 'मुख्यतः साफ़', ur: 'زیادہ تر صاف' },
        iconType: isDay ? 'clear-day' : 'clear-night'
      };
    case 2:
      return {
        code,
        label: { en: 'Partly Cloudy', hi: 'आंशिक बादल', ur: 'جزوی ابر آلود' },
        iconType: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night'
      };
    case 3:
      return {
        code,
        label: { en: 'Overcast', hi: 'घने बादल', ur: 'مکمل ابر آلود' },
        iconType: 'cloudy'
      };
    case 45:
    case 48:
      return {
        code,
        label: { en: 'Fog & Mist', hi: 'कोहरा एवं धुंध', ur: 'دھند اور کہرا' },
        iconType: 'fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', ur: 'ہلکی بوندا باندی' },
        iconType: 'rain'
      };
    case 61:
    case 63:
      return {
        code,
        label: { en: 'Moderate Rain', hi: 'मध्यम वर्षा', ur: 'معتدل بارش' },
        iconType: 'rain'
      };
    case 65:
      return {
        code,
        label: { en: 'Heavy Rain', hi: 'मूसलाधार बारिश', ur: 'تیز بارش' },
        iconType: 'heavy-rain'
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: { en: 'Rain Showers', hi: 'वर्षा की बौछारें', ur: 'بارش کی بوچھاڑ' },
        iconType: 'rain'
      };
    case 95:
    case 96:
    case 99:
      return {
        code,
        label: { en: 'Thunderstorm', hi: 'गरज के साथ वर्षा', ur: 'گرج چمک کے ساتھ طوفان' },
        iconType: 'thunderstorm'
      };
    default:
      return {
        code,
        label: { en: 'Fair Weather', hi: 'सामान्य मौसम', ur: 'خوشگوار موسم' },
        iconType: isDay ? 'clear-day' : 'clear-night'
      };
  }
}

export function degreesToCompass(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

const DAY_NAMES: Record<number, { en: string; hi: string; ur: string }> = {
  0: { en: 'Sun', hi: 'रवि', ur: 'اتوار' },
  1: { en: 'Mon', hi: 'सोम', ur: 'پیر' },
  2: { en: 'Tue', hi: 'मंगल', ur: 'منگل' },
  3: { en: 'Wed', hi: 'बुध', ur: 'بدھ' },
  4: { en: 'Thu', hi: 'गुरु', ur: 'جمعرات' },
  5: { en: 'Fri', hi: 'शुक्र', ur: 'جمعہ' },
  6: { en: 'Sat', hi: 'शनि', ur: 'ہفتہ' }
};

/**
 * Directly queries Open-Meteo API from client or Capacitor Android.
 */
export async function fetchDirectOpenMeteoWeather(zoneId: string = 'valmikinagar'): Promise<VTRWeatherResponse> {
  const zone = VTR_WEATHER_ZONES.find((z) => z.id === zoneId) || VTR_WEATHER_ZONES[0];

  const params = new URLSearchParams({
    latitude: zone.latitude.toString(),
    longitude: zone.longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '7'
  });

  const apiUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo API returned status ${response.status}`);
  }

  const data = await response.json();
  const current = data.current || {};
  const isDay = Boolean(current.is_day);
  const condition = getWmoCondition(current.weather_code || 0, isDay);

  const currentData: CurrentWeatherData = {
    temperatureC: Math.round((current.temperature_2m || 0) * 10) / 10,
    apparentTemperatureC: Math.round((current.apparent_temperature || current.temperature_2m || 0) * 10) / 10,
    relativeHumidity: Math.round(current.relative_humidity_2m || 0),
    weatherCode: current.weather_code || 0,
    condition,
    precipitationMm: current.precipitation || 0,
    rainProbability: data.hourly?.precipitation_probability?.[0] || 0,
    windSpeedKmH: Math.round((current.wind_speed_10m || 0) * 10) / 10,
    windDirectionDeg: Math.round(current.wind_direction_10m || 0),
    windCompass: degreesToCompass(current.wind_direction_10m || 0),
    visibilityMeters: 10000,
    uvIndex: data.daily?.uv_index_max?.[0] || null,
    isDay,
    timestamp: current.time || new Date().toISOString()
  };

  // Hourly forecast (next 24 hours)
  const hourly: HourlyForecastItem[] = [];
  if (data.hourly && Array.isArray(data.hourly.time)) {
    const times: string[] = data.hourly.time;
    const nowIso = current.time || new Date().toISOString();
    let startIndex = times.findIndex((t) => t >= nowIso.substring(0, 13));
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, times.length); i++) {
      const timeStr = times[i];
      const hourPart = timeStr.split('T')[1] || '';
      const hourDisplay = hourPart.substring(0, 5);
      const code = data.hourly.weather_code?.[i] || 0;
      const hHour = parseInt(hourPart.split(':')[0] || '12', 10);
      const hIsDay = hHour >= 6 && hHour <= 18;

      hourly.push({
        time: timeStr,
        hourDisplay,
        temperatureC: Math.round((data.hourly.temperature_2m?.[i] || 0) * 10) / 10,
        rainProbability: Math.round(data.hourly.precipitation_probability?.[i] || 0),
        precipitationMm: Math.round((data.hourly.precipitation?.[i] || 0) * 10) / 10,
        weatherCode: code,
        condition: getWmoCondition(code, hIsDay),
        relativeHumidity: Math.round(data.hourly.relative_humidity_2m?.[i] || 0),
        windSpeedKmH: Math.round((data.hourly.wind_speed_10m?.[i] || 0) * 10) / 10
      });
    }
  }

  // Daily forecast (7 days)
  const daily: DailyForecastItem[] = [];
  if (data.daily && Array.isArray(data.daily.time)) {
    const times: string[] = data.daily.time;
    for (let i = 0; i < times.length; i++) {
      const dateStr = times[i];
      const dObj = new Date(dateStr + 'T12:00:00Z');
      const dayOfWeek = dObj.getDay();
      const code = data.daily.weather_code?.[i] || 0;

      daily.push({
        date: dateStr,
        dayName: DAY_NAMES[dayOfWeek] || { en: 'Day', hi: 'दिन', ur: 'دن' },
        tempMaxC: Math.round(data.daily.temperature_2m_max?.[i] || 0),
        tempMinC: Math.round(data.daily.temperature_2m_min?.[i] || 0),
        weatherCode: code,
        condition: getWmoCondition(code, true),
        rainProbabilityMax: Math.round(data.daily.precipitation_probability_max?.[i] || 0),
        precipitationSumMm: Math.round((data.daily.precipitation_sum?.[i] || 0) * 10) / 10,
        windSpeedMaxKmH: Math.round((data.daily.wind_speed_10m_max?.[i] || 0) * 10) / 10,
        uvIndexMax: data.daily.uv_index_max?.[i] != null ? Math.round((data.daily.uv_index_max[i]) * 10) / 10 : null,
        sunrise: data.daily.sunrise?.[i] ? data.daily.sunrise[i].split('T')[1]?.substring(0, 5) : '05:30',
        sunset: data.daily.sunset?.[i] ? data.daily.sunset[i].split('T')[1]?.substring(0, 5) : '18:15'
      });
    }
  }

  // Weather Alerts
  const alerts: WeatherAlert[] = [];
  if (current.wind_speed_10m && current.wind_speed_10m > 40) {
    alerts.push({
      id: `alert-wind-${Date.now()}`,
      severity: 'advisory',
      type: 'strong_winds',
      title: {
        en: 'Gusty Winds Reported Across Valmiki Nagar',
        hi: 'वाल्मीकि नगर में तेज़ हवाएं सक्रिय',
        ur: 'تیز ہواؤں کا انتباہ'
      },
      description: {
        en: 'Wind gusts exceeding 40 km/h observed near forest canopy. Exercise caution on elevated watchtowers.',
        hi: 'कैनोपी के पास 40 किमी/घंटा से अधिक हवा की गति दर्ज। वॉचटावर पर सावधानी बरतें।',
        ur: 'جنگل میں تیز ہوائیں چل رہی ہیں۔'
      },
      forestImpact: {
        en: 'High canopy swaying; exercise caution around old-growth timber stands.',
        hi: 'कैनोपी में कंपन; सूखे पेड़ों के नीचे रुकने से बचें।',
        ur: 'درختوں کی شاخوں سے ہوشیار رہیں۔'
      },
      triggeredAt: new Date().toISOString()
    });
  }

  return {
    success: true,
    location: {
      name: zone.name,
      zoneId: zone.id,
      zoneName: zone.name,
      rangeName: zone.rangeName,
      district: 'West Champaran',
      state: 'Bihar',
      country: 'India',
      latitude: zone.latitude,
      longitude: zone.longitude,
      elevationMeters: zone.elevationMeters
    },
    current: currentData,
    hourly,
    daily,
    alerts,
    lastUpdated: new Date().toISOString(),
    apiSourceTime: current.time || new Date().toISOString(),
    dataSource: 'Open-Meteo Weather API & WMO Global Observation System',
    dataSourceUrl: 'https://open-meteo.com',
    cached: false
  };
}

/**
 * Universal Weather Fetcher
 * Tries server-side route first with strict content-type check to avoid "Unexpected token '<'".
 * If running on Android APK (where /api/ returns HTML) or if server is unreachable, falls back to direct Open-Meteo.
 */
export async function getUniversalVTRWeather(zoneId: string = 'valmikinagar', forceRefresh: boolean = false): Promise<VTRWeatherResponse> {
  // 1. Try server proxy if on standard web origin
  try {
    const isCapacitor = typeof window !== 'undefined' && (
      (window as any).Capacitor?.isNativePlatform?.() ||
      window.location.protocol.startsWith('capacitor') ||
      (window.location.hostname === 'localhost' && !window.location.port)
    );

    if (!isCapacitor) {
      const serverRes = await fetch(`/api/weather?zoneId=${encodeURIComponent(zoneId)}${forceRefresh ? '&forceRefresh=true' : ''}`, {
        headers: { 'Accept': 'application/json' }
      });

      const contentType = serverRes.headers.get('content-type') || '';
      if (serverRes.ok && contentType.includes('application/json')) {
        const json = await serverRes.json();
        if (json && json.success && json.current) {
          return json;
        }
      }
    }
  } catch (err) {
    // Fall through to direct Open-Meteo fetch
  }

  // 2. Direct Open-Meteo fetch
  return await fetchDirectOpenMeteoWeather(zoneId);
}
