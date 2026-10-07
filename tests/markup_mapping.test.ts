import { describe, it, expect } from 'vitest';
import type { Verdict } from '../src/types';

describe('Verdict to Markup Vernacular Mapping', () => {
  function getMarkingClasses(verdict?: Verdict | 'NONE'): {
    className: string;
    ariaLabelSuffix: string;
    hasSuperscript: boolean;
    hasRedactionBar: boolean;
  } {
    const v = verdict?.toUpperCase() || 'NONE';
    switch (v) {
      case 'SUPPORTS':
        return {
          className: 'mark-supports',
          ariaLabelSuffix: 'Verdict: SUPPORTS (highlighted)',
          hasSuperscript: false,
          hasRedactionBar: false,
        };
      case 'CONTRADICTS':
        return {
          className: 'mark-contradicts',
          ariaLabelSuffix: 'Verdict: CONTRADICTS (struck through)',
          hasSuperscript: false,
          hasRedactionBar: false,
        };
      case 'NOT_ADDRESSED':
        return {
          className: 'mark-not-addressed',
          ariaLabelSuffix: 'Verdict: NOT ADDRESSED (dotted underline)',
          hasSuperscript: true,
          hasRedactionBar: false,
        };
      case 'UNREADABLE':
        return {
          className: 'mark-unreadable',
          ariaLabelSuffix: "Verdict: UNREADABLE (couldn't read the page)",
          hasSuperscript: false,
          hasRedactionBar: true,
        };
      case 'PENDING':
        return {
          className: 'mark-pending',
          ariaLabelSuffix: 'Evaluation pending (dashed pencil underline)',
          hasSuperscript: false,
          hasRedactionBar: false,
        };
      default:
        return {
          className: 'mark-plain',
          ariaLabelSuffix: 'Unjudged claim',
          hasSuperscript: false,
          hasRedactionBar: false,
        };
    }
  }

  it('maps SUPPORTS to highlighter marker and accessible label', () => {
    const res = getMarkingClasses('SUPPORTS');
    expect(res.className).toBe('mark-supports');
    expect(res.ariaLabelSuffix).toContain('highlighted');
  });

  it('maps CONTRADICTS to red strike-through and accessible label', () => {
    const res = getMarkingClasses('CONTRADICTS');
    expect(res.className).toBe('mark-contradicts');
    expect(res.ariaLabelSuffix).toContain('struck through');
  });

  it('maps NOT_ADDRESSED to dotted underline and includes [not addressed] superscript', () => {
    const res = getMarkingClasses('NOT_ADDRESSED');
    expect(res.className).toBe('mark-not-addressed');
    expect(res.hasSuperscript).toBe(true);
    expect(res.ariaLabelSuffix).toContain('dotted underline');
  });

  it('maps UNREADABLE to unmarked text with redaction bar on source line', () => {
    const res = getMarkingClasses('UNREADABLE');
    expect(res.className).toBe('mark-unreadable');
    expect(res.hasRedactionBar).toBe(true);
  });

  it('maps PENDING to dashed pencil underline', () => {
    const res = getMarkingClasses('PENDING');
    expect(res.className).toBe('mark-pending');
  });
});
