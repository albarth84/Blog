"use client";

import { useState, type FormEvent } from "react";

type MediaAsset = {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  createdAt: string;
};

export function MediaUploader({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (!(file instanceof File)) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Upload non riuscito");
      }

      const data = (await response.json()) as MediaAsset;
      setAssets((current) => [data, ...current].slice(0, 50));
      setMessage("Media caricato.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <form className="panel grid" onSubmit={handleUpload}>
        <label className="field">
          <span>Carica un file</span>
          <input type="file" name="file" accept="image/*,video/*" required />
        </label>
        <button type="submit" className="button" disabled={busy}>
          {busy ? "Caricamento..." : "Carica media"}
        </button>
        {message ? <div className="note">{message}</div> : null}
      </form>

      <div className="grid posts-grid">
        {assets.map((asset) => (
          <article className="card post-card" key={asset.id}>
            <div className="post-body">
              <span className="badge">{asset.type}</span>
              <p style={{ wordBreak: "break-all" }}>{asset.url}</p>
              <div className="muted">{asset.filename}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
