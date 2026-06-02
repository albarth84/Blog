-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "coverImageAlt" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeSettings" (
    "id" TEXT NOT NULL DEFAULT 'theme',
    "siteName" TEXT NOT NULL DEFAULT 'Dal dolore al fitness',
    "eyebrow" TEXT NOT NULL DEFAULT 'Trasformazione, cura, forza',
    "heroTitle" TEXT NOT NULL DEFAULT 'Dal dolore al fitness',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Un percorso sincero per trasformare il peso emotivo e fisico in energia, disciplina e amore per te stessa.',
    "introText" TEXT NOT NULL DEFAULT 'Qui trovi racconti, strumenti e riflessioni pensati per donne che vogliono tornare a sentirsi bene nel proprio corpo e nella propria mente.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'Un percorso condiviso',
    "aboutText" TEXT NOT NULL DEFAULT 'Questo blog nasce per accompagnare, con gentilezza e concretezza, chi sta attraversando un periodo di stanchezza, aumento di peso o disagio interiore.',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Leggi gli articoli',
    "ctaLink" TEXT NOT NULL DEFAULT '/#articoli',
    "primaryColor" TEXT NOT NULL DEFAULT '#b85ca6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#8b7bf0',
    "accentColor" TEXT NOT NULL DEFAULT '#f7ebff',
    "backgroundColor" TEXT NOT NULL DEFAULT '#fff7fb',
    "textColor" TEXT NOT NULL DEFAULT '#2d1833',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThemeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "alt" TEXT,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
