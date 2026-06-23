import { describe, it, expect, beforeEach } from 'vitest';
import { runGo } from '../src/components/go-runner';

describe('go-runner loader', () => {
  beforeEach(() => { (globalThis as any).goRunWasm = undefined; });
  it('delegates to the wasm-provided goRunWasm', async () => {
    (globalThis as any).goRunWasm = (s: string) => ({ output: 'ran:' + s, errors: '' });
    const res = await runGo('X', { skipLoad: true });
    expect(res.output).toBe('ran:X');
    expect(res.errors).toBe('');
  });
  it('reports a clear error when runtime is missing', async () => {
    const res = await runGo('X', { skipLoad: true });
    expect(res.errors).toMatch(/runtime/i);
  });

  it('returns exact unavailable message when goRunWasm is not set', async () => {
    const res = await runGo('X', { skipLoad: true });
    expect(res.errors).toBe('Go runtime unavailable.');
    expect(res.output).toBe('');
  });

  it('propagates throw from goRunWasm (no silent catch)', async () => {
    (globalThis as any).goRunWasm = () => { throw new Error('boom'); };
    await expect(runGo('X', { skipLoad: true })).rejects.toThrow('boom');
  });
});
