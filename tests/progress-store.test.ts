import { describe, it, expect, beforeEach } from 'vitest';
import { markComplete, unmarkComplete, isComplete, getCompleted, saveQuizScore, getQuizScore } from '../src/components/progress-store';

describe('progress-store', () => {
  beforeEach(() => localStorage.clear());

  it('marks a lesson complete and reads it back', () => {
    expect(isComplete('go-101/variables')).toBe(false);
    markComplete('go-101/variables');
    expect(isComplete('go-101/variables')).toBe(true);
    expect(getCompleted()).toContain('go-101/variables');
  });

  it('persists quiz scores', () => {
    saveQuizScore('go-101/variables', 3, 4);
    expect(getQuizScore('go-101/variables')).toEqual({ correct: 3, total: 4 });
  });

  it('unmarkComplete removes a completed lesson', () => {
    markComplete('go-101/variables');
    expect(isComplete('go-101/variables')).toBe(true);
    unmarkComplete('go-101/variables');
    expect(isComplete('go-101/variables')).toBe(false);
  });

  it('saveQuizScore overwrites a previous score for the same id', () => {
    saveQuizScore('go-101/variables', 1, 4);
    saveQuizScore('go-101/variables', 3, 4);
    expect(getQuizScore('go-101/variables')).toEqual({ correct: 3, total: 4 });
  });

  it('getQuizScore returns null for an id never saved', () => {
    expect(getQuizScore('go-101/never-seen')).toBeNull();
  });

  it('getCompleted returns all marked ids', () => {
    markComplete('go-101/variables');
    markComplete('go-101/functions');
    markComplete('go-101/types');
    const completed = getCompleted();
    expect(completed).toContain('go-101/variables');
    expect(completed).toContain('go-101/functions');
    expect(completed).toContain('go-101/types');
    expect(completed).toHaveLength(3);
  });
});
