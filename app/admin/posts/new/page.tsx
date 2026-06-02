import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="panel">
        <span className="eyebrow">Nuovo articolo</span>
        <h2>Scrivi una nuova storia</h2>
        <p>Usa testo, immagini e video per raccontare il percorso in modo autentico e utile.</p>
      </div>
      <div className="panel">
        <PostEditor mode="create" />
      </div>
    </div>
  );
}
