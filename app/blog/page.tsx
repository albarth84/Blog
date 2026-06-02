import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { listPublishedPosts } from "@/lib/posts";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const [theme, posts] = await Promise.all([getThemeSettings(), listPublishedPosts()]);
  const featured = posts[0];

  return (
    <main>
      <SiteHeader siteName={theme.siteName} />

      <section className="section">
        <div className="container">
          <div className="archive-hero">
            <p className="eyebrow">Archivio</p>
            <h1>Blog</h1>
            <p className="lead">
              Qui trovi tutti gli articoli del sito, organizzati in modo semplice e coerente per una lettura più
              professionale.
            </p>
          </div>

          <div className="blog-layout">
            <aside className="blog-feature card">
              <div className="card-pad">
                <p className="eyebrow">Ultimo articolo</p>
                <h2>{featured?.title ?? "Nessun articolo pubblicato"}</h2>
                {featured ? (
                  <>
                    <p>{featured.excerpt}</p>
                    <Link className="button" href={`/blog/${featured.slug}`}>
                      Leggi ora
                    </Link>
                  </>
                ) : (
                  <p>Appena pubblichi il primo contenuto, apparirà qui.</p>
                )}
              </div>
              {featured?.coverImageUrl ? (
                <img className="feature-cover" src={featured.coverImageUrl} alt={featured.coverImageAlt || featured.title} />
              ) : null}
            </aside>

            <section className="posts-grid grid">
              {posts.map((post) => (
                <article className="card archive-card" key={post.id}>
                  {post.coverImageUrl ? (
                    <img className="archive-cover" src={post.coverImageUrl} alt={post.coverImageAlt || post.title} />
                  ) : (
                    <div className="archive-cover archive-cover-empty" />
                  )}
                  <div className="card-pad">
                    <div className="meta-row">
                      {post.featured ? <span className="badge">In evidenza</span> : null}
                      <span className="muted">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : ""}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link className="button-secondary" href={`/blog/${post.slug}`}>
                      Apri articolo
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
