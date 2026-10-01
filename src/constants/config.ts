const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? '' : 'https://api.yucelgumus.dev');

export const AI_CONFIG = {
  apiUrl: API_BASE_URL,
  apiKey: import.meta.env.VITE_CLIENT_API_KEY || import.meta.env.VITE_API_KEY || '',
};

/** Public geocoding (no API key). */
export const API_ENDPOINTS = {
  nominatim: 'https://nominatim.openstreetmap.org/search',
};

export const MAP_CONFIG = {
  defaultCenter: [41.0082, 28.9784] as [number, number],
  defaultZoom: 11,
  minZoom: 6,
  maxZoom: 19,
  targetZoom: 15,
  flyToDuration: 1.5,
  markerSize: [40, 40] as [number, number],
  markerAnchor: [20, 40] as [number, number],
  popupAnchor: [0, -40] as [number, number],
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};