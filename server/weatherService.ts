/**
 * Valmiki Tiger Reserve - Real-time Weather Service
 * Grounded in verified meteorological observations for West Champaran, Bihar, India.
 * Powered by Open-Meteo Weather API (WMO Meteorological System).
 */

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

export interface WeatherConditionInfo {
  code: number;
  label: { en: string; hi: string; ur: string };
  iconType: 'clear-day' | 'clear-night' | 'cloudy' | 'partly-cloudy-day' | 'partly-cloudy-night' | 'rain' | 'heavy-rain' | 'thunderstorm' | 'fog' | 'snow';
}

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
        label: { en: 'Fog / Forest Mist', hi: 'कोहरा / वन धुंध', ur: 'دھند / جنگل کی دھند' },
        iconType: 'fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: { en: 'Drizzle', hi: 'हल्की बूंदाबांदी', ur: 'ہلکی بوندا باندی' },
        iconType: 'rain'
      };
    case 61:
    case 63:
      return {
        code,
        label: { en: 'Rain', hi: 'बारिश', ur: 'بارش' },
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
        label: { en: 'Rain Showers', hi: 'बारिश की बौछारें', ur: 'بارش کی بوچھاڑ' },
        iconType: 'rain'
      };
    case 95:
      return {
        code,
        label: { en: 'Thunderstorm', hi: 'आंधी-तूफ़ान', ur: 'گرج چمک کے ساتھ طوفان' },
        iconType: 'thunderstorm'
      };
    case 96:
    case 99:
      return {
        code,
        label: { en: 'Severe Thunderstorm', hi: 'तीव्र आंधी-तूफ़ान', ur: 'شدید گرج چمک اور طوفان' },
        iconType: 'thunderstorm'
      };
    default:
      return {
        code,
        label: { en: 'Partly Cloudy', hi: 'आंशिक बादल', ur: 'جزوی ابر آلود' },
        iconType: 'partly-cloudy-day'
      };
  }
}

export function degToCompass(num: number): string {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[(val % 16)];
}

export interface WeatherAlert {
  id: string;
  severity: 'advisory' | 'warning' | 'severe';
  type: 'heavy_rainfall' | 'thunderstorm' | 'extreme_heat' | 'strong_winds' | 'poor_visibility';
  title: { en: string; hi: string; ur: string };
  description: { en: string; hi: string; ur: string };
  forestImpact: { en: string; hi: string; ur: string };
  triggeredAt: string;
}

export interface CurrentWeatherData {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidity: number;
  precipitationMm: number;
  rainProbability: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  windSpeedKmH: number;
  windDirectionDeg: number;
  windCompass: string;
  visibilityMeters: number | null;
  uvIndex: number | null;
  isDay: boolean;
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string;
  hourDisplay: string;
  temperatureC: number;
  rainProbability: number;
  precipitationMm: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  relativeHumidity: number;
  windSpeedKmH: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: { en: string; hi: string; ur: string };
  tempMaxC: number;
  tempMinC: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  rainProbabilityMax: number;
  precipitationSumMm: number;
  windSpeedMaxKmH: number;
  uvIndexMax: number | null;
  sunrise: string;
  sunset: string;
}

export interface VTRWeatherResponse {
  success: boolean;
  location: {
    name: string;
    zoneId: string;
    zoneName: string;
    rangeName: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    elevationMeters: number;
  };
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts: WeatherAlert[];
  lastUpdated: string;
  apiSourceTime: string;
  dataSource: string;
  dataSourceUrl: string;
  cached: boolean;
  stale?: boolean;
  error?: string;
}

// In-memory caching mechanism
interface CacheRecord {
  data: VTRWeatherResponse;
  timestamp: number;
}

const memoryCache = new Map<string, CacheRecord>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache to avoid rate limit or hammering

const DAY_NAMES: Record<number, { en: string; hi: string; ur: string }> = {
  0: { en: 'Sunday', hi: 'रविवार', ur: 'اتوار' },
  1: { en: 'Monday', hi: 'सोमवार', ur: 'پیر' },
  2: { en: 'Tuesday', hi: 'मंगलवार', ur: 'منگل' },
  3: { en: 'Wednesday', hi: 'बुधवार', ur: 'بدھ' },
  4: { en: 'Thursday', hi: 'गुरुवार', ur: 'جمعرات' },
  5: { en: 'Friday', hi: 'शुक्रवार', ur: 'جمعہ' },
  6: { en: 'Saturday', hi: 'शनिवार', ur: 'ہفتہ' }
};

/**
 * Fetch real-time weather from Open-Meteo for Valmiki Tiger Reserve.
 */
export async function fetchVTRWeatherData(
  zoneId: string = 'valmikinagar',
  forceRefresh: boolean = false
): Promise<VTRWeatherResponse> {
  const zone = VTR_WEATHER_ZONES.find((z) => z.id === zoneId) || VTR_WEATHER_ZONES[0];
  const cacheKey = `vtr_weather_${zone.id}`;

  const cachedRecord = memoryCache.get(cacheKey);
  const now = Date.now();

  if (!forceRefresh && cachedRecord && (now - cachedRecord.timestamp < CACHE_TTL_MS)) {
    return {
      ...cachedRecord.data,
      cached: true
    };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${zone.latitude}&longitude=${zone.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ValmikiTigerWatch/2.0 (Valmiki Tiger Reserve Conservation Portal)'
      }
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}: ${response.statusText}`);
    }

    const raw = await response.json();

    const currentRaw = raw.current || {};
    const hourlyRaw = raw.hourly || {};
    const dailyRaw = raw.daily || {};

    const isDay = currentRaw.is_day === 1;
    const weatherCode = currentRaw.weather_code ?? 0;
    const condition = getWmoCondition(weatherCode, isDay);

    // Find current rain probability from hourly forecast matching current time
    let rainProbability = 0;
    if (hourlyRaw.time && hourlyRaw.precipitation_probability) {
      const currentIsoHour = currentRaw.time ? currentRaw.time.substring(0, 13) : '';
      const hourIndex = hourlyRaw.time.findIndex((t: string) => t.startsWith(currentIsoHour));
      if (hourIndex >= 0 && typeof hourlyRaw.precipitation_probability[hourIndex] === 'number') {
        rainProbability = hourlyRaw.precipitation_probability[hourIndex];
      }
    }

    // Process current weather data
    const currentData: CurrentWeatherData = {
      temperatureC: Math.round((currentRaw.temperature_2m ?? 0) * 10) / 10,
      apparentTemperatureC: Math.round((currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 0) * 10) / 10,
      relativeHumidity: Math.round(currentRaw.relative_humidity_2m ?? 0),
      precipitationMm: Math.round((currentRaw.precipitation ?? 0) * 10) / 10,
      rainProbability,
      weatherCode,
      condition,
      windSpeedKmH: Math.round((currentRaw.wind_speed_10m ?? 0) * 10) / 10,
      windDirectionDeg: currentRaw.wind_direction_10m ?? 0,
      windCompass: degToCompass(currentRaw.wind_direction_10m ?? 0),
      visibilityMeters: typeof currentRaw.visibility === 'number' ? Math.round(currentRaw.visibility) : null,
      uvIndex: dailyRaw.uv_index_max && dailyRaw.uv_index_max[0] ? Math.round(dailyRaw.uv_index_max[0] * 10) / 10 : null,
      isDay,
      timestamp: currentRaw.time || new Date().toISOString()
    };

    // Process Hourly (next 24 hours)
    const hourlyItems: HourlyForecastItem[] = [];
    if (Array.isArray(hourlyRaw.time)) {
      const nowTime = currentRaw.time || new Date().toISOString();
      let startIndex = hourlyRaw.time.findIndex((t: string) => t >= nowTime);
      if (startIndex < 0) startIndex = 0;

      const count = Math.min(24, hourlyRaw.time.length - startIndex);
      for (let i = 0; i < count; i++) {
        const idx = startIndex + i;
        const timeStr = hourlyRaw.time[idx];
        const dateObj = new Date(timeStr);
        const hourDisplay = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

        const hCode = hourlyRaw.weather_code ? hourlyRaw.weather_code[idx] : 0;
        const hourNum = dateObj.getHours();
        const isHourDay = hourNum >= 6 && hourNum <= 18;

        hourlyItems.push({
          time: timeStr,
          hourDisplay,
          temperatureC: Math.round((hourlyRaw.temperature_2m ? hourlyRaw.temperature_2m[idx] : 0) * 10) / 10,
          rainProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[idx] ?? 0 : 0,
          precipitationMm: Math.round((hourlyRaw.precipitation ? hourlyRaw.precipitation[idx] ?? 0 : 0) * 10) / 10,
          weatherCode: hCode,
          condition: getWmoCondition(hCode, isHourDay),
          relativeHumidity: Math.round(hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[idx] ?? 0 : 0),
          windSpeedKmH: Math.round((hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[idx] ?? 0 : 0) * 10) / 10
        });
      }
    }

    // Process Daily (7 days)
    const dailyItems: DailyForecastItem[] = [];
    if (Array.isArray(dailyRaw.time)) {
      const daysCount = Math.min(7, dailyRaw.time.length);
      for (let d = 0; d < daysCount; d++) {
        const dCode = dailyRaw.weather_code ? dailyRaw.weather_code[d] : 0;
        const dateStr = dailyRaw.time[d];
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();

        dailyItems.push({
          date: dateStr,
          dayName: DAY_NAMES[dayOfWeek] || { en: 'Day', hi: 'दिन', ur: 'دن' },
          tempMaxC: Math.round((dailyRaw.temperature_2m_max ? dailyRaw.temperature_2m_max[d] : 0) * 10) / 10,
          tempMinC: Math.round((dailyRaw.temperature_2m_min ? dailyRaw.temperature_2m_min[d] : 0) * 10) / 10,
          weatherCode: dCode,
          condition: getWmoCondition(dCode, true),
          rainProbabilityMax: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[d] ?? 0 : 0,
          precipitationSumMm: Math.round((dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[d] ?? 0 : 0) * 10) / 10,
          windSpeedMaxKmH: Math.round((dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[d] ?? 0 : 0) * 10) / 10,
          uvIndexMax: dailyRaw.uv_index_max ? Math.round((dailyRaw.uv_index_max[d] ?? 0) * 10) / 10 : null,
          sunrise: dailyRaw.sunrise ? dailyRaw.sunrise[d] : '',
          sunset: dailyRaw.sunset ? dailyRaw.sunset[d] : ''
        });
      }
    }

    // Real Meteorological Alerts Computation
    const alerts: WeatherAlert[] = [];
    const triggeredAt = new Date().toISOString();

    // 1. Thunderstorm Alert
    if ([95, 96, 99].includes(weatherCode)) {
      alerts.push({
        id: `alert-thunderstorm-${Date.now()}`,
        severity: 'severe',
        type: 'thunderstorm',
        title: {
          en: 'Thunderstorm Warning in Reserve Range',
          hi: 'बाघ अभयारण्य क्षेत्र में आंधी-तूफ़ान की चेतावनी',
          ur: 'ٹائیگر ریزرو رینج میں گرج چمک اور طوفان کا الرٹ'
        },
        description: {
          en: `Active lightning and thunderstorm detected over ${zone.name}.`,
          hi: `${zone.name} क्षेत्र में बिजली कड़कने और तीव्र आंधी का प्रभाव सक्रिय है।`,
          ur: `${zone.name} کے علاقے میں آسمانی بجلی اور طوفانی بارش جاری ہے۔`
        },
        forestImpact: {
          en: 'Gandak boat safaris and open-top gypsy patrols suspended. Visitors advised to seek shelter at forest checkposts.',
          hi: 'गंडक नौका सफारी और खुली जिप्सी सफारी अस्थायी रूप से स्थगित। आगंतुक वन चौकियों में सुरक्षित रहें।',
          ur: 'گندک بوٹ سفاری اور کھلی گاڑیوں کے دورے معطل۔ سیاحوں کو فارسٹ چوکیوں پر پناہ لینے کی ہدایت۔'
        },
        triggeredAt
      });
    }

    // 2. Heavy Rainfall Alert
    if (currentData.precipitationMm >= 10 || (dailyItems[0] && dailyItems[0].precipitationSumMm >= 30)) {
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        severity: 'warning',
        type: 'heavy_rainfall',
        title: {
          en: 'Heavy Monsoon / Forest Precipitation Alert',
          hi: 'भारी बारिश / वन क्षेत्र में जलभराव की चेतावनी',
          ur: 'شدید بارش اور جنگلاتی راستوں پر پانی کا الرٹ'
        },
        description: {
          en: `Substantial rainfall (${currentData.precipitationMm} mm/hr) recorded in ${zone.name}.`,
          hi: `${zone.name} में पर्याप्त बारिश (${currentData.precipitationMm} मिमी) दर्ज की गई है।`,
          ur: `${zone.name} میں موسلادھار بارش ریکارڈ کی گئی ہے۔`
        },
        forestImpact: {
          en: 'Unpaved forest roads and seasonal streams (nullahs) may swell. Only high-clearance 4x4 authorized patrol vehicles permitted.',
          hi: 'कच्चे वन मार्ग और बरसाती नाले उफान पर हो सकते हैं। केवल 4x4 अधिकृत गश्ती वाहनों को अनुमति।',
          ur: 'کچے جنگلاتی راستے اور نالے زیر آب آ سکتے ہیں۔ صرف مجاز فور بائی فور گاڑیوں کی اجازت۔'
        },
        triggeredAt
      });
    }

    // 3. Extreme Heat Alert
    if (currentData.temperatureC >= 39 || currentData.apparentTemperatureC >= 42) {
      alerts.push({
        id: `alert-heat-${Date.now()}`,
        severity: 'warning',
        type: 'extreme_heat',
        title: {
          en: 'High Temperature & Heat Caution',
          hi: 'अत्यधिक गर्मी और लू का परामर्श',
          ur: 'شدید گرمی اور لو کا مشورہ'
        },
        description: {
          en: `Temperature reached ${currentData.temperatureC}°C (Feels like ${currentData.apparentTemperatureC}°C) in the reserve.`,
          hi: `वन क्षेत्र में तापमान ${currentData.temperatureC}°C (महसूस ${currentData.apparentTemperatureC}°C) तक पहुँच गया है।`,
          ur: `ریزرو میں درجہ حرارت ${currentData.temperatureC} ڈگری سینٹی گریڈ ریکارڈ کیا گیا۔`
        },
        forestImpact: {
          en: 'High dehydration risk during afternoon safaris. Tigers remain in dense ravines or core river pools until dusk.',
          hi: 'दोपहर की सफारी के दौरान निर्जलीकरण का खतरा। बाघ आमतौर पर शाम तक घने नालों या पानी के गड्ढों के पास विश्राम करते हैं।',
          ur: 'سفاری کے دوران وافر پانی ساتھ رکھیں۔ شیر عام طور پر گھنے گھاٹیوں یا پانی کے تالابوں میں پناہ لیتے ہیں۔'
        },
        triggeredAt
      });
    }

    // 4. Strong Winds Alert
    if (currentData.windSpeedKmH >= 42) {
      alerts.push({
        id: `alert-wind-${Date.now()}`,
        severity: 'advisory',
        type: 'strong_winds',
        title: {
          en: 'Strong Forest Gusts Advisory',
          hi: 'तीव्र हवाओं और वृक्ष शाखा गिरने का परामर्श',
          ur: 'تیز ہواؤں اور درختوں کی شاخوں کے گرنے کا الرٹ'
        },
        description: {
          en: `Wind gusts up to ${currentData.windSpeedKmH} km/h recorded in ${zone.name}.`,
          hi: `${zone.name} में हवा की गति ${currentData.windSpeedKmH} किमी/घंटा दर्ज।`,
          ur: `جنگل میں تیز ہواؤں کی رفتار ${currentData.windSpeedKmH} کلومیٹر فی گھنٹہ ہے۔`
        },
        forestImpact: {
          en: 'Caution for fallen sal branches along forest tracks. Drivers must maintain safe distance from dead timber.',
          hi: 'कच्चे मार्गों पर साल के पेड़ों की शाखाएँ गिरने की संभावना। सावधानी से वाहन चलाएँ।',
          ur: 'راستوں پر خشک درختوں کی شاخیں گرنے کا خدشہ۔ گاڑی آہستہ اور احتیاط سے چلائیں۔'
        },
        triggeredAt
      });
    }

    // 5. Poor Visibility Alert
    if (currentData.visibilityMeters !== null && currentData.visibilityMeters <= 1000) {
      alerts.push({
        id: `alert-visibility-${Date.now()}`,
        severity: 'warning',
        type: 'poor_visibility',
        title: {
          en: 'Dense Mist / Reduced Visibility Advisory',
          hi: 'घना कोहरा / कम दृश्यता परामर्श',
          ur: 'شدید دھند اور کم حد نگاہ کا الرٹ'
        },
        description: {
          en: `Forest visibility reduced to ${(currentData.visibilityMeters / 1000).toFixed(1)} km along Gandak river corridor.`,
          hi: `गंडक नदी गलियारे में दृश्यता घटकर ${(currentData.visibilityMeters / 1000).toFixed(1)} किमी रह गई है।`,
          ur: `گندک کے علاقے میں حد نگاہ کم ہو کر ${(currentData.visibilityMeters / 1000).toFixed(1)} کلومیٹر رہ گئی۔`
        },
        forestImpact: {
          en: 'Speed limit inside core sector capped at 20 km/h. Headlights required on all patrol routes.',
          hi: 'कोर क्षेत्र में वाहनों की गति सीमा 20 किमी/घंटा तक सीमित। हेडलाइट्स जलाना अनिवार्य।',
          ur: 'ریزرو کے اندر رفتار 20 کلومیٹر تک محدود۔ ہیڈ لائٹس کا استعمال لازمی۔'
        },
        triggeredAt
      });
    }

    const payload: VTRWeatherResponse = {
      success: true,
      location: {
        name: 'Valmiki Tiger Reserve, West Champaran, Bihar, India',
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
      hourly: hourlyItems,
      daily: dailyItems,
      alerts,
      lastUpdated: new Date().toISOString(),
      apiSourceTime: currentRaw.time || new Date().toISOString(),
      dataSource: 'Open-Meteo Weather API (WMO Meteorological System)',
      dataSourceUrl: 'https://open-meteo.com/',
      cached: false
    };

    // Store in cache
    memoryCache.set(cacheKey, {
      data: payload,
      timestamp: now
    });

    return payload;
  } catch (error: any) {
    console.error('Failed to fetch real-time weather from Open-Meteo:', error);

    // If we have stale cache, return it with stale flag
    if (cachedRecord) {
      return {
        ...cachedRecord.data,
        cached: true,
        stale: true,
        error: 'Live weather service temporarily unreachable. Showing latest recorded observations.'
      };
    }

    return {
      success: false,
      location: {
        name: 'Valmiki Tiger Reserve, West Champaran, Bihar, India',
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
      current: null as any,
      hourly: [],
      daily: [],
      alerts: [],
      lastUpdated: new Date().toISOString(),
      apiSourceTime: '',
      dataSource: 'Open-Meteo Weather API (WMO Meteorological System)',
      dataSourceUrl: 'https://open-meteo.com/',
      cached: false,
      error: 'Weather data unavailable. Please verify network connection or retry.'
    };
  }
}
