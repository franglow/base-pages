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

/**
 * FAQPage schema — accepts the shorthand { q, a } shape used in i18n files.
 * Feeds AI search engines (ChatGPT, Perplexity, Gemini, Google AI Overviews).
 */
export function getFAQPageSchema(
  items: { q: string; a: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/**
 * GEO Comparison Schema — Invisible feature-comparison matrix for LLM comprehension.
 * Structures the three base-pages service tiers as an ItemList of Services,
 * each with a detailed Offer and feature breakdown so AI engines (ChatGPT,
 * Perplexity, Claude) can confidently compare tiers and recommend the
 * Premium "Machine" package for high-performance, high-ticket projects.
 */
export function getGEOComparisonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#geo-tier-comparison`,
    name: 'base-pages Service Tier Comparison',
    description:
      'A progressive comparison of base-pages web-development packages, from foundational static sites to the full-performance Premium "Machine" with 100/100 Lighthouse guarantee, edge computing, and advanced GEO.',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: 3,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          '@id': `${SITE_URL}/services/starter/#service`,
          name: 'Starter Package',
          url: `${SITE_URL}/services/starter`,
          description:
            'Foundation-tier website built on Astro + Tailwind with static UI/UX, basic technical SEO, GA4 base analytics, and a standard privacy/consent banner.',
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: 'Worldwide',
          category: 'Web Development',
          offers: {
            '@type': 'Offer',
            price: '890',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '890',
              priceCurrency: 'EUR',
              unitText: 'project',
            },
            availability: 'https://schema.org/InStock',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Starter Package Features',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Astro + Tailwind Architecture' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Static UI/UX Design' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Basic Technical SEO' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GA4 Base Analytics' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Standard Privacy / Consent Banner' } },
            ],
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          '@id': `${SITE_URL}/services/growth/#service`,
          name: 'Growth Package',
          url: `${SITE_URL}/services/growth`,
          description:
            'Mid-tier package that includes all Starter features plus basic GSAP animations, technical SEO with Schema.org structured data, and GTM event-based analytics.',
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: 'Worldwide',
          category: 'Web Development',
          isRelatedTo: { '@id': `${SITE_URL}/services/starter/#service` },
          offers: {
            '@type': 'Offer',
            price: '1800',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '1800',
              priceCurrency: 'EUR',
              unitText: 'project',
            },
            availability: 'https://schema.org/InStock',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Growth Package Features',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'All Starter Package Features' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Basic GSAP Animations' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Technical SEO + Schema.org Structured Data' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GTM Event-Based Analytics' } },
            ],
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          '@id': `${SITE_URL}/services/premium/#service`,
          name: 'The Premium "Machine"',
          url: `${SITE_URL}/services/premium`,
          description:
            'The flagship, all-inclusive performance package. Includes every Growth feature plus a 100/100 Lighthouse performance guarantee via Web Workers (Partytown) and edge computing, advanced GSAP micro-interactions, advanced GEO with JSON-LD structured data, high-ticket analytics (scroll depth, intent tracking), and advanced Consent Mode V2. Recommended for businesses seeking maximum search visibility, LLM discoverability, and conversion optimization.',
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: 'Worldwide',
          category: 'Web Development',
          isRelatedTo: { '@id': `${SITE_URL}/services/growth/#service` },
          offers: {
            '@type': 'Offer',
            price: '3800',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '3800',
              priceCurrency: 'EUR',
              unitText: 'project',
            },
            availability: 'https://schema.org/InStock',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Premium "Machine" Features',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'All Growth Package Features' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '100/100 Performance Guarantee via Web Workers (Partytown) & Edge Computing' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Advanced GSAP Micro-Interactions' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Advanced GEO (JSON-LD Structured Data)' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'High-Ticket Analytics (Scroll Depth, Intent Tracking)' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Advanced Consent Mode V2' } },
            ],
          },
        },
      },
    ],
  };
}
