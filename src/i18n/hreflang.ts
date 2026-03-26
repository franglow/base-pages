// src/i18n/hreflang.ts — Generates <link rel="alternate"> tags for SEO

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config';
import type { Language } from './config';

interface HreflangLink {
  lang: string;
  href: string;
}

/**
 * Generates hreflang alternate links for a given page path.
 * Option B: English pages have no prefix, other languages get /{lang} prefix.
 *
 * @param basePath - The path WITHOUT a language prefix (e.g., '/about', '/services/starter')
 * @param siteUrl  - The full site URL with protocol (e.g., 'https://basepages.dev')
 * @returns Array of { lang, href } objects for use in <link rel="alternate"> tags
 *
 * @example
 * generateHreflangLinks('/about', 'https://basepages.dev')
 * // Returns:
 * // [
 * //   { lang: 'en',      href: 'https://basepages.dev/about' },
 * //   { lang: 'de',      href: 'https://basepages.dev/de/about' },
 * //   { lang: 'es',      href: 'https://basepages.dev/es/about' },
 * //   { lang: 'x-default', href: 'https://basepages.dev/about' },
 * // ]
 */
export function generateHreflangLinks(basePath: string, siteUrl: string): HreflangLink[] {
  const cleanSiteUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`;

  const links: HreflangLink[] = SUPPORTED_LANGUAGES.map((lang: Language) => {
    const href = lang === DEFAULT_LANGUAGE
      ? `${cleanSiteUrl}${cleanPath}`
      : `${cleanSiteUrl}/${lang}${cleanPath}`;

    return { lang, href };
  });

  // x-default points to the English (default) version
  links.push({
    lang: 'x-default',
    href: `${cleanSiteUrl}${cleanPath}`,
  });

  return links;
}
