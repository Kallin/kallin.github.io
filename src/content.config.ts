import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Social-card image (og:image / twitter:image). Use when the post wants a
			// purpose-built share card distinct from any in-body hero — e.g. a card with
			// the title baked in, which would read as duplicated if shown in the body.
			socialImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			// Multi-part series. `series` is a shared slug across the parts;
			// `seriesOrder` is the 1-based position. The SeriesNav component uses
			// these to render the breadcrumb + prev/next, and honours the draft
			// rule (unpublished parts never appear in the production nav).
			series: z.string().optional(),
			seriesOrder: z.number().optional(),
		}),
});

export const collections = { blog };
