import { describe, it, expect, beforeEach } from 'vitest';
import type { PendingAction } from '../src/types';

describe('LocalStorage Resume Logic', () => {
  const LOCAL_STORAGE_PENDING_KEY = 'citation_court_pending_tx';
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
  });

  function savePendingAction(action: PendingAction) {
    mockStorage[LOCAL_STORAGE_PENDING_KEY] = JSON.stringify(action);
  }

  function getPendingAction(): PendingAction | null {
    const raw = mockStorage[LOCAL_STORAGE_PENDING_KEY];
    if (!raw) return null;
    return JSON.parse(raw);
  }

  function shouldResume(action: PendingAction, maxWindowSec = 360): boolean {
    const elapsedSec = (Date.now() - action.startedAt) / 1000;
    return elapsedSec >= 0 && elapsedSec < maxWindowSec;
  }

  it('correctly persists and recovers pending judge action', () => {
    const action: PendingAction = {
      hash: '0x54f9e0692aa2ae52e362b3e06764990e32689ab2663ecffe31dadc995c0791f2',
      claimId: '9',
      action: 'judge',
      startedAt: Date.now(),
    };

    savePendingAction(action);
    const recovered = getPendingAction();

    expect(recovered).toEqual(action);
    expect(shouldResume(recovered!)).toBe(true);
  });

  it('expires pending action if started over 360 seconds ago', () => {
    const oldAction: PendingAction = {
      hash: '0x54f9e0692aa2ae52e362b3e06764990e32689ab2663ecffe31dadc995c0791f2',
      claimId: '9',
      action: 'judge',
      startedAt: Date.now() - 400 * 1000, // 400 seconds ago
    };

    savePendingAction(oldAction);
    const recovered = getPendingAction();

    expect(recovered).toBeDefined();
    expect(shouldResume(recovered!)).toBe(false);
  });
});
