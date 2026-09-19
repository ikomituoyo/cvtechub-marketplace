import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import bcrypt from 'bcryptjs';

const SECRET_STRING = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
const SECRET = new TextEncoder().encode(SECRET_STRING);
const COOKIE_NAME = 'cvtechub_session';

export type Role = 'buyer' | 'vendor' | 'admin';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export function hashPassword(pw: string) {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compareSync(pw, hash);
}

/** jose is Edge- and Node-compatible (Web Crypto), so the same code works in
 *  middleware (Edge runtime) and in server components / route handlers (Node runtime). */
export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user } as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function readSessionToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

/** Server Component / Route Handler helper — reads the session from cookies(). */
export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return readSessionToken(token);
}

export const SESSION_COOKIE = COOKIE_NAME;

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
}

export function getUserById(id: number) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
}

export function getStoreForVendor(vendorUserId: number) {
  return db.prepare('SELECT * FROM stores WHERE vendor_user_id = ?').get(vendorUserId) as any;
}
