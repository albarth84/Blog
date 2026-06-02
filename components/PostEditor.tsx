"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
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

type UploadedMedia = {
  url: string;
  type: "image" | "video";
};

type ToolbarGroup = {
  label: string;
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
};

export function PostEditor({ mode, initial }: PostEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(initial?.coverImageAlt ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const initialHtml = useMemo(() => (initial?.content ? renderContent(initial.content) : ""), [initial?.content]);
  const preview = useMemo(() => renderContent(content), [content]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.innerHTML = initialHtml;
    setContent(initialHtml);
    initializedRef.current = true;
  }, [initialHtml]);

  async function uploadMedia(file: File): Promise<UploadedMedia> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error ?? "Upload non riuscito");
    }

    return response.json();
  }

  function syncContentFromEditor() {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    setContent(editor.innerHTML);
  }

  function insertHtml(html: string) {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      editor.insertAdjacentHTML("beforeend", html);
      syncContentFromEditor();
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      editor.insertAdjacentHTML("beforeend", html);
      syncContentFromEditor();
      return;
    }

    const fragment = range.createContextualFragment(html);
    range.deleteContents();
    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    syncContentFromEditor();
  }

  function applyFormat(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncContentFromEditor();
  }

  function insertLink() {
    const url = window.prompt("Incolla il link da inserire:");
    if (!url) {
      return;
    }

    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    syncContentFromEditor();
  }

  function insertHeading(level: 2 | 3) {
    insertHtml(`<h${level}>Sottotitolo</h${level}>`);
  }

  function insertList(ordered: boolean) {
    editorRef.current?.focus();
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    syncContentFromEditor();
  }

  function setAlignment(alignment: "left" | "center" | "right") {
    editorRef.current?.focus();
    const command =
      alignment === "left" ? "justifyLeft" : alignment === "center" ? "justifyCenter" : "justifyRight";
    document.execCommand(command);
    syncContentFromEditor();
  }

  async function handleCoverUpload() {
    const file = coverFileRef.current?.files?.[0];
    if (!file) {
      return;
    }

    setCoverUploading(true);
    setMessage(null);

    try {
      const uploaded = await uploadMedia(file);
      if (uploaded.type !== "image") {
        throw new Error("La copertina deve essere un'immagine.");
      }

      setCoverImageUrl(uploaded.url);
      if (!coverImageAlt) {
        setCoverImageAlt(title || "Copertina articolo");
      }
      setMessage("Copertina caricata dal PC.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante il caricamento della copertina.");
    } finally {
      setCoverUploading(false);
      if (coverFileRef.current) {
        coverFileRef.current.value = "";
      }
    }
  }

  async function handleContentMediaUpload() {
    const file = contentFileRef.current?.files?.[0];
    if (!file) {
      return;
    }

    setContentUploading(true);
    setMessage(null);

    try {
      const uploaded = await uploadMedia(file);
      const html =
        uploaded.type === "video"
          ? `\n<figure><video controls playsinline src="${uploaded.url}"></video></figure>\n`
          : `\n<figure><img src="${uploaded.url}" alt="${coverImageAlt || title || "Immagine articolo"}" loading="lazy" /></figure>\n`;

      insertHtml(html);
      setMessage("Media inserito nell'articolo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante l'upload.");
    } finally {
      setContentUploading(false);
      if (contentFileRef.current) {
        contentFileRef.current.value = "";
      }
    }
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return;
    }

    setContentUploading(true);
    setMessage(null);

    try {
      for (const file of imageFiles) {
        const uploaded = await uploadMedia(file);
        if (uploaded.type !== "image") {
          continue;
        }

        insertHtml(
          `\n<figure><img src="${uploaded.url}" alt="${coverImageAlt || title || "Immagine articolo"}" loading="lazy" /></figure>\n`
        );
      }

      setMessage("Immagini inserite tramite drag and drop.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante il drag and drop.");
    } finally {
      setContentUploading(false);
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

  const toolbarGroups: ToolbarGroup[] = [
    {
      label: "Testo",
      buttons: [
        { label: "Grassetto", onClick: () => applyFormat("bold") },
        { label: "Corsivo", onClick: () => applyFormat("italic") },
        { label: "Link", onClick: insertLink },
      ],
    },
    {
      label: "Struttura",
      buttons: [
        { label: "Titolo H2", onClick: () => insertHeading(2) },
        { label: "Titolo H3", onClick: () => insertHeading(3) },
        { label: "Elenco", onClick: () => insertList(false) },
        { label: "Lista numerata", onClick: () => insertList(true) },
      ],
    },
    {
      label: "Allineamento",
      buttons: [
        { label: "Sinistra", onClick: () => setAlignment("left") },
        { label: "Centro", onClick: () => setAlignment("center") },
        { label: "Destra", onClick: () => setAlignment("right") },
      ],
    },
    {
      label: "Media",
      buttons: [
        {
          label: "Immagine",
          onClick: () => insertHtml('\n<figure><img src="" alt="" loading="lazy" /></figure>\n'),
        },
        {
          label: "Video",
          onClick: () => insertHtml('\n<figure><video controls playsinline src=""></video></figure>\n'),
        },
      ],
    },
  ];

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

          <div className="field">
            <div className="editor-header">
              <span>Contenuto visuale</span>
              <div className="editor-hint">Trascina immagini dentro l’editor oppure usa la barra strumenti</div>
            </div>

            <div className="toolbar-shell">
              {toolbarGroups.map((group) => (
                <div className="toolbar-group" key={group.label}>
                  <span className="toolbar-label">{group.label}</span>
                  <div className="toolbar">
                    {group.buttons.map((button) => (
                      <button type="button" className="toolbar-button" key={button.label} onClick={button.onClick}>
                        {button.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={editorRef}
              className={`rich-editor ${isDragging ? "rich-editor-drag" : ""}`}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              data-placeholder="Scrivi qui il tuo articolo. Puoi formattare il testo e inserire immagini o video nel corpo."
              onInput={(event) => setContent((event.currentTarget as HTMLDivElement).innerHTML)}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            />
          </div>

          <div className="field">
            <span>Anteprima</span>
            <div className="prose" dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="grid">
              <label className="field">
                <span>Copertina</span>
                {coverImageUrl ? (
                  <img className="cover-preview" src={coverImageUrl} alt={coverImageAlt || title || "Copertina articolo"} />
                ) : (
                  <div className="cover-placeholder">Nessuna copertina caricata</div>
                )}
              </label>

              <label className="field">
                <span>Carica copertina dal PC</span>
                <input ref={coverFileRef} type="file" accept="image/*" />
              </label>

              <button type="button" className="button-secondary" onClick={handleCoverUpload} disabled={coverUploading}>
                {coverUploading ? "Caricamento..." : "Carica copertina"}
              </button>

              <label className="field">
                <span>URL copertina</span>
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
                Carica immagini o video dal computer e inseriscili nel corpo dell’articolo con l’editor visuale.
              </div>

              <label className="field">
                <span>Media nel contenuto</span>
                <input ref={contentFileRef} type="file" accept="image/*,video/*" />
              </label>

              <button type="button" className="button-secondary" onClick={handleContentMediaUpload} disabled={contentUploading}>
                {contentUploading ? "Inserimento..." : "Carica e inserisci"}
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
