"use client";

import { useRouter } from "next/navigation";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("Eliminare definitivamente questo articolo?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("Eliminazione non riuscita.");
      return;
    }

    router.refresh();
  }

  return (
    <button type="button" className="button-danger" onClick={handleDelete}>
      Elimina
    </button>
  );
}
