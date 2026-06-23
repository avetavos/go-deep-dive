import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, beforeEach } from 'vitest';
import ProgressTracker from '../../src/components/ProgressTracker';
import { isComplete } from '../../src/components/progress-store';

describe('ProgressTracker', () => {
  beforeEach(() => localStorage.clear());
  it('toggles completion', () => {
    const { getByRole } = render(<ProgressTracker id="go-101/variables" />);
    fireEvent.click(getByRole('button'));
    expect(isComplete('go-101/variables')).toBe(true);
  });

  it('shows Completed text after first click', () => {
    const { getByRole } = render(<ProgressTracker id="go-101/functions" />);
    const btn = getByRole('button');
    fireEvent.click(btn);
    expect(btn.textContent).toMatch(/completed/i);
  });

  it('toggles back off on second click', () => {
    const { getByRole } = render(<ProgressTracker id="go-101/types" />);
    const btn = getByRole('button');
    fireEvent.click(btn); // mark complete
    fireEvent.click(btn); // unmark
    expect(isComplete('go-101/types')).toBe(false);
    expect(btn.textContent).not.toMatch(/✓ Completed/);
  });
});
