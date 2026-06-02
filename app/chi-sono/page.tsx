import Link from "next/link";
import { getThemeSettings } from "@/lib/theme";
import { PublicNav } from "@/components/PublicNav";

export const dynamic = "force-dynamic";

export default async function ChiSonoPage() {
  const theme = await getThemeSettings();

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

      <section className="section">
        <div className="container">
          <article className="prose">
            <div className="eyebrow">Chi sono</div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.6rem)", marginTop: 12 }}>Il volto dietro il percorso</h1>
            <p className="lead">
              Questo spazio nasce per raccontare con onestà un cambiamento reale: non solo il corpo, ma anche il modo
              di stare dentro le giornate, dentro le emozioni e dentro le ricadute.
            </p>
            <p>
              Ho creato <strong>Dal dolore al fitness</strong> per condividere un cammino che possa essere utile a chi
              si sente stanca, svuotata, appesantita o distante da se stessa.
            </p>
            <p>
              Qui troverai articoli sinceri, momenti difficili, piccoli progressi, strategie pratiche e parole che
              non giudicano. L’obiettivo non è diventare perfette, ma più libere, forti e presenti.
            </p>
            <div className="grid" style={{ gap: 16, marginTop: 24 }}>
              <div className="card card-pad">
                <h3>La mia promessa</h3>
                <p>
                  Raccontare il percorso senza filtri inutili, con gentilezza ma anche con concretezza, perché il
                  cambiamento vero ha bisogno di verità.
                </p>
              </div>
              <div className="card card-pad">
                <h3>A chi è dedicato</h3>
                <p>
                  A donne che vivono aumento di peso, malessere fisico, stanchezza mentale o il bisogno di ripartire
                  da sé con più rispetto e più cura.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
