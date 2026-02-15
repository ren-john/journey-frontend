import { JournalEntry, StrapiResponse } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export async function getEntries(): Promise<JournalEntry[]> {
    const url = new URL('/api/journal-entries', STRAPI_URL);
    url.searchParams.set('populate', 'Photos');
    url.searchParams.set('sort', 'Date:desc');



    try {
        const res = await fetch(url.toString(), {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch entries: ${res.status} ${res.statusText}`);
        }

        const json: StrapiResponse<JournalEntry[]> = await res.json();
        return json.data;
    } catch (error) {
        console.error('[API Error]', error);
        throw error;
    }
}

export async function getEntriesByCategory(category: string): Promise<JournalEntry[]> {
    const url = new URL('/api/journal-entries', STRAPI_URL);
    url.searchParams.set('populate', 'Photos');
    url.searchParams.set('sort', 'Date:desc');
    url.searchParams.set('filters[Category][$eq]', category);

    try {
        const res = await fetch(url.toString(), {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch entries by category: ${res.status} ${res.statusText}`);
        }

        const json: StrapiResponse<JournalEntry[]> = await res.json();
        return json.data;
    } catch (error) {
        console.error('[API Error]', error);
        throw error;
    }
}

export const API_URL = STRAPI_URL;
