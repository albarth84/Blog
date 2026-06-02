import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { listPublishedPosts } from "@/lib/posts";
import { PublicNav } from "@/components/PublicNav";

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
          <PublicNav />
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
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <Link className="button" href="/chi-sono">
                Chi sono
              </Link>
              <Link className="button-secondary" href="/admin">
                Area admin
              </Link>
            </div>
          </div>

          <div className="grid feature-grid">
            <article className="card card-pad">
              <span className="badge">Percorso</span>
              <h3>Fisico e mentale</h3>
              <p>
                Il blog racconta il cambiamento da due prospettive: il corpo che cambia e la testa che impara a
                sostenerlo.
              </p>
            </article>
            <article className="card card-pad">
              <span className="badge">Metodo</span>
              <h3>Gentile ma concreto</h3>
              <p>
                Niente approcci estremi: solo abitudini sostenibili, chiarezza e un tono che non giudica.
              </p>
            </article>
            <article className="card card-pad">
              <span className="badge">Obiettivo</span>
              <h3>Aiutare altre donne</h3>
              <p>
                Ogni articolo è pensato per chi vive lo stesso peso fisico o emotivo e vuole ripartire con
                più fiducia.
              </p>
            </article>
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

          <div className="card card-pad">
            <span className="badge">Risorse</span>
            <h2>Da dove iniziare</h2>
            <p>
              Se sei all’inizio del percorso, ti consiglio di partire da racconti brevi, realistici e ripetibili:
              ascolto del corpo, routine semplice, mente più calma.
            </p>
            <div className="hero-actions">
              <Link className="button-secondary" href="/chi-sono">
                Leggi la mia storia
              </Link>
              <Link className="button-secondary" href="/blog/il-primo-passo">
                Vai al primo articolo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
