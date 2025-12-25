import type { MapConfig } from '../types';

export const AI_CONFIG = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
} as const;

export const MAP_CONFIG: MapConfig = {
    defaultCenter: [41.0082, 28.9784],
    defaultZoom: 11,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

export const API_ENDPOINTS = {
    nominatim: 'https://nominatim.openstreetmap.org/search',
} as const;
