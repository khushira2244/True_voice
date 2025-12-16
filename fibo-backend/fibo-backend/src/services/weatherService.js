// src/services/weatherService.js
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODE_MAP = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "light drizzle",
  53: "drizzle",
  55: "heavy drizzle",
  61: "light rain",
  63: "moderate rain",
  65: "heavy rain",
  71: "light snow",
  73: "snow",
  75: "heavy snow",
  80: "rain showers",
  81: "heavy rain showers",
  82: "violent rain showers",
  95: "thunderstorm",
  96: "thunderstorm with hail",
  99: "severe thunderstorm"
};

export function interpretWeather(current) {
  const base = WEATHER_CODE_MAP[current.weathercode] || "unknown weather";
  const time = current.is_day ? "day" : "night";
  const temp = Math.round(current.temperature);

  return `It is ${base} during the ${time}, around ${temp}°C.`;
}


export async function getCurrentWeatherText({ lat, lon }) {
  const url =
    `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weathercode,wind_speed_10m,is_day`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Weather API error:", res.status);
    return "Weather information unavailable.";
  }

  const data = await res.json();
  const c = data?.current;

  if (!c) return "Weather information unavailable.";

  const temp = Math.round(c.temperature_2m ?? 0);
  const wind = Math.round(c.wind_speed_10m ?? 0);
  const condition = weatherCodeToText(c.weathercode);
  const timeOfDay = c.is_day ? "daytime" : "nighttime";

  return `It is ${condition} during the ${timeOfDay}, around ${temp}°C with wind speed ${wind} km/h.`;
}
