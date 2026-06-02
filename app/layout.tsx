import type { Metadata } from "next";
import "./globals.css";
import { getThemeSettings } from "@/lib/theme";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dal dolore al fitness",
  description:
    "Un blog dedicato alla trasformazione fisica e mentale, pensato per donne che vogliono ritrovare energia, fiducia e benessere.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const theme = await getThemeSettings();

  return (
    <html lang="it">
      <body
        style={
          {
            "--primary": theme.primaryColor,
            "--secondary": theme.secondaryColor,
            "--bg": theme.backgroundColor,
            "--bg-2": theme.accentColor,
            "--text": theme.textColor,
            "--font-display": "Georgia, 'Times New Roman', serif",
            "--font-body": "Inter, 'Segoe UI', Arial, sans-serif",
          } as CSSProperties & Record<string, string>
        }
      >
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
