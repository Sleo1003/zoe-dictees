// src/utils/storage.ts - Version multi-profils
import type { ErrorCounts, Completed, Profile } from '../types';

const KEY_PROFILES = 'zoe-profiles';
const KEY_ACTIVE   = 'zoe-active-profile';

// Clé unique par profil : zoe-errors-<profileId>, zoe-progress-<profileId>, etc.
const pk = (pid: string, s: string) => `zoe-${s}-${pid}`;

// ── Stockage générique ────────────────────────────────────────────────────────
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set(key: string, val: any): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {}
    }
  },
};

// ── Gestion des profils ───────────────────────────────────────────────────────
export const getProfiles = async () => {
  const r = await storage.get<Profile[]>(KEY_PROFILES);
  return r || [];
};

export const saveProfiles = (profiles: Profile[]) => {
  storage.set(KEY_PROFILES, profiles);
};

export const getActiveProfile = async () => {
  const r = await storage.get<string>(KEY_ACTIVE);
  return r || null;
};

export const saveActiveProfile = (id: string) => {
  storage.set(KEY_ACTIVE, id);
};

// ── Données par profil (TOUTES prennent profileId en 1er argument) ────────────
export const getErrors = async (pid: string): Promise<ErrorCounts> => {
  const r = await storage.get<ErrorCounts>(pk(pid, 'errors'));
  return r || {};
};

export const saveErrors = (pid: string, counts: ErrorCounts) => {
  storage.set(pk(pid, 'errors'), counts);
};

export const getProgress = async (pid: string): Promise<Completed> => {
  const r = await storage.get<Completed>(pk(pid, 'progress'));
  return r || {};
};

export const saveProgress = (pid: string, completed: Completed) => {
  storage.set(pk(pid, 'progress'), completed);
};

export const getParentStats = async (pid: string) => {
  const r = await storage.get<any>(pk(pid, 'stats'));
  return r || { sessions: 0, correct: 0, total: 0, lastDate: '' };
};

export const saveParentStats = (pid: string, stats: any) => {
  storage.set(pk(pid, 'stats'), stats);
};

// ── Réinitialisation d'un profil ──────────────────────────────────────────────
export const resetProfile = (pid: string) => {
  ['errors', 'progress', 'stats'].forEach(s => {
    localStorage.removeItem(pk(pid, s));
  });
};

export const resetAll = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    window.location.reload();
  }
};