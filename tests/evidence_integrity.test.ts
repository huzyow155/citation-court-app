import { describe, it, expect } from 'vitest';
import evidenceData from '../src/data/evidence.json';

describe('Evidence Data Integrity', () => {
  it('contains exactly 8 reference cases (claims 1 to 8)', () => {
    expect(evidenceData.cases).toHaveLength(8);
    const ids = evidenceData.cases.map((c) => c.claim_id);
    expect(ids).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });

  it('contains matching contract specification constants', () => {
    expect(evidenceData.contractAddress).toBe('0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5');
    expect(evidenceData.consumerAddress).toBe('0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4');
    expect(evidenceData.sourceSha256).toBe(
      '459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2'
    );
  });

  it('validates each case structure, non-empty claim text, and valid verdicts', () => {
    const validVerdicts = ['SUPPORTS', 'CONTRADICTS', 'NOT_ADDRESSED', 'UNREADABLE'];

    for (const c of evidenceData.cases) {
      expect(c.claim_text.length).toBeGreaterThanOrEqual(20);
      expect(c.claim_text.length).toBeLessThanOrEqual(400);
      expect(validVerdicts).toContain(c.verdict);
      expect(c.attempts).toBeGreaterThanOrEqual(1);
      expect(c.attempts).toBeLessThanOrEqual(3);
      expect(c.source_url.startsWith('https://')).toBe(true);
      expect(c.author).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(c.lodge_tx).toMatch(/^0x[a-fA-F0-9]{64}$/);
      expect(c.judge_tx).toMatch(/^0x[a-fA-F0-9]{64}$/);
      expect(c.latency_sec).toBeGreaterThan(0);
    }
  });

  it('records attempt counter 2 for re-judged Claim 6', () => {
    const case6 = evidenceData.cases.find((c) => c.claim_id === '6');
    expect(case6).toBeDefined();
    expect(case6?.attempts).toBe(2);
    expect(case6?.verdict).toBe('UNREADABLE');
    expect(case6?.rejudge_tx).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });
});
