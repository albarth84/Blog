import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const theme = {
  id: "theme",
  siteName: "Dal dolore al Fitness",
  eyebrow: "Fitness, recupero, metodo",
  heroTitle: "Dal dolore al Fitness",
  heroSubtitle:
    "Un blog essenziale e concreto per allenarti meglio, recuperare con criterio e costruire abitudini che durano.",
  introText:
    "Contenuti chiari, niente rumore, solo indicazioni utili per migliorare corpo, mente e costanza nel tempo.",
  aboutTitle: "Un punto di riferimento chiaro, senza eccessi",
  aboutText:
    "Questo spazio è pensato per chi vuole migliorare corpo e abitudini con un linguaggio diretto, professionale e leggibile.",
  ctaLabel: "Vai al blog",
  ctaLink: "/blog",
  primaryColor: "#d6a84f",
  secondaryColor: "#203244",
  accentColor: "#f7f8fa",
  backgroundColor: "#eef1f4",
  textColor: "#0f1720",
};

const posts = [
  {
    title: "Programma 5 giorni: schede complete di allenamento, cardio e recupero",
    slug: "programma-5-giorni-schede-allenamento-cardio-recupero",
    excerpt: "Una settimana strutturata con due sedute lower, due upper e una giornata di recupero attivo.",
    coverImageUrl: "/reference/post-programma5.jpg",
    coverImageAlt: "Programma 5 giorni fitness",
    featured: true,
    content: `# Programma 5 giorni\n\nQuesto programma descrive una settimana di lavoro semplice da seguire e facile da adattare.\n\n![Programma 5 giorni](/reference/post-programma5.jpg)\n\n## Schema della settimana\n\n- Due sedute lower body\n- Due sedute upper body\n- Una giornata di recupero attivo\n\n## Obiettivo\n\nL'idea non è accumulare fatica, ma creare una progressione sostenibile che si possa ripetere con costanza.`,
  },
  {
    title: "Progressive overload: il metodo per migliorare davvero",
    slug: "progressive-overload-migliorare-davvero",
    excerpt: "Aumentare gradualmente il carico di lavoro per ottenere progresso reale senza caos.",
    coverImageUrl: "/reference/post-progressive.jpg",
    coverImageAlt: "Clipboard e manubrio per il progressive overload",
    featured: true,
    content: `# Progressive overload\n\nIl progressive overload è il principio più semplice e più importante per fare progresso.\n\n![Progressive overload](/reference/post-progressive.jpg)\n\n## Come applicarlo\n\nAumenta un solo elemento per volta: carico, ripetizioni, serie o densità.\n\n## Perché funziona\n\nLa crescita arriva quando il corpo riceve uno stimolo misurabile e poi ha tempo per adattarsi.`,
  },
  {
    title: "Circuit training full body: come allenarsi bene in poco tempo",
    slug: "circuit-training-full-body",
    excerpt: "Una soluzione pratica per chi ha poco tempo ma vuole una seduta completa e intensa.",
    coverImageUrl: "/reference/post-circuit.jpg",
    coverImageAlt: "Circuit training",
    content: `# Circuit training full body\n\nIl circuito funziona quando vuoi densità di lavoro, frequenza cardiaca alta e struttura semplice.\n\n![Circuit training](/reference/post-circuit.jpg)\n\n## Struttura base\n\nScegli esercizi per spinta, trazione, squat, hinge e core.\n\n## Regola pratica\n\nLa tecnica viene prima della velocità: il circuito deve restare allenamento, non disordine.`,
  },
  {
    title: "Zone 2 cardio: come usarlo per migliorare resistenza e recupero",
    slug: "zone-2-cardio-resistenza-recupero",
    excerpt: "Il lavoro aerobico che costruisce base, resistenza e capacità di recupero.",
    coverImageUrl: "/reference/post-zone2.jpg",
    coverImageAlt: "Tapis roulant per cardio zona 2",
    content: `# Zone 2 cardio\n\nLa Zone 2 è il lavoro aerobico che costruisce base e recupero.\n\n![Zone 2 cardio](/reference/post-zone2.jpg)\n\n## Come riconoscerla\n\nRiesci a parlare a frasi brevi, ma senti il respiro più impegnato.\n\n## Inserimento pratico\n\nDue uscite settimanali da 30-45 minuti sono un ottimo punto di partenza.`,
  },
  {
    title: "HIIT o cardio continuo? Come scegliere il metodo giusto",
    slug: "hiit-o-cardio-continuo",
    excerpt: "Due strumenti diversi, da usare con obiettivi e carichi ben distinti.",
    coverImageUrl: "/reference/post-hiit.jpg",
    coverImageAlt: "Atleta che salta la corda",
    content: `# HIIT o cardio continuo\n\nLe due opzioni non sono intercambiabili: servono obiettivi diversi.\n\n![HIIT](/reference/post-hiit.jpg)\n\n## Quando scegliere HIIT\n\nSe hai poco tempo e vuoi uno stimolo metabolico alto.\n\n## Quando scegliere cardio continuo\n\nSe vuoi una gestione più semplice da recuperare e sostenibile nel tempo.`,
  },
  {
    title: "Periodizzazione dell'allenamento: come costruire un mese efficace",
    slug: "periodizzazione-allenamento",
    excerpt: "Organizzare il mese aiuta a non andare a caso e a migliorare con più lucidità.",
    coverImageUrl: "/reference/post-periodizzazione.jpg",
    coverImageAlt: "Clipboard con piano di allenamento",
    content: `# Periodizzazione dell'allenamento\n\nLa periodizzazione dà ordine al lavoro e riduce il rischio di improvvisare.\n\n![Periodizzazione](/reference/post-periodizzazione.jpg)\n\n## Obiettivo\n\nCostruire una sequenza di settimane con carico, volume e recupero leggibili.\n\n## Vantaggio\n\nUn mese ben pianificato ti fa percepire meglio i progressi e gestire la fatica.`,
  },
  {
    title: "Bike ed elliptical: cardio a basso impatto e alta resa",
    slug: "bike-elliptical-cardio",
    excerpt: "Due strumenti utili per lavorare sul cardio senza stress eccessivo sulle articolazioni.",
    coverImageUrl: "/reference/post-zone2.jpg",
    coverImageAlt: "Cardio a basso impatto",
    content: `# Bike ed elliptical\n\nQuando vuoi ridurre l'impatto, bike ed elliptical sono due opzioni molto solide.\n\n## Quando usarle\n\nIn giorni di recupero, nei blocchi ad alto volume o quando senti il bisogno di alleggerire le articolazioni.`,
  },
  {
    title: "Treadmill workout: come usarlo senza sprecare energia",
    slug: "treadmill-workout",
    excerpt: "Il tapis roulant può diventare una seduta utile se lo usi con ritmo e intenzione.",
    coverImageUrl: "/reference/post-zone2.jpg",
    coverImageAlt: "Tapis roulant",
    content: `# Treadmill workout\n\nIl tapis roulant è efficace se non lo trasformi in una corsa caotica.\n\n## Regola pratica\n\nScegli un ritmo sostenibile e mantieni la tecnica pulita dal primo all'ultimo minuto.`,
  },
];

async function main() {
  await prisma.post.deleteMany();

  await prisma.themeSettings.upsert({
    where: { id: "theme" },
    update: theme,
    create: theme,
  });

  for (const [index, post] of posts.entries()) {
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        coverImageAlt: post.coverImageAlt,
        status: "published",
        featured: Boolean(post.featured),
        publishedAt: new Date(Date.now() - index * 60000),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
