import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Snowflake
} from 'lucide-react';
import { WeatherConditionInfo } from '../types';

interface WeatherIconProps {
  condition?: WeatherConditionInfo | null;
  iconType?: string;
  isDay?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  iconType,
  isDay = true,
  className = 'w-6 h-6'
}) => {
  const type = iconType || condition?.iconType || (isDay ? 'clear-day' : 'clear-night');

  switch (type) {
    case 'clear-day':
      return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
    case 'clear-night':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'partly-cloudy-day':
      return <CloudSun className={`${className} text-amber-400`} />;
    case 'partly-cloudy-night':
      return <CloudMoon className={`${className} text-indigo-300`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-stone-400`} />;
    case 'fog':
      return <CloudFog className={`${className} text-stone-300`} />;
    case 'rain':
      return <CloudDrizzle className={`${className} text-blue-400`} />;
    case 'heavy-rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-amber-400`} />;
    case 'snow':
      return <Snowflake className={`${className} text-cyan-300`} />;
    default:
      return <Cloud className={`${className} text-stone-400`} />;
  }
};
