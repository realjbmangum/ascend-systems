import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `case-studies` collection (Astro 6 content layer)
 *
 * Source: src/content/case-studies/{slug}.md
 * Rendered: src/pages/portfolio/[slug].astro renders the body below
 * the React skeleton when a matching file exists.
 */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    client: z.string().optional(),
    clientType: z.string().optional(),
    industry: z.string().optional(),
    engagementStart: z.string().optional(),
    engagementEnd: z.string().optional(),
    status: z.string().optional(),
    stack: z.array(z.string()).optional(),
    metrics: z.array(z.string()).optional(),
    hero: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    screenshots: z
      .array(
        z.object({
          key: z.string().optional(),
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  'case-studies': caseStudies,
};
