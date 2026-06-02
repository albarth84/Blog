import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { defaultTheme, getThemeSettings } from "@/lib/theme";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  siteName: z.string().min(1),
  eyebrow: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  introText: z.string().min(1),
  aboutTitle: z.string().min(1),
  aboutText: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaLink: z.string().min(1),
  primaryColor: z.string().min(1),
  secondaryColor: z.string().min(1),
  accentColor: z.string().min(1),
  backgroundColor: z.string().min(1),
  textColor: z.string().min(1),
});

const { id: _themeId, ...themeDefaults } = defaultTheme;

export async function GET() {
  const theme = await getThemeSettings();
  return NextResponse.json(theme);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Tema non valido" }, { status: 400 });
  }

  const theme = await prisma.themeSettings.upsert({
    where: { id: "theme" },
    create: { id: "theme", ...themeDefaults, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json(theme);
}
