import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, beforeEach } from 'vitest';
import Quiz from '../../src/components/Quiz';

const q = [{ q: '2+2?', options: ['3', '4'], answer: 1 }];

describe('Quiz', () => {
  beforeEach(() => localStorage.clear());
  it('marks correct answer and persists score', () => {
    const { getByText } = render(<Quiz id="t/1" questions={q} />);
    fireEvent.click(getByText('4'));
    fireEvent.click(getByText('Submit'));
    expect(getByText(/1 \/ 1/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('godd:v1')!).quizzes['t/1']).toEqual({ correct: 1, total: 1 });
  });

  it('shows ok/bad classes on labels after wrong answer submitted', () => {
    const { getByText, container } = render(<Quiz id="t/2" questions={q} />);
    fireEvent.click(getByText('3')); // wrong (index 0, answer is 1)
    fireEvent.click(getByText('Submit'));
    const labels = container.querySelectorAll('label');
    // label for '3' (index 0, wrong pick) → class 'bad'
    expect(labels[0].className).toBe('bad');
    // label for '4' (index 1, correct) → class 'ok'
    expect(labels[1].className).toBe('ok');
  });

  it('disables radio inputs after submitting', () => {
    const { getByText, container } = render(<Quiz id="t/3" questions={q} />);
    fireEvent.click(getByText('4'));
    fireEvent.click(getByText('Submit'));
    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach((input) => expect((input as HTMLInputElement).disabled).toBe(true));
  });

  it('shows 0 / 1 score when wrong answer picked', () => {
    const { getByText } = render(<Quiz id="t/4" questions={q} />);
    fireEvent.click(getByText('3')); // wrong
    fireEvent.click(getByText('Submit'));
    expect(getByText(/0 \/ 1/)).toBeTruthy();
  });
});
