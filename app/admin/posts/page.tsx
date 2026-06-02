import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeletePostButton } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: [{ updatedAt: "desc" }] });

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <div className="header-row" style={{ alignItems: "end" }}>
          <div>
            <span className="eyebrow">Articoli</span>
            <h2>Gestisci i contenuti</h2>
          </div>
          <Link className="button" href="/admin/posts/new">
            Nuovo articolo
          </Link>
        </div>
      </div>

      <div className="grid">
        {posts.map((post) => (
          <article className="panel" key={post.id}>
            <div className="header-row" style={{ alignItems: "start" }}>
              <div className="grid" style={{ gap: 8 }}>
                <div className="meta-row">
                  <span className="badge">{post.status}</span>
                  {post.featured ? <span className="badge">In evidenza</span> : null}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="muted">{post.slug}</div>
              </div>
              <div className="card-row">
                <Link className="button-secondary" href={`/admin/posts/${post.id}/edit`}>
                  Modifica
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
