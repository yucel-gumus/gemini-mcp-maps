const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

export const AI_CONFIG = {
  apiUrl: BFF_URL,
};

/** Public geocoding (no API key). */
export const API_ENDPOINTS = {
  nominatim: 'https://nominatim.openstreetmap.org/search',
};

export const MAP_CONFIG = {
  defaultCenter: [41.0082, 28.9784] as [number, number],
  defaultZoom: 11,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};