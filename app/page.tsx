import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [theme, posts] = await Promise.all([getThemeSettings(), listPublishedPosts()]);
  const featured = posts.filter((post) => post.featured).slice(0, 1)[0] ?? posts[0];

  return (
    <main>
      <header className="site-header">
        <div className="container header-row">
          <Link href="/" className="brand">
            <span className="brand-mark" />
            <span>{theme.siteName}</span>
          </Link>
          <Link href="/admin" className="button-secondary">
            Area admin
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <div className="eyebrow">{theme.eyebrow}</div>
            <h1>{theme.heroTitle}</h1>
            <p className="lead">{theme.heroSubtitle}</p>
            <p>{theme.introText}</p>
            <div className="hero-actions">
              <a className="button" href={theme.ctaLink}>
                {theme.ctaLabel}
              </a>
              <a className="button-secondary" href="#articoli">
                Scorri gli articoli
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid" style={{ gap: 18 }}>
          <div className="card card-pad">
            <h2>{theme.aboutTitle}</h2>
            <p>{theme.aboutText}</p>
          </div>

          <div id="articoli" className="grid posts-grid">
            {posts.length === 0 ? (
              <div className="card card-pad">
                <h3>Nessun articolo ancora pubblicato</h3>
                <p>Appena inserirai i primi contenuti dal pannello admin, appariranno qui.</p>
              </div>
            ) : (
              posts.map((post) => (
                <article className="card post-card" key={post.id}>
                  {post.coverImageUrl ? (
                    <img className="post-cover" src={post.coverImageUrl} alt={post.coverImageAlt || post.title} />
                  ) : (
                    <div className="post-cover" />
                  )}
                  <div className="post-body">
                    <div className="meta-row">
                      {post.featured ? <span className="badge">In evidenza</span> : null}
                      <span className="muted">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : ""}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link className="button-secondary" href={`/blog/${post.slug}`}>
                      Leggi articolo
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          {featured ? (
            <div className="card card-pad">
              <span className="badge">Articolo in evidenza</span>
              <h2 style={{ marginTop: 12 }}>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link className="button" href={`/blog/${featured.slug}`}>
                Apri ora
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
