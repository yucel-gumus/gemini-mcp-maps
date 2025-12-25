import { normalizeLocationName } from './string.utils';

const LOCATION_TRANSLATIONS: Record<string, string[]> = {
    'pisa kulesi': ['Leaning Tower of Pisa', 'Torre di Pisa'],
    'eyfel kulesi': ['Eiffel Tower', 'Tour Eiffel'],
    'galata kulesi': ['Galata Tower Istanbul'],
    'ayasofya': ['Hagia Sophia Istanbul'],
    'kapadokya': ['Cappadocia Turkey'],
};

export function getSearchTermsForLocation(location: string): string[] {
    const normalized = normalizeLocationName(location);
    const searchTerms = [location];

    const translations = LOCATION_TRANSLATIONS[normalized];
    if (translations) {
        searchTerms.push(...translations);
    }

    return [...new Set(searchTerms)];
}
