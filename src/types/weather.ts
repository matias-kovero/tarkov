/**
 * @packageDocumentation
 * @module Types
 */

export interface Forcast {
  timestamp: number;
  cloud: number;
  wind_speed: number;
  wind_direction: number;
  wind_gustiness: number;
  rain: number;
  rain_intensity: number;
  fog: number;
  temp: number;
  pressure: number;
  date: string;
  time: string;
}

export interface Weather {
  weather: Forcast;
  date: string;
  time: string;
  acceleration: number;
}