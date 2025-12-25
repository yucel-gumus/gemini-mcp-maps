import type { GeocodingResult } from '../types';
import { API_ENDPOINTS } from '../constants/config';
import { getSearchTermsForLocation } from '../utils/location.utils';

interface NominatimResponse {
    lat: string;
    lon: string;
    display_name: string;
}

async function searchNominatim(query: string): Promise<GeocodingResult | null> {
    const url = `${API_ENDPOINTS.nominatim}?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await fetch(url);
    const data: NominatimResponse[] = await response.json();

    if (data.length === 0) {
        return null;
    }

    const result = data[0];
    return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
    };
}

export async function searchLocation(location: string): Promise<GeocodingResult | null> {
    const searchTerms = getSearchTermsForLocation(location);

    for (const term of searchTerms) {
        try {
            const result = await searchNominatim(term);
            if (result) {
                return result;
            }
        } catch {
            continue;
        }
    }

    return null;
}
