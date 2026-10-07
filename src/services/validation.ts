/**
 * Client-side input validation mirroring the rules enforced by CitationCourt.py.
 * Provides real-time feedback before committing an on-chain transaction.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const RESERVED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fe80:/i,
];

export function validateClaimInput(claim: string): ValidationResult {
  if (typeof claim !== 'string') {
    return { isValid: false, error: 'Claim must be string' };
  }
  const trimmed = claim.trim();
  if (trimmed.length < 20) {
    return { isValid: false, error: 'claim length below minimum 20 characters' };
  }
  if (trimmed.length > 400) {
    return { isValid: false, error: 'claim length exceeds maximum 400 characters' };
  }
  return { isValid: true };
}

export function validateUrlInput(url: string): ValidationResult {
  if (typeof url !== 'string') {
    return { isValid: false, error: 'url must be string' };
  }
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Source URL is required' };
  }
  if (trimmed.length > 300) {
    return { isValid: false, error: 'url length exceeds limit' };
  }
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'url contains whitespace' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Invalid URL structure' };
  }

  if (parsed.protocol !== 'https:') {
    return { isValid: false, error: 'url scheme must be https' };
  }

  if (!parsed.hostname) {
    return { isValid: false, error: 'url hostname missing' };
  }

  if (parsed.username || parsed.password) {
    return { isValid: false, error: 'url contains userinfo' };
  }

  if (parsed.port && parsed.port !== '443') {
    return { isValid: false, error: 'url port must be 443 or omitted' };
  }

  const hostLower = parsed.hostname.toLowerCase();
  const hostClean = hostLower.replace(/^\[/, '').replace(/\]$/, '');

  if (hostClean === 'localhost' || hostClean.endsWith('.localhost')) {
    return { isValid: false, error: 'url hostname cannot be localhost' };
  }

  // Check IPv4/IPv6 private/reserved literals
  for (const pattern of RESERVED_IP_PATTERNS) {
    if (pattern.test(hostClean)) {
      return { isValid: false, error: 'url host cannot be private or reserved IP' };
    }
  }

  return { isValid: true };
}
