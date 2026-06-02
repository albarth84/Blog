import Link from "next/link";

export function PublicNav() {
  return (
    <nav className="public-nav" aria-label="Navigazione principale">
      <Link href="/">Home</Link>
      <Link href="/chi-sono">Chi sono</Link>
      <Link href="/#articoli">Articoli</Link>
      <Link href="/admin">Admin</Link>
    </nav>
  );
}
