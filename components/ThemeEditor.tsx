"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type ThemeEditorProps = {
  initial: {
    siteName: string;
    eyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    introText: string;
    aboutTitle: string;
    aboutText: string;
    ctaLabel: string;
    ctaLink: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
};

const labels: Record<keyof ThemeEditorProps["initial"], string> = {
  siteName: "Nome sito",
  eyebrow: "Sottotitolo hero",
  heroTitle: "Titolo hero",
  heroSubtitle: "Descrizione hero",
  introText: "Testo introduttivo",
  aboutTitle: "Titolo sezione about",
  aboutText: "Testo sezione about",
  ctaLabel: "Testo pulsante",
  ctaLink: "Link pulsante",
  primaryColor: "Colore primario",
  secondaryColor: "Colore secondario",
  accentColor: "Colore accent",
  backgroundColor: "Colore sfondo",
  textColor: "Colore testo",
};

const colorFields = new Set<keyof ThemeEditorProps["initial"]>([
  "primaryColor",
  "secondaryColor",
  "accentColor",
  "backgroundColor",
  "textColor",
]);

export function ThemeEditor({ initial }: ThemeEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Salvataggio tema non riuscito");
      }

      router.refresh();
      setMessage("Tema aggiornato correttamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore imprevisto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid" onSubmit={handleSubmit}>
      <div className="form-grid">
        {[
          "siteName",
          "eyebrow",
          "heroTitle",
          "heroSubtitle",
          "introText",
          "aboutTitle",
          "aboutText",
          "ctaLabel",
          "ctaLink",
          "primaryColor",
          "secondaryColor",
          "accentColor",
          "backgroundColor",
          "textColor",
        ].map((key) => (
          <label className="field" key={key}>
            <span>{labels[key as keyof ThemeEditorProps["initial"]]}</span>
            <input
              type={colorFields.has(key as keyof ThemeEditorProps["initial"]) ? "color" : "text"}
              value={form[key as keyof typeof form]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
            />
          </label>
        ))}
      </div>

      {message ? <div className="note">{message}</div> : null}

      <div className="hero-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Salvataggio..." : "Salva tema"}
        </button>
      </div>
    </form>
  );
}
