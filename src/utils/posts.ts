import type { CollectionEntry } from 'astro:content';

/**
 * Visibility rule for blog posts.
 *
 * A post with `draft: true` is visible while developing (`astro dev`) so it
 * can be previewed at its real URL, but excluded from the production build so
 * it never ships. Flip `draft: false` in the post's frontmatter to publish.
 *
 * Works as both a `getCollection` filter callback and an `Array.filter`
 * predicate, since both receive a collection entry.
 */
export const isVisible = ({ data }: CollectionEntry<'blog'>) =>
	import.meta.env.PROD ? !data.draft : true;
