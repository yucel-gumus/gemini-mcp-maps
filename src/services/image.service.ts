export interface LocationMediaDetails {
    imageUrl?: string;
    description?: string;
}

export function generateCandidateTerms(locationName: string): string[] {
    const terms: string[] = [];

    const parts = locationName.split(',').map(s => s.trim()).filter(Boolean);

    // 1. Primary landmark subject before first comma (e.g. "Anıtkabir" from "Anıtkabir, Ankara, Türkiye")
    if (parts.length > 0 && parts[0].length >= 3) {
        terms.push(parts[0]);
    }

    // 2. Primary landmark + city (e.g. "Anıtkabir, Ankara")
    if (parts.length >= 2) {
        terms.push(`${parts[0]}, ${parts[1]}`);
        terms.push(`${parts[0]} ${parts[1]}`);
    }

    // 3. Full original string
    const cleanFull = locationName.trim();
    if (!terms.includes(cleanFull)) {
        terms.push(cleanFull);
    }

    // 4. Remove common trailing country suffixes
    const withoutCountry = cleanFull.replace(/,\s*(ABD|USA|Türkiye|Turkey|TR|AB|UK)\s*$/i, '').trim();
    if (withoutCountry && !terms.includes(withoutCountry)) {
        terms.push(withoutCountry);
    }

    // 5. Clean punctuation version
    const noPunct = cleanFull.replace(/[,.;:!?()'"]/g, ' ').replace(/\s+/g, ' ').trim();
    if (noPunct && !terms.includes(noPunct)) {
        terms.push(noPunct);
    }

    return [...new Set(terms)];
}

async function searchWikiArticleTitle(lang: 'tr' | 'en', term: string): Promise<string | null> {
    if (!term || term.length < 2) return null;
    try {
        const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(term)}&limit=1&format=json&origin=*`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data[1]) && data[1].length > 0) {
                return data[1][0];
            }
        }
    } catch {
        // Silent catch
    }
    return null;
}

async function fetchWikiSummary(lang: 'tr' | 'en', title: string): Promise<LocationMediaDetails | null> {
    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.thumbnail?.source || data.extract) {
                return {
                    imageUrl: data.thumbnail?.source,
                    description: data.description || data.extract
                };
            }
        }
    } catch {
        // Silent catch
    }
    return null;
}

export async function getLocationMediaDetails(locationName: string): Promise<LocationMediaDetails> {
    const candidateTerms = generateCandidateTerms(locationName);

    // 1. Try Turkish Wikipedia Opensearch first (Exact Turkish landmark match)
    for (const term of candidateTerms) {
        const exactTitle = await searchWikiArticleTitle('tr', term);
        if (exactTitle) {
            const summary = await fetchWikiSummary('tr', exactTitle);
            if (summary && (summary.imageUrl || summary.description)) {
                return summary;
            }
        }
    }

    // 2. Fallback to English Wikipedia Opensearch for global locations
    for (const term of candidateTerms) {
        const exactTitle = await searchWikiArticleTitle('en', term);
        if (exactTitle) {
            const summary = await fetchWikiSummary('en', exactTitle);
            if (summary && (summary.imageUrl || summary.description)) {
                return summary;
            }
        }
    }

    return {};
}
