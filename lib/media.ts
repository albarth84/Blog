import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { MediaType } from "@prisma/client";

export async function storeUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${crypto.randomUUID()}-${file.name}`.replace(/\s+/g, "-");
  const isBlobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  let url: string;

  if (isBlobEnabled) {
    const result = await put(filename, bytes, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    url = result.url;
  } else {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, bytes);
    url = `/uploads/${filename}`;
  }

  const mediaType: MediaType = file.type.startsWith("video/") ? "video" : "image";

  return prisma.mediaAsset.create({
    data: {
      url,
      type: mediaType,
      filename: file.name,
    },
  });
}

export async function listMediaAssets() {
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
