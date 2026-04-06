// src/utils/schema.ts — JSON-LD Structured Data generators for base-pages

const SITE_URL = 'https://basepages.dev';
const SITE_NAME = 'base-pages';
const LOGO_URL = `${SITE_URL}/images/og-default.jpg`;

/**
 * Organization schema — used site-wide as the identity anchor.
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      'Boutique web studio specializing in ultra-fast, conversion-optimized websites built with Astro.',
    founder: {
      '@type': 'Person',
      name: 'Franco Cortez',
      url: `${SITE_URL}/about`,
    },
    areaServed: 'Worldwide',
    serviceType: 'Web Development',
    priceRange: '€€',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${SITE_URL}/contact`,
      availableLanguage: ['English', 'Spanish', 'German'],
    },
  };
}

/**
 * WebSite schema — used on the homepage for sitelinks search box.
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['en', 'es', 'de'],
  };
}

/**
 * Service schema — used on each service landing page.
 */
export function getServiceSchema(params: {
  name: string;
  description: string;
  price: string;
  currency?: string;
  url: string;
  deliveryTime?: string;
}) {
  const { name, description, price, currency = 'EUR', url, deliveryTime } = params;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'Worldwide',
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.replace(/[^0-9.]/g, ''),
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(deliveryTime && {
      providerMobility: deliveryTime,
    }),
  };
}

/**
 * BreadcrumbList schema — used on all inner pages.
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * ItemList schema — used on the services index page.
 */
export function getServiceListSchema(
  services: { name: string; url: string; description: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: svc.name,
      url: `${SITE_URL}${svc.url}`,
      description: svc.description,
    })),
  };
}

/**
 * FAQPage schema — for future use on service pages with FAQ sections.
 */
export function getFAQSchema(
  items: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
