import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const theme = await getThemeSettings();

  return (
    <main>
      <SiteHeader siteName={theme.siteName} />

      <section className="section">
        <div className="container">
          <article className="prose contact-prose">
            <p className="eyebrow">Contatti</p>
            <h1>Scrivimi per collaborazioni o informazioni</h1>
            <p className="lead">
              Se hai domande, richieste editoriali o vuoi proporre un contenuto, puoi scrivermi direttamente via email.
            </p>
            <div className="card-row">
              <a className="button" href="mailto:alb.cioffi@gmail.com">
                Invia una email
              </a>
              <Link className="button-secondary" href="/blog">
                Leggi gli articoli
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
