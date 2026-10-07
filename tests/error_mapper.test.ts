import { describe, it, expect } from 'vitest';
import { getFriendlyErrorMessage, USER_ERROR_FRIENDLY_MAP } from '../src/services/receipt';

describe('UserError Friendly Mapping', () => {
  const integrationErrors = [
    'claim must be string',
    'claim length below minimum 20 characters',
    'claim length exceeds maximum 400 characters',
    'url must be string',
    'url length exceeds limit',
    'url contains whitespace',
    'url scheme must be https',
    'url hostname missing',
    'url contains userinfo',
    'url port must be 443 or omitted',
    'url hostname cannot be localhost',
    'url host cannot be private or reserved IP',
    'unknown claim id',
    'claim already judged',
    'attempt limit reached',
  ];

  it('maps all 15 raw contract error strings from INTEGRATION.md', () => {
    for (const raw of integrationErrors) {
      expect(USER_ERROR_FRIENDLY_MAP[raw]).toBeDefined();
      const friendly = getFriendlyErrorMessage(raw);
      expect(friendly).not.toBe(raw);
      expect(friendly.length).toBeGreaterThan(10);
    }
  });

  it('handles embedded UserError strings in exception prefixes', () => {
    const rawException = 'gl.vm.UserError: claim length below minimum 20 characters';
    const friendly = getFriendlyErrorMessage(rawException);
    expect(friendly).toBe('The claim is too short. It must be at least 20 characters.');
  });

  it('falls back to raw string for unknown errors', () => {
    const unknown = 'Unknown EVM execution failure';
    expect(getFriendlyErrorMessage(unknown)).toBe(unknown);
  });
});
