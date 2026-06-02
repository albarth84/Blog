import { getThemeSettings } from "@/lib/theme";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function ChiSonoPage() {
  const theme = await getThemeSettings();

  return (
    <main>
      <SiteHeader siteName={theme.siteName} />

      <section className="section">
        <div className="container">
          <article className="prose page-prose">
            <div className="eyebrow">Chi sono</div>
            <h1>Un approccio serio al fitness</h1>
            <p className="lead">
              Questo progetto nasce per parlare di allenamento, recupero e costanza con un tono professionale,
              diretto e concreto.
            </p>
            <p>
              L’obiettivo è aiutare chi legge a fare scelte più chiare, più sostenibili e più efficaci nel tempo.
              Qui il corpo non viene trattato come una corsa contro il tempo, ma come qualcosa da guidare con metodo.
            </p>
            <div className="grid profile-grid">
              <article className="card card-pad">
                <h3>Metodo</h3>
                <p>
                  Contenuti costruiti per essere applicabili, non decorativi. Ogni articolo deve lasciare qualcosa di
                  utile da usare subito.
                </p>
              </article>
              <article className="card card-pad">
                <h3>Qualita</h3>
                <p>
                  Tono pulito, gerarchia visiva ordinata, niente ridondanza. Il sito deve sembrare affidabile al primo
                  colpo d’occhio.
                </p>
              </article>
              <article className="card card-pad">
                <h3>Continuita</h3>
                <p>
                  Il percorso migliore è quello che si riesce a mantenere. Questo blog mette al centro abitudini e
                  progressi realistici.
                </p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
