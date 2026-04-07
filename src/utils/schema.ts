// src/utils/schema.ts — JSON-LD Structured Data generators for base-pages

const SITE_URL = 'https://base-pages.com';
const SITE_NAME = 'base-pages';
const LOGO_URL = `${SITE_URL}/images/og-default.jpg`;

// TODO: Add your actual profile URLs here once available
const SAME_AS_PROFILES: string[] = [
  'https://www.linkedin.com/in/francortez/',
  'https://github.com/franglow',
  'https://franglow.github.io/',
];

const FOUNDER_SAME_AS: string[] = [
  'https://www.linkedin.com/in/francortez/',
  'https://github.com/franglow',
  'https://franglow.github.io/',
];

/**
 * Organization schema — used site-wide as the identity anchor.
 * References Founder via @id for bidirectional entity linking.
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
    founder: { '@id': `${SITE_URL}/#founder` },
    areaServed: 'Worldwide',
    serviceType: 'Web Development',
    priceRange: '€€',
    sameAs: SAME_AS_PROFILES,
    hasOfferCatalog: { '@id': `${SITE_URL}/#offer-catalog` },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${SITE_URL}/contact`,
      availableLanguage: ['English', 'Spanish', 'German'],
    },
  };
}

/**
 * Founder / Person schema — used on /about for entity disambiguation.
 * Bidirectional link: Person → Organization + Organization → Person.
 */
export function getFounderSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#founder`,
    name: 'Fran Cortez',
    jobTitle: 'Senior Web Engineer & Founder',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    knowsAbout: [
      'Astro Framework',
      'Web Performance Optimization',
      'Conversion Rate Optimization',
      'Technical SEO',
      'Generative Engine Optimization',
      'Landing Page Engineering',
    ],
    sameAs: FOUNDER_SAME_AS,
    url: `${SITE_URL}/about`,
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
 * Uses deliveryLeadTime (QuantitativeValue) instead of invalid providerMobility.
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

  // Parse "3-5 days" or "10-15 days" into min/max values
  const parseDelivery = (dt: string) => {
    const match = dt.match(/(\d+)\s*-\s*(\d+)/);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };
    const single = dt.match(/(\d+)/);
    if (single) return { min: parseInt(single[1]), max: parseInt(single[1]) };
    return null;
  };

  const deliveryParsed = deliveryTime ? parseDelivery(deliveryTime) : null;

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
        ...(deliveryParsed && {
          deliveryLeadTime: {
            '@type': 'QuantitativeValue',
            minValue: deliveryParsed.min,
            maxValue: deliveryParsed.max,
            unitCode: 'DAY',
          },
        }),
      },
    }),
  };
}

/**
 * OfferCatalog schema — wraps all 4 service tiers into a progressive hierarchy.
 * Used on /services index for LLM tier comprehension.
 */
export function getOfferCatalogSchema(
  services: { name: string; url: string; description: string; price: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/#offer-catalog`,
    name: 'base-pages Service Tiers',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: services.length,
    itemListElement: services.map((svc, index) => ({
      '@type': 'Offer',
      position: index + 1,
      name: svc.name,
      url: `${SITE_URL}${svc.url}`,
      description: svc.description,
      price: svc.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    })),
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
