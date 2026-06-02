import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";

type SiteHeaderProps = {
  siteName: string;
};

export function SiteHeader({ siteName }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label={siteName}>
          <Image
            src="/reference/logo.png"
            alt="Logo del sito"
            width={54}
            height={54}
            className="brand-logo"
            priority
          />
          <span className="brand-copy">
            <strong>{siteName}</strong>
            <span>Fitness, recupero, metodo</span>
          </span>
        </Link>
        <PublicNav />
      </div>
    </header>
  );
}
