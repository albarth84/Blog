"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { renderContent } from "@/lib/content";

type PostEditorProps = {
  mode: "create" | "edit";
  initial?: {
    id?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string | null;
    coverImageAlt?: string | null;
    status?: "draft" | "published";
    featured?: boolean;
  };
};

export function PostEditor({ mode, initial }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(initial?.coverImageAlt ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const preview = useMemo(() => renderContent(content), [content]);

  function insertAtCursor(snippet: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((current) => `${current}\n${snippet}\n`);
      return;
    }

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const next = `${content.slice(0, start)}${snippet}${content.slice(end)}`;
    setContent(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const position = start + snippet.length;
      textarea.setSelectionRange(position, position);
    });
  }

  async function uploadSelectedFile() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload non riuscito");
      }

      const data = (await response.json()) as { url: string; type: "image" | "video" };
      const snippet =
        data.type === "video"
          ? `\n<video controls playsinline src="${data.url}"></video>\n`
          : `\n<img src="${data.url}" alt="${coverImageAlt || title || "Immagine articolo"}" loading="lazy" />\n`;

      insertAtCursor(snippet);
      setMessage("Media caricato e inserito nell'articolo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante l'upload.");
    } finally {
      setSaving(false);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(mode === "edit" && initial?.id ? `/api/posts/${initial.id}` : "/api/posts", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImageUrl,
          coverImageAlt,
          status,
          featured,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Salvataggio non riuscito");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore imprevisto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid" onSubmit={handleSubmit}>
      <div className="editor-grid">
        <div className="grid">
          <label className="field">
            <span>Titolo</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>

          <label className="field">
            <span>Estratto</span>
            <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} required />
          </label>

          <label className="field">
            <span>Contenuto</span>
            <div className="toolbar">
              <button type="button" className="button-secondary" onClick={() => insertAtCursor("<h2>Sottotitolo</h2>\n")}>
                Titolo H2
              </button>
              <button type="button" className="button-secondary" onClick={() => insertAtCursor("\n<img src=\"\" alt=\"\" loading=\"lazy\" />\n")}>
                Immagine
              </button>
              <button type="button" className="button-secondary" onClick={() => insertAtCursor("\n<video controls playsinline src=\"\"></video>\n")}>
                Video
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Scrivi qui il testo dell'articolo. Puoi inserire immagini e video con il pulsante dedicato."
              required
            />
          </label>

          <div className="field">
            <span>Anteprima</span>
            <div className="prose" dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="grid">
              <label className="field">
                <span>Immagine di copertina</span>
                <input value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} placeholder="URL immagine" />
              </label>

              <label className="field">
                <span>Alt immagine</span>
                <input value={coverImageAlt} onChange={(event) => setCoverImageAlt(event.target.value)} placeholder="Testo alternativo" />
              </label>

              <label className="field">
                <span>Stato</span>
                <select value={status} onChange={(event) => setStatus(event.target.value as "draft" | "published")}>
                  <option value="draft">Bozza</option>
                  <option value="published">Pubblicato</option>
                </select>
              </label>

              <label className="field" style={{ display: "flex", alignItems: "center", gap: 10, gridTemplateColumns: "unset" }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                  style={{ width: "auto" }}
                />
                <span>Metti in evidenza</span>
              </label>

              <div className="note">
                Carica immagini o video, poi inseriscili direttamente nel testo con l'anteprima qui sopra.
              </div>

              <label className="field">
                <span>Upload media</span>
                <input ref={fileRef} type="file" accept="image/*,video/*" />
              </label>

              <button type="button" className="button-secondary" onClick={uploadSelectedFile} disabled={saving}>
                Carica e inserisci
              </button>
            </div>
          </div>
        </div>
      </div>

      {message ? <div className="note">{message}</div> : null}

      <div className="hero-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Salvataggio..." : mode === "edit" ? "Aggiorna articolo" : "Crea articolo"}
        </button>
      </div>
    </form>
  );
}
