import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseReceiptOutcome, extractRawReceiptError } from '../src/services/receipt';

function loadFixture(filename: string) {
  const filePath = path.resolve(__dirname, 'fixtures', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

describe('Receipt Success Rule & Fixtures Parsing', () => {
  it('parses live lodge success receipt as SUCCESS', () => {
    const fixture = loadFixture('receipt_lodge_success.json');
    const outcome = parseReceiptOutcome(fixture);

    expect(outcome.isSuccess).toBe(true);
    expect(outcome.statusName).toBe('ACCEPTED');
    expect(outcome.resultName).toBe('MAJORITY_AGREE');
    expect(outcome.leaderResult).toBe('SUCCESS');
    expect(outcome.errorMessage).toBeUndefined();
  });

  it('parses live judge success receipt as SUCCESS', () => {
    const fixture = loadFixture('receipt_judge_success.json');
    const outcome = parseReceiptOutcome(fixture);

    expect(outcome.isSuccess).toBe(true);
    expect(outcome.statusName).toBe('ACCEPTED');
    expect(outcome.resultName).toBe('MAJORITY_AGREE');
    expect(outcome.leaderResult).toBe('SUCCESS');
  });

  it('parses FINALIZED Case 1 receipt as SUCCESS', () => {
    const fixture = loadFixture('receipt_case1_finalized.json');
    const outcome = parseReceiptOutcome(fixture);

    expect(outcome.isSuccess).toBe(true);
    expect(outcome.statusName).toBe('FINALIZED');
    expect(outcome.resultName).toBe('MAJORITY_AGREE');
    expect(outcome.leaderResult).toBe('SUCCESS');
  });

  it('parses FINALIZED UNREADABLE receipt as SUCCESS', () => {
    const fixture = loadFixture('receipt_unreadable.json');
    const outcome = parseReceiptOutcome(fixture);

    expect(outcome.isSuccess).toBe(true);
    expect(outcome.statusName).toBe('FINALIZED');
    expect(outcome.resultName).toBe('MAJORITY_AGREE');
    expect(outcome.leaderResult).toBe('SUCCESS');
  });

  it('detects live failing write receipt with ERROR execution_result and extracts UserError', () => {
    const fixture = loadFixture('receipt_failing_write.json');
    const outcome = parseReceiptOutcome(fixture);

    expect(outcome.isSuccess).toBe(false);
    expect(outcome.leaderResult).toBe('ERROR');
    expect(outcome.rawError).toContain('claim length below minimum 20 characters');
    expect(outcome.errorMessage).toBe('The claim is too short. It must be at least 20 characters.');
  });

  it('rejects synthetic receipt with MAJORITY_DISAGREE', () => {
    const synthetic = {
      status_name: 'ACCEPTED',
      result_name: 'MAJORITY_DISAGREE',
      consensus_data: {
        leader_receipt: [{ execution_result: 'SUCCESS' }],
      },
    };
    const outcome = parseReceiptOutcome(synthetic);
    expect(outcome.isSuccess).toBe(false);
    expect(outcome.errorMessage).toContain('validators did not reach consensus');
  });

  it('rejects null or empty receipt gracefully', () => {
    const outcome = parseReceiptOutcome(null);
    expect(outcome.isSuccess).toBe(false);
    expect(outcome.errorMessage).toBe('Receipt data unavailable.');
  });
});
