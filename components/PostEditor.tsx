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

type SelectedImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
};

function makeMediaId() {
  return crypto.randomUUID();
}

function clampWidth(value: number) {
  return Math.min(100, Math.max(20, value));
}

function parseWidth(input?: string) {
  const parsed = Number.parseFloat(input || "");
  return Number.isFinite(parsed) ? clampWidth(parsed) : 100;
}

export function PostEditor({ mode, initial }: PostEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);
  const replacementFileRef = useRef<HTMLInputElement>(null);
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
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
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

  function getMediaElement(id: string) {
    return editorRef.current?.querySelector<HTMLElement>(`[data-media-id="${id}"]`) ?? null;
  }

  function getSelectedImageElement() {
    if (!selectedImage) {
      return null;
    }

    const element = getMediaElement(selectedImage.id);
    if (!element) {
      return null;
    }

    return element;
  }

  function snapshotImage(element: HTMLElement): SelectedImage {
    const id = element.dataset.mediaId || makeMediaId();
    element.dataset.mediaId = id;

    const img = element.tagName.toLowerCase() === "img" ? (element as HTMLImageElement) : element.querySelector("img");
    const src = img?.getAttribute("src") || "";
    const alt = img?.getAttribute("alt") || "";
    const width = parseWidth(element.style.width || img?.style.width || "100%");

    return { id, src, alt, width };
  }

  function selectImageElement(target: HTMLElement) {
    const element = target.closest<HTMLElement>("figure[data-media-id]") || target.closest<HTMLElement>("[data-media-id]") || target;
    const img = element.tagName.toLowerCase() === "img" ? element : element.querySelector("img");

    if (!img) {
      return;
    }

    const snapshot = snapshotImage(element);
    editorRef.current?.querySelectorAll(".media-selected").forEach((node) => node.classList.remove("media-selected"));
    element.classList.add("media-selected");
    setSelectedImage(snapshot);
  }

  function clearSelectedImage() {
    editorRef.current?.querySelectorAll(".media-selected").forEach((node) => node.classList.remove("media-selected"));
    setSelectedImage(null);
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

  function insertImageHtml(src: string, alt: string, width = 100, focusMedia = true) {
    const mediaId = makeMediaId();
    insertHtml(
      `\n<figure data-media-id="${mediaId}" style="width: ${width}%"><img data-media-id="${mediaId}" src="${src}" alt="${alt}" loading="lazy" /></figure>\n`
    );

    if (focusMedia) {
      requestAnimationFrame(() => {
        const element = getMediaElement(mediaId);
        if (element) {
          selectImageElement(element);
        }
      });
    }
  }

  function insertVideoHtml(src: string) {
    const mediaId = makeMediaId();
    insertHtml(
      `\n<figure data-media-id="${mediaId}"><video data-media-id="${mediaId}" controls playsinline src="${src}"></video></figure>\n`
    );
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
      const alt = coverImageAlt || title || "Immagine articolo";
      if (uploaded.type === "video") {
        insertVideoHtml(uploaded.url);
      } else {
        insertImageHtml(uploaded.url, alt, 100);
      }
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

        insertImageHtml(uploaded.url, coverImageAlt || title || "Immagine articolo", 100, false);
      }

      setMessage("Immagini inserite tramite drag and drop.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante il drag and drop.");
    } finally {
      setContentUploading(false);
    }
  }

  function applySelectedImageChanges(next: Partial<SelectedImage>) {
    const element = getSelectedImageElement();
    if (!element || !selectedImage) {
      return;
    }

    const snapshot = { ...selectedImage, ...next };
    const img = element.tagName.toLowerCase() === "img" ? (element as HTMLImageElement) : element.querySelector("img");
    if (!img) {
      return;
    }

    if (snapshot.src) {
      img.setAttribute("src", snapshot.src);
    }

    img.setAttribute("alt", snapshot.alt);

    if (element.tagName.toLowerCase() === "figure") {
      element.style.width = `${clampWidth(snapshot.width)}%`;
      img.style.width = "100%";
    } else {
      img.style.width = `${clampWidth(snapshot.width)}%`;
    }

    setSelectedImage(snapshot);
    syncContentFromEditor();
  }

  async function replaceSelectedImage() {
    const file = replacementFileRef.current?.files?.[0];
    if (!file || !selectedImage) {
      return;
    }

    setContentUploading(true);
    setMessage(null);

    try {
      const uploaded = await uploadMedia(file);
      if (uploaded.type !== "image") {
        throw new Error("Puoi sostituire solo con un'immagine.");
      }

      applySelectedImageChanges({ src: uploaded.url });
      setMessage("Immagine sostituita.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante la sostituzione.");
    } finally {
      setContentUploading(false);
      if (replacementFileRef.current) {
        replacementFileRef.current.value = "";
      }
    }
  }

  function deleteSelectedImage() {
    const element = getSelectedImageElement();
    if (!element) {
      return;
    }

    element.remove();
    clearSelectedImage();
    syncContentFromEditor();
    setMessage("Immagine eliminata.");
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
          onClick: () => {
            const src = window.prompt("URL dell'immagine:");
            if (!src) {
              return;
            }

            const alt = window.prompt("Testo alternativo:", "Immagine articolo") || "Immagine articolo";
            insertImageHtml(src, alt, 100);
          },
        },
        {
          label: "Video",
          onClick: () => {
            const src = window.prompt("URL del video:");
            if (!src) {
              return;
            }

            insertVideoHtml(src);
          },
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
              onClick={(event) => {
                const target = event.target as HTMLElement;
                const mediaTarget = target.closest<HTMLElement>("[data-media-id]");
                if (mediaTarget) {
                  selectImageElement(mediaTarget);
                } else if (!target.closest(".toolbar-shell")) {
                  clearSelectedImage();
                }
              }}
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

          {selectedImage ? (
            <div className="panel">
              <div className="grid">
                <div className="editor-header">
                  <span>Immagine selezionata</span>
                  <div className="editor-hint">Modifica, ridimensiona o elimina l’immagine dal contenuto</div>
                </div>

                <label className="field">
                  <span>URL immagine</span>
                  <input
                    value={selectedImage.src}
                    onChange={(event) => applySelectedImageChanges({ src: event.target.value })}
                    placeholder="URL immagine"
                  />
                </label>

                <label className="field">
                  <span>Testo alternativo</span>
                  <input
                    value={selectedImage.alt}
                    onChange={(event) => applySelectedImageChanges({ alt: event.target.value })}
                    placeholder="Testo alternativo"
                  />
                </label>

                <label className="field">
                  <span>Ridimensiona</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={selectedImage.width}
                    onChange={(event) => applySelectedImageChanges({ width: Number(event.target.value) })}
                  />
                  <div className="muted">{selectedImage.width}%</div>
                </label>

                <label className="field">
                  <span>Sostituisci immagine dal PC</span>
                  <input ref={replacementFileRef} type="file" accept="image/*" />
                </label>

                <div className="hero-actions">
                  <button type="button" className="button-secondary" onClick={replaceSelectedImage} disabled={contentUploading}>
                    {contentUploading ? "Aggiorno..." : "Sostituisci"}
                  </button>
                  <button type="button" className="button-danger" onClick={deleteSelectedImage}>
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ) : null}
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
