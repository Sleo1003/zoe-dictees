const KEY_ERR = 'zoe-errors';
const KEY_STATS = 'zoe-parent-stats';
const KEY_PROGRESS = 'zoe-progress';
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(key: string, val: any): void {
    if (typeof window !== 'undefined') try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};
export const getErrors = () => storage.get<ErrorCounts>(KEY_ERR).then(r => r || {});
export const saveErrors = (c: ErrorCounts) => storage.set(KEY_ERR, c);
export const getProgress = () => storage.get<Completed>(KEY_PROGRESS).then(r => r || {});
export const saveProgress = (c: Completed) => storage.set(KEY_PROGRESS, c);
export const getParentStats = () => storage.get<any>(KEY_STATS).then(r => r || { sessions: 0, total: 0, correct: 0, lastDate: '' });
export const saveParentStats = (s: any) => storage.set(KEY_STATS, s);
export const resetAll = () => { [KEY_ERR, KEY_STATS, KEY_PROGRESS].forEach(k => localStorage.removeItem(k)); window.location.reload(); };
