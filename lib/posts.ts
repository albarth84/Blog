import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";
import { uniqueSlug } from "@/lib/slug";

type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  status?: PostStatus;
  featured?: boolean;
};

export async function listPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function listAllPosts() {
  return prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(input: PostInput) {
  const slug = await uniqueSlug(input.title);

  return prisma.post.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImageUrl: input.coverImageUrl || null,
      coverImageAlt: input.coverImageAlt || null,
      status: input.status ?? "draft",
      featured: input.featured ?? false,
      publishedAt: input.status === "published" ? new Date() : null,
    },
  });
}

export async function updatePost(id: string, input: PostInput) {
  const current = await getPostById(id);

  if (!current) {
    throw new Error("POST_NOT_FOUND");
  }

  const slug = current.title === input.title ? current.slug : await uniqueSlug(input.title, id);
  const shouldBePublished = input.status === "published";

  return prisma.post.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImageUrl: input.coverImageUrl || null,
      coverImageAlt: input.coverImageAlt || null,
      status: input.status ?? "draft",
      featured: input.featured ?? false,
      publishedAt: shouldBePublished ? current.publishedAt ?? new Date() : null,
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
