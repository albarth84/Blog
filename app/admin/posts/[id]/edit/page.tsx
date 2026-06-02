import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <span className="eyebrow">Modifica articolo</span>
        <h2>{post.title}</h2>
        <p>Aggiorna testo, stato, copertina e media incorporati.</p>
      </div>
      <div className="panel">
        <PostEditor
          mode="edit"
          initial={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImageUrl: post.coverImageUrl,
            coverImageAlt: post.coverImageAlt,
            status: post.status,
            featured: post.featured,
          }}
        />
      </div>
    </div>
  );
}
