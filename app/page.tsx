import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { listPublishedPosts } from "@/lib/posts";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const focusCards = [
  {
    eyebrow: "Allenamento",
    title: "Programmi pratici",
    text: "Linee guida semplici per allenarti con metodo, senza sovraccarichi inutili e con attenzione alla progressione.",
  },
  {
    eyebrow: "Recupero",
    title: "Cura del corpo",
    text: "Spazio a mobilità, gestione del dolore e abitudini sostenibili per mantenere continuità nel tempo.",
  },
  {
    eyebrow: "Costanza",
    title: "Risultati reali",
    text: "Un approccio pulito e credibile: piccoli passi, obiettivi chiari e contenuti che aiutano davvero a restare sul percorso.",
  },
];

export default async function HomePage() {
  const [theme, posts] = await Promise.all([getThemeSettings(), listPublishedPosts()]);
  const featured = posts[0];
  const recentPosts = posts.slice(0, 4);

  return (
    <main>
      <SiteHeader siteName={theme.siteName} />

      <section className="section hero-section">
        <div className="container">
          <div className="hero-home">
            <div className="hero-home-copy">
              <p className="eyebrow">{theme.eyebrow}</p>
              <h1>{theme.heroTitle}</h1>
              <p className="lead">{theme.heroSubtitle}</p>
              <p>{theme.introText}</p>
              <div className="hero-actions">
                <a className="button" href="/blog">
                  Vai al blog
                </a>
                <a className="button-secondary" href="/chi-sono">
                  Scopri chi sono
                </a>
              </div>
            </div>

            <aside className="hero-highlight card">
              <div className="hero-highlight-copy">
                <p className="eyebrow">Ultimo articolo</p>
                <h2>{featured?.title ?? "Nessun articolo pubblicato"}</h2>
                <p>{featured?.excerpt ?? "Appena pubblichi il primo contenuto, apparirà qui."}</p>
                {featured ? (
                  <Link className="button" href={`/blog/${featured.slug}`}>
                    Leggi adesso
                  </Link>
                ) : null}
              </div>
              {featured?.coverImageUrl ? (
                <img
                  className="hero-highlight-image"
                  src={featured.coverImageUrl}
                  alt={featured.coverImageAlt || featured.title}
                />
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid focus-grid">
            {focusCards.map((card) => (
              <article className="card card-pad focus-card" key={card.title}>
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <article className="card about-card">
              <div className="card-pad">
                <p className="eyebrow">Chi sono</p>
                <h2>{theme.aboutTitle}</h2>
                <p>{theme.aboutText}</p>
                <div className="hero-actions">
                  <Link className="button" href="/chi-sono">
                    Leggi la storia
                  </Link>
                  <Link className="button-secondary" href="/contatti">
                    Contatti
                  </Link>
                </div>
              </div>
            </article>

            <aside className="card latest-side">
              <div className="card-pad">
                <p className="eyebrow">Ultimo articolo</p>
                <h2>Un percorso ordinato, passo dopo passo</h2>
                <p>
                  Il blog raccoglie articoli pratici su allenamento, recupero e costanza. La logica è quella di
                  un diario editoriale pulito, facile da leggere e facile da aggiornare.
                </p>
              </div>
              {featured?.coverImageUrl ? (
                <img
                  className="latest-side-image"
                  src={featured.coverImageUrl}
                  alt={featured.coverImageAlt || featured.title}
                />
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Cosa trovi qui</p>
              <h2>Articoli chiari, layout ordinato, lettura veloce</h2>
            </div>
            <Link className="button-secondary" href="/blog">
              Vai all'archivio
            </Link>
          </div>
          <div className="grid archive-grid">
            {recentPosts.map((post) => (
              <article className="card archive-card" key={post.id}>
                {post.coverImageUrl ? (
                  <img className="archive-cover" src={post.coverImageUrl} alt={post.coverImageAlt || post.title} />
                ) : (
                  <div className="archive-cover archive-cover-empty" />
                )}
                <div className="card-pad">
                  <div className="meta-row">
                    <span className="muted">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : ""}
                    </span>
                    {post.featured ? <span className="badge">In evidenza</span> : null}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link className="button-secondary" href={`/blog/${post.slug}`}>
                    Leggi articolo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
