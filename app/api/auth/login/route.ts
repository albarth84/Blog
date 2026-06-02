import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, sessionCookieName, verifyAdminCredentials } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dati di accesso non validi" }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(parsed.data.username, parsed.data.password);

  if (!valid) {
    return NextResponse.json({ error: "Username o password errati" }, { status: 401 });
  }

  const token = await createSessionToken(parsed.data.username);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(sessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
