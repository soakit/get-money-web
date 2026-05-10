import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const settlements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/settlements" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    amount: z.string(), // e.g. "Up to $50", "Varies"
    deadline: z.coerce.date(),
    noProofRequired: z.boolean().default(false),
    officialUrl: z.string().url(),
  }),
});

export const collections = { settlements };
