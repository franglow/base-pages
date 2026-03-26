// src/i18n/config.ts — Language configuration for base-pages

export const SUPPORTED_LANGUAGES = ['en', 'de', 'es'] as const;
export const DEFAULT_LANGUAGE = 'en' as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Language display names for UI (e.g., language switchers) */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
};
