import { getThemeSettings } from "@/lib/theme";
import { ThemeEditor } from "@/components/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  const theme = await getThemeSettings();

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <span className="eyebrow">Tema</span>
        <h2>Personalizza l'aspetto del sito</h2>
        <p>Modifica colori, titolo, testi introduttivi e pulsanti senza toccare il codice.</p>
      </div>
      <div className="panel">
        <ThemeEditor
          initial={{
            siteName: theme.siteName,
            eyebrow: theme.eyebrow,
            heroTitle: theme.heroTitle,
            heroSubtitle: theme.heroSubtitle,
            introText: theme.introText,
            aboutTitle: theme.aboutTitle,
            aboutText: theme.aboutText,
            ctaLabel: theme.ctaLabel,
            ctaLink: theme.ctaLink,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            backgroundColor: theme.backgroundColor,
            textColor: theme.textColor,
          }}
        />
      </div>
    </div>
  );
}
