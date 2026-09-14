import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "./auth";

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<string> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Niste prijavljeni");
  }
  return user;
}