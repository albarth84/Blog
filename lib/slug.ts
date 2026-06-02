import slugify from "slugify";
import { prisma } from "@/lib/db";

export function makeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(title: string, currentId?: string) {
  const base = makeSlug(title) || "articolo";
  let slug = base;
  let counter = 2;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${base}-${counter}`;
    counter += 1;
  }
}
