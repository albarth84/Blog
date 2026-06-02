import { listMediaAssets } from "@/lib/media";
import { MediaUploader } from "@/components/MediaUploader";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const assets = await listMediaAssets();

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <span className="eyebrow">Media</span>
        <h2>Carica immagini e video</h2>
        <p>Ogni file viene salvato su Vercel Blob se la chiave è configurata, altrimenti in locale per lo sviluppo.</p>
      </div>
      <MediaUploader
        initialAssets={assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          type: asset.type,
          filename: asset.filename,
          createdAt: asset.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
