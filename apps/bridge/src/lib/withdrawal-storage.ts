// Keep addresses only; account data/status always comes from Solana.
// In-memory storage also works when the browser denies localStorage access.
const remembered = new Map<string, string[]>();

// Newest entries are appended last; older ones stay discoverable through
// history pagination, so only the most recent ones are retained.
const MAX_REMEMBERED_WITHDRAWALS = 100;

export function knownWithdrawals(program: string, owner: string): string[] {
  const key = `wxmr:withdrawals:${program}:${owner}`;
  let stored: unknown;
  try { stored = JSON.parse(localStorage.getItem(key) || '[]'); } catch { stored = []; }
  const fromDisk = Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string') : [];
  return [...new Set([...(remembered.get(key) ?? []), ...fromDisk])];
}

export function rememberWithdrawals(program: string, owner: string, addresses: string[]) {
  const key = `wxmr:withdrawals:${program}:${owner}`;
  const next = [...new Set([...knownWithdrawals(program, owner), ...addresses])].slice(-MAX_REMEMBERED_WITHDRAWALS);
  remembered.set(key, next);
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Memory fallback remains available. */ }
}
