import { createHmac, createHash, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "odb_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  user: string;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET nije postavljen u .env");
  }
  return secret;
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function signToken(token: string): string {
  return createHmac("sha256", getSecret()).update(token).digest("base64url");
}

export function verifyCredentials(user: string, password: string): boolean {
  const expectedUser = process.env.AUTH_USER;
  const expectedPass = process.env.AUTH_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const userA = createHash("sha256").update(user).digest();
  const userB = createHash("sha256").update(expectedUser).digest();
  const passA = createHash("sha256").update(password).digest();
  const passB = createHash("sha256").update(expectedPass).digest();

  return timingSafeEqual(userA, userB) && timingSafeEqual(passA, passB);
}

export function signSession(): string {
  const user = process.env.AUTH_USER || "olead";
  const payload: SessionPayload = { user, exp: Date.now() + SESSION_TTL_MS };
  const token = base64url(JSON.stringify(payload));
  return `${token}.${signToken(token)}`;
}

export function verifyToken(token: string | null | undefined): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadPart, signature] = parts;
    const expectedSig = Buffer.from(signToken(payloadPart), "base64url");
    const providedSig = Buffer.from(signature, "base64url");
    if (expectedSig.length !== providedSig.length) return null;
    if (!timingSafeEqual(expectedSig, providedSig)) return null;

    const payload = JSON.parse(
      Buffer.from(payloadPart, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!payload.user || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload.user;
  } catch {
    return null;
  }
}