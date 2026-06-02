import { prisma } from "@/lib/db";

export const defaultTheme = {
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

export async function getThemeSettings() {
  const current = await prisma.themeSettings.findUnique({ where: { id: "theme" } });
  if (current) {
    return current;
  }

  return prisma.themeSettings.create({ data: defaultTheme });
}
