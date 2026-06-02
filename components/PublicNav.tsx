import Link from "next/link";

export function PublicNav() {
  return (
    <nav className="public-nav" aria-label="Navigazione principale">
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/chi-sono">Chi sono</Link>
      <Link href="/contatti">Contatti</Link>
      <Link href="/admin">Admin</Link>
    </nav>
  );
}
