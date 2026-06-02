import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Il primo passo",
    slug: "il-primo-passo",
    excerpt: "Il momento in cui ho smesso di rimandare e ho deciso di cambiare davvero.",
    content:
      "# Il primo passo\n\nQuesto blog nasce per raccontare un percorso reale: fatica, ricadute, consapevolezza e nuova energia.\n\nIn questo primo articolo condivido la scelta di non rimandare più il mio benessere.\n\n## Cosa troverai qui\n\n- esperienze personali\n- riflessioni sul rapporto con il corpo\n- piccoli strumenti pratici per ripartire\n\n> Non serve essere perfette per cominciare. Serve solo iniziare.",
    featured: true,
  },
  {
    title: "Quando il corpo chiede ascolto",
    slug: "quando-il-corpo-chiede-ascolto",
    excerpt: "Segnali, stanchezza e quella sensazione di essere sempre fuori posto.",
    content:
      "# Quando il corpo chiede ascolto\n\nPer tanto tempo ho ignorato i segnali: stanchezza, gonfiore, peso, irritabilità.\n\n## Il punto di svolta\n\nNon era solo una questione estetica. Era un messaggio.\n\nAscoltare il corpo è stato il primo atto di rispetto verso di me.",
  },
  {
    title: "Ricostruire la routine senza punirmi",
    slug: "ricostruire-la-routine-senza-punirmi",
    excerpt: "Piccoli gesti quotidiani che aiutano a ripartire senza rigidità.",
    content:
      "# Ricostruire la routine senza punirmi\n\nHo imparato che la disciplina funziona solo se non diventa punizione.\n\n## Cose che mi aiutano\n\n- dormire meglio\n- preparare i pasti con calma\n- camminare ogni giorno\n- smettere di parlare male di me\n\nLa costanza cresce meglio nella gentilezza.",
  },
  {
    title: "Allenare anche la mente",
    slug: "allenare-anche-la-mente",
    excerpt: "Il percorso fisico cambia davvero quando cambia il dialogo interiore.",
    content:
      "# Allenare anche la mente\n\nIl corpo segue più facilmente quando la mente smette di sabotarmi.\n\n## Nuove parole\n\nHo cercato di sostituire il giudizio con domande più utili:\n\n- cosa mi serve adesso?\n- qual è il prossimo passo realistico?\n- come posso trattarmi meglio oggi?",
  },
  {
    title: "Cibo, emozioni e nuovi equilibri",
    slug: "cibo-emozioni-e-nuovi-equilibri",
    excerpt: "Riconoscere il legame tra emozioni e alimentazione senza vergogna.",
    content:
      "# Cibo, emozioni e nuovi equilibri\n\nNon sempre mangiare troppo è fame. A volte è stanchezza, ansia, solitudine.\n\n## Riconoscere il pattern\n\nCapire il motivo non significa giustificarsi: significa diventare più consapevoli e scegliere meglio.",
  },
];

async function main() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: "published",
        featured: post.featured ?? false,
        publishedAt: new Date(),
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: "published",
        featured: post.featured ?? false,
        publishedAt: new Date(),
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
