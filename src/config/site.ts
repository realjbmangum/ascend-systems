export const siteConfig: {
  brand: string;
  tagline: string;
  domain: string;
  company: string;
  location: string;
  founder: string;
  phone: string;
  email: string;
  calendlyUrl: string;
  apiUrl: string;
} = {
  brand: 'Ascend Systems',
  tagline: 'Software that moves your business forward.',
  domain: 'ascendsystems.ai',
  company: 'Lighthouse 27 LLC',
  location: 'Charlotte, NC',
  founder: 'Brian Mangum',
  // Ascend Systems' AI agent line (704). Must stay byte-identical everywhere it
  // appears — NAP consistency (name/address/phone) across the site, schema, and
  // any external directory listing is a direct local-ranking signal.
  // NOTE: (980) 577-1231 is the DEMO line (Imperial Climate Control tenant) and
  // lives only in the buyer's guide "call the demo" callout — not here.
  phone: '(704) 912-0876',
  email: 'hello@ascendsystems.ai',
  // TODO: replace with real booking URL when Calendly / Cal.com is set up.
  // Falsy values cause buttons to route to /contact instead.
  calendlyUrl: '',
  apiUrl: 'https://ascend-api.bmangum1.workers.dev/api',
};
