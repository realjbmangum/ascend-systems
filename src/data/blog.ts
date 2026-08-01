/**
 * Blog post index — `/blog`
 *
 * One well-structured source of truth for the blog listing (`/blog`) and the
 * individual post pages, mirroring the services.ts / portfolio.ts convention so
 * the card on the index and the post's own <head> never drift.
 *
 * The blog is named "Insights". The flagship draft carried a placeholder series
 * name ("The Front Desk"); it is retired here in favour of the blog name.
 */

export interface BlogPost {
  slug: string;
  /** Post title — used for the card, the H1, and the <title>/OG. */
  title: string;
  /** Standfirst / dek shown under the title. */
  dek: string;
  /** ISO publish date (YYYY-MM-DD). */
  date: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** Meta description for the post's <head>. */
  description: string;
}

/** Display name for the blog, used as the eyebrow/series label sitewide. */
export const BLOG_NAME = 'Insights';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'builders-vs-bystanders',
    title:
      'Builders vs. Bystanders: What the Enterprise AI Race Means for a Business Your Size',
    dek: `A 43-page report just landed on my desk about how the world's biggest companies are racing to adopt AI. Here's the 2% that actually matters if you run a service business — and why the gap it describes is good news for you.`,
    date: '2026-07-31',
    readingMinutes: 4,
    description:
      'What a 43-page enterprise AI report actually means for a five-truck HVAC company or a three-location dental group — and why the "builders vs. bystanders" gap it describes is good news for a business your size.',
  },
];

/** Format an ISO date as e.g. "July 31, 2026". */
export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
