import { NextRequest } from 'next/server';

// Secret token for administrative API operations
export const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_KEY || 'shree_fashion_hub_admin_secure_key_2026';

// In-memory sliding-window rate limiter
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

/**
 * Check if the request is from an authorized store administrator.
 * Validates 'x-admin-token' or 'Authorization: Bearer ...' against the admin secret.
 */
export function verifyAdminAuth(req: NextRequest): boolean {
  const headerToken = req.headers.get('x-admin-token');
  if (headerToken && headerToken === ADMIN_SECRET_TOKEN) {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SECRET_TOKEN) {
      return true;
    }
  }

  // Also check secure admin cookie if present
  const adminCookie = req.cookies.get('shree_admin_session')?.value;
  if (adminCookie && adminCookie === ADMIN_SECRET_TOKEN) {
    return true;
  }

  return false;
}

/**
 * Rate limiter helper: checks if an IP/identifier has exceeded max requests in a time window.
 */
export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000)
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((entry.resetAt - now) / 1000)
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSeconds: Math.ceil((entry.resetAt - now) / 1000)
  };
}

/**
 * Strips HTML tags, JavaScript event attributes, and dangerous chars to prevent XSS.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove onload, onclick etc
    .trim();
}

/**
 * Validates Indian 6-digit PIN code.
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validates email address format with standard RFC regex.
 */
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email.trim());
}

/**
 * Validates image upload file parameters.
 */
export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  // Max size: 10MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds maximum limit of 10MB.' };
  }

  // Allowed mime types
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!ALLOWED_MIME.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.' };
  }

  // Allowed extensions
  const name = file.name.toLowerCase();
  const validExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].some(ext => name.endsWith(ext));
  if (!validExt) {
    return { valid: false, error: 'Invalid file extension.' };
  }

  return { valid: true };
}
