import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [posts, published, drafts, mediaCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.mediaAsset.count(),
  ]);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <span className="eyebrow">Dashboard</span>
        <h2>Gestione completa del sito</h2>
        <p>Qui controlli articoli, tema grafico e media per il blog Dal dolore al fitness.</p>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <strong>{posts}</strong>
          Articoli totali
        </div>
        <div className="stat">
          <strong>{published}</strong>
          Pubblicati
        </div>
        <div className="stat">
          <strong>{drafts}</strong>
          Bozze
        </div>
        <div className="stat">
          <strong>{mediaCount}</strong>
          Media caricati
        </div>
      </div>

      <div className="card-row">
        <Link className="button" href="/admin/posts/new">
          Scrivi articolo
        </Link>
        <Link className="button-secondary" href="/admin/theme">
          Modifica tema
        </Link>
        <Link className="button-secondary" href="/admin/media">
          Apri media library
        </Link>
      </div>
    </div>
  );
}
