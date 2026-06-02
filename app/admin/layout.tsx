import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>Dal dolore al fitness</span>
        </Link>

        <nav>
          <Link className="nav-link" href="/admin">
            Dashboard
          </Link>
          <Link className="nav-link" href="/admin/posts">
            Articoli
          </Link>
          <Link className="nav-link" href="/admin/posts/new">
            Nuovo articolo
          </Link>
          <Link className="nav-link" href="/admin/theme">
            Tema
          </Link>
          <Link className="nav-link" href="/admin/media">
            Media
          </Link>
        </nav>

        <div style={{ marginTop: 18 }}>
          <LogoutButton />
        </div>
      </aside>

      <main className="main-area">{children}</main>
    </div>
  );
}
