import { normalizeLocationName } from './string.utils';

const LOCATION_TRANSLATIONS: Record<string, string[]> = {
    'pisa kulesi': ['Leaning Tower of Pisa', 'Torre di Pisa'],
    'eyfel kulesi': ['Eiffel Tower', 'Tour Eiffel'],
    'galata kulesi': ['Galata Tower Istanbul', 'Galata Kulesi'],
    'ayasofya': ['Hagia Sophia Istanbul', 'Ayasofya'],
    'kapadokya': ['Kapadokya', 'Göreme Nevşehir', 'Cappadocia Turkey'],
    'kapadokya peri bacalari': ['Kapadokya', 'Göreme', 'Peri Bacaları Nevşehir'],
    'peri bacalari': ['Kapadokya', 'Göreme Nevşehir', 'Peri Bacaları'],
    'anitkabir ankara': ['Anıtkabir', 'Anıtkabir Ankara'],
    'pamukkale travertenleri': ['Pamukkale', 'Pamukkale Travertenleri Denizli'],
};

export function getSearchTermsForLocation(location: string): string[] {
    const normalized = normalizeLocationName(location);
    const searchTerms = [location];

    for (const [key, terms] of Object.entries(LOCATION_TRANSLATIONS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            searchTerms.push(...terms);
        }
    }

    // Add individual significant words as fallbacks (e.g. "Kapadokya Peri Bacaları" -> "Kapadokya")
    const words = location.split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
        searchTerms.push(word);
    }

    return [...new Set(searchTerms)];
}
