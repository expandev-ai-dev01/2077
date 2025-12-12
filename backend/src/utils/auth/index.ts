/**
 * @summary
 * Authentication utilities for password hashing and JWT token generation.
 *
 * @module utils/auth
 */

import crypto from 'crypto';

/**
 * Hash a password using SHA-256 (simplified for in-memory implementation)
 * In production, use bcrypt or argon2
 */
export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

/**
 * Generate a JWT token (simplified implementation)
 * In production, use jsonwebtoken library
 */
export function generateToken(payload: { id: string; username: string; profile: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  ).toString('base64');
  const signature = crypto
    .createHmac('sha256', 'secret-key')
    .update(`${header}.${body}`)
    .digest('base64');
  return `${header}.${body}.${signature}`;
}

/**
 * Verify a JWT token (simplified implementation)
 */
export function verifyToken(token: string): any {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', 'secret-key')
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(Buffer.from(body, 'base64').toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
