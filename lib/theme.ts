import { prisma } from "@/lib/db";

export const defaultTheme = {
  id: "theme",
  siteName: "Dal dolore al fitness",
  eyebrow: "Trasformazione, cura, forza",
  heroTitle: "Dal dolore al fitness",
  heroSubtitle:
    "Un percorso sincero per trasformare il peso emotivo e fisico in energia, disciplina e amore per te stessa.",
  introText:
    "Qui trovi racconti, strumenti e riflessioni pensati per donne che vogliono tornare a sentirsi bene nel proprio corpo e nella propria mente.",
  aboutTitle: "Un percorso condiviso",
  aboutText:
    "Questo blog nasce per accompagnare, con gentilezza e concretezza, chi sta attraversando un periodo di stanchezza, aumento di peso o disagio interiore.",
  ctaLabel: "Leggi gli articoli",
  ctaLink: "/#articoli",
  primaryColor: "#b85ca6",
  secondaryColor: "#8b7bf0",
  accentColor: "#f7ebff",
  backgroundColor: "#fff7fb",
  textColor: "#2d1833",
};

export async function getThemeSettings() {
  const current = await prisma.themeSettings.findUnique({ where: { id: "theme" } });
  if (current) {
    return current;
  }

  return prisma.themeSettings.create({ data: defaultTheme });
}
