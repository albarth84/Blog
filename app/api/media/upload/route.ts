import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { storeUpload } from "@/lib/media";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }

  const asset = await storeUpload(file);
  return NextResponse.json(asset, { status: 201 });
}
