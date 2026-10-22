/**
 * AI Assistant Suggestion Service
 * REST API for fetching suggested questions
 */

import type { UserRole, Language, SuggestionResponse } from './types';

const BASE_URL = 'https://ai-assistant-dashboard-presight.hinisa.ai';
const API_KEY = 'ajari_JVm7hSk14LUnwHaDlXrNR90dw1AIjkPcSenGs4YHFbUNR427PE7nxkPBKz';

/**
 * Fetch suggested questions for a specific role and language
 * @param role - User role (lnd, trainee, instructor, hr)
 * @param language - Language code (id, en)
 * @returns Promise resolving to suggestion response
 */
export async function getSuggestions(
  role: UserRole,
  language: Language
): Promise<SuggestionResponse> {
  try {
    const url = new URL(`${BASE_URL}/nisa/v1/suggestion`);
    url.searchParams.append('role', role);
    url.searchParams.append('language', language);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SuggestionResponse = await response.json();
    console.log('[AiAssistantSuggestion] Fetched suggestions:', data);
    return data;
  } catch (error) {
    console.error('[AiAssistantSuggestion] Error fetching suggestions:', error);
    throw error;
  }
}

/**
 * Fetch suggestions with caching (recommended by API docs)
 * Uses sessionStorage for client-side caching
 */
export async function getSuggestionsWithCache(
  role: UserRole,
  language: Language
): Promise<SuggestionResponse> {
  const cacheKey = `ai_suggestions_${role}_${language}`;
  
  // Check cache first
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed: SuggestionResponse = JSON.parse(cached);
      console.log('[AiAssistantSuggestion] Using cached suggestions');
      return parsed;
    } catch (error) {
      console.warn('[AiAssistantSuggestion] Cache parse error, fetching fresh data');
    }
  }

  // Fetch fresh data
  const data = await getSuggestions(role, language);
  
  // Cache the result
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.warn('[AiAssistantSuggestion] Failed to cache suggestions:', error);
  }

  return data;
}

/**
 * Clear cached suggestions
 */
export function clearSuggestionCache(role?: UserRole, language?: Language): void {
  if (role && language) {
    const cacheKey = `ai_suggestions_${role}_${language}`;
    sessionStorage.removeItem(cacheKey);
  } else {
    // Clear all suggestion caches
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith('ai_suggestions_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
}
