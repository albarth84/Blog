import { NextResponse } from "next/server";
import { z } from "zod";
import { createPost, listPublishedPosts } from "@/lib/posts";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().optional().default(false),
});

export async function GET() {
  const posts = await listPublishedPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dati articolo non validi" }, { status: 400 });
  }

  const post = await createPost(parsed.data);
  return NextResponse.json(post, { status: 201 });
}
