import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "dpf_session";

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !expectedPasswordHash) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be configured");
  }

  if (username !== expectedUsername) {
    return false;
  }

  return bcrypt.compare(password, expectedPasswordHash);
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  try {
    const result = await jwtVerify(token, secretKey());
    const username = result.payload.username;

    if (typeof username !== "string") {
      return null;
    }

    return { username };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return readSessionToken(token);
}

export async function requireAdmin() {
  return getAdminSession();
}

export function sessionCookieName() {
  return COOKIE_NAME;
}
