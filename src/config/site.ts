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
  // TODO: real phone — current value was a fake (555-) placeholder.
  // Leaving empty until a real number is wired so it never renders.
  phone: '',
  email: 'hello@ascendsystems.ai',
  // TODO: replace with real booking URL when Calendly / Cal.com is set up.
  // Falsy values cause buttons to route to /contact instead.
  calendlyUrl: '',
  apiUrl: 'https://ascend-api.bmangum1.workers.dev/api',
};
