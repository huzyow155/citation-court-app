import { describe, it, expect } from 'vitest';
import { validateClaimInput, validateUrlInput } from '../src/services/validation';

describe('Client Input Validation vs Contract Boundaries', () => {
  describe('Claim Boundaries', () => {
    it('rejects claim with 19 characters', () => {
      const input = '1234567890123456789'; // 19 chars
      const res = validateClaimInput(input);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('minimum 20 characters');
    });

    it('accepts claim with exactly 20 characters', () => {
      const input = '12345678901234567890'; // 20 chars
      const res = validateClaimInput(input);
      expect(res.isValid).toBe(true);
    });

    it('accepts claim with exactly 400 characters', () => {
      const input = 'a'.repeat(400);
      const res = validateClaimInput(input);
      expect(res.isValid).toBe(true);
    });

    it('rejects claim with 401 characters', () => {
      const input = 'a'.repeat(401);
      const res = validateClaimInput(input);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('maximum 400 characters');
    });

    it('strips leading and trailing whitespace before checking length', () => {
      const input = '   1234567890123456789   '; // 19 stripped chars
      const res = validateClaimInput(input);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('minimum 20 characters');
    });
  });

  describe('URL Boundaries & Edge Cases', () => {
    it('accepts valid https URL', () => {
      const res = validateUrlInput('https://en.wikipedia.org/wiki/Earth');
      expect(res.isValid).toBe(true);
    });

    it('rejects http scheme', () => {
      const res = validateUrlInput('http://en.wikipedia.org/wiki/Earth');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url scheme must be https');
    });

    it('handles uppercase scheme HTTPS gracefully', () => {
      const res = validateUrlInput('HTTPS://en.wikipedia.org/wiki/Earth');
      expect(res.isValid).toBe(true);
    });

    it('rejects URL with whitespace', () => {
      const res = validateUrlInput('https://en.wikipedia.org/wiki/Earth page');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url contains whitespace');
    });

    it('rejects URL exceeding 300 characters', () => {
      const res = validateUrlInput(`https://example.com/${'a'.repeat(300)}`);
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url length exceeds limit');
    });

    it('rejects userinfo credentials in URL', () => {
      const res = validateUrlInput('https://user:pass@example.com/page');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url contains userinfo');
    });

    it('accepts explicit port 443', () => {
      const res = validateUrlInput('https://example.com:443/page');
      expect(res.isValid).toBe(true);
    });

    it('rejects non-443 port', () => {
      const res = validateUrlInput('https://example.com:8443/page');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url port must be 443 or omitted');
    });

    it('rejects localhost', () => {
      const res = validateUrlInput('https://localhost/test');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url hostname cannot be localhost');
    });

    it('rejects subdomains of localhost', () => {
      const res = validateUrlInput('https://app.localhost/test');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url hostname cannot be localhost');
    });

    it('rejects private IPv4 literals (10.*, 192.168.*, 127.*, 172.16.*, 169.254.*)', () => {
      const privates = [
        'https://10.0.0.1/doc',
        'https://192.168.1.10/doc',
        'https://127.0.0.1/doc',
        'https://172.16.0.5/doc',
        'https://169.254.1.1/doc',
      ];
      for (const p of privates) {
        const res = validateUrlInput(p);
        expect(res.isValid).toBe(false);
        expect(res.error).toBe('url host cannot be private or reserved IP');
      }
    });

    it('rejects IPv6 loopback literal', () => {
      const res = validateUrlInput('https://[::1]/doc');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('url host cannot be private or reserved IP');
    });
  });
});
