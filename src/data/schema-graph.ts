/**
 * Sitewide JSON-LD `@graph` — Phase 1 schema markup from
 * docs/seo/2026-05-12-schema-markup.html.
 *
 * Emitted in the document head by `src/layouts/Layout.astro` on every page.
 * Per-page schema (FAQPage, Service, HowTo, Article, BreadcrumbList) goes
 * through the `<JsonLd>` component instead.
 *
 * Note: `telephone` is intentionally omitted from ProfessionalService
 * because the live siteConfig.phone is empty. Re-add when a real number
 * is published. Do NOT use a 555 placeholder — Google penalizes NAP
 * inconsistency.
 */

export const SITEWIDE_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. Organization
    {
      '@type': 'Organization',
      '@id': 'https://ascendsystems.ai/#organization',
      name: 'Ascend Systems',
      legalName: 'Lighthouse 27 LLC',
      url: 'https://ascendsystems.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ascendsystems.ai/images/logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://ascendsystems.ai/og-image.png',
      description:
        'Charlotte-based technology consultancy. One senior engineer building custom SaaS, AI agents, internal tools, and legacy modernization for owner-operator businesses.',
      founder: { '@id': 'https://ascendsystems.ai/#brian-mangum' },
      foundingDate: '2024',
      foundingLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Charlotte',
          addressRegion: 'NC',
          addressCountry: 'US',
        },
      },
      areaServed: [
        { '@type': 'City', name: 'Charlotte' },
        { '@type': 'AdministrativeArea', name: 'North Carolina' },
        { '@type': 'Country', name: 'United States' },
      ],
      knowsAbout: [
        'Custom SaaS development',
        'AI agent development',
        'LLM application engineering',
        'Internal tooling and dashboards',
        'Legacy system modernization',
        'Fractional CTO services',
        'React',
        'TypeScript',
        'Cloudflare Workers',
        'Supabase',
        'PostgreSQL',
      ],
      sameAs: [
        'https://www.linkedin.com/in/brian-mangum-charlotte',
        'https://github.com/realjbmangum',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'bmangum1@gmail.com',
        areaServed: 'US',
        availableLanguage: ['English'],
      },
    },

    // 2. ProfessionalService (LocalBusiness)
    {
      '@type': 'ProfessionalService',
      '@id': 'https://ascendsystems.ai/#localbusiness',
      name: 'Ascend Systems',
      image: 'https://ascendsystems.ai/og-image.png',
      url: 'https://ascendsystems.ai',
      email: 'bmangum1@gmail.com',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Charlotte',
        addressRegion: 'NC',
        postalCode: '28202',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 35.2271,
        longitude: -80.8431,
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Charlotte',
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: 'North Carolina',
          },
        },
        { '@type': 'City', name: 'Concord' },
        { '@type': 'City', name: 'Gastonia' },
        { '@type': 'City', name: 'Huntersville' },
        { '@type': 'City', name: 'Rock Hill' },
        { '@type': 'City', name: 'Matthews' },
        { '@type': 'AdministrativeArea', name: 'North Carolina' },
        { '@type': 'AdministrativeArea', name: 'South Carolina' },
      ],
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 35.2271,
          longitude: -80.8431,
        },
        geoRadius: '80000',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      founder: { '@id': 'https://ascendsystems.ai/#brian-mangum' },
      parentOrganization: { '@id': 'https://ascendsystems.ai/#organization' },
      sameAs: [
        'https://www.linkedin.com/in/brian-mangum-charlotte',
        'https://github.com/realjbmangum',
      ],
    },

    // 3. Person — Brian Mangum
    {
      '@type': 'Person',
      '@id': 'https://ascendsystems.ai/#brian-mangum',
      name: 'Brian Mangum',
      givenName: 'Brian',
      familyName: 'Mangum',
      jobTitle: 'Founder & Principal Engineer',
      description:
        'Senior full-stack engineer and fractional CTO based in Charlotte, NC. Founder of Ascend Systems (Lighthouse 27 LLC). Ships custom SaaS, AI agents, and internal tooling for owner-operator businesses.',
      image: 'https://ascendsystems.ai/images/brian-mangum.jpg',
      url: 'https://ascendsystems.ai/about',
      email: 'bmangum1@gmail.com',
      worksFor: { '@id': 'https://ascendsystems.ai/#organization' },
      founder: { '@id': 'https://ascendsystems.ai/#organization' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Charlotte',
        addressRegion: 'NC',
        addressCountry: 'US',
      },
      knowsAbout: [
        'Custom SaaS development',
        'AI agent and LLM application engineering',
        'Fractional CTO services',
        'Legacy system modernization',
        'React',
        'TypeScript',
        'Node.js',
        'Cloudflare Workers',
        'Supabase',
        'PostgreSQL',
      ],
      sameAs: [
        'https://www.linkedin.com/in/brian-mangum-charlotte',
        'https://github.com/realjbmangum',
      ],
    },

    // 4. WebSite (SearchAction omitted until /search ships)
    {
      '@type': 'WebSite',
      '@id': 'https://ascendsystems.ai/#website',
      url: 'https://ascendsystems.ai',
      name: 'Ascend Systems',
      description:
        'Charlotte technology consultancy — custom SaaS, AI agents, internal tools, legacy modernization, fractional CTO.',
      publisher: { '@id': 'https://ascendsystems.ai/#organization' },
      inLanguage: 'en-US',
    },
  ],
};
