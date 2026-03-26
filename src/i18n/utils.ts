// src/i18n/utils.ts — Core i18n helpers for base-pages (Option B: English at root)

import type { Language } from './config';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './config';

import en from './en.json';
import de from './de.json';
import es from './es.json';

const translations: Record<Language, typeof en> = { en, de, es };

/**
 * Returns the full localized content object for a given language.
 * Falls back to English if the language is not supported.
 */
export function getI18n(lang: string): typeof en {
  const validLang = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : DEFAULT_LANGUAGE;
  return translations[validLang];
}

/**
 * Prefixes a path with the language code.
 * Option B: English stays at root (no prefix), other languages get /{lang} prefix.
 *
 * @example
 * localizeHref('en', '/about')     → '/about'
 * localizeHref('de', '/about')     → '/de/about'
 * localizeHref('es', '/services')  → '/es/services'
 */
export function localizeHref(lang: string, path: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (lang === DEFAULT_LANGUAGE) {
    return cleanPath;
  }

  return `/${lang}${cleanPath}`;
}

/**
 * Extracts the language from a URL pathname.
 * Option B: If no language prefix is found, returns 'en'.
 *
 * @example
 * getLangFromPath('/de/about')  → 'de'
 * getLangFromPath('/about')     → 'en'
 * getLangFromPath('/es/')       → 'es'
 */
export function getLangFromPath(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as Language)) {
    return firstSegment as Language;
  }

  return DEFAULT_LANGUAGE;
}
