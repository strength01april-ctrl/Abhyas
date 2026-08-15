import type { StudyMaterial } from '@/types';
import { MAX_MATERIALS } from '@/config/appConfig';

/**
 * Local storage-backed persistence for study materials.
 * Materials are local to the device/browser — no accounts, no cloud.
 */

const STORAGE_KEY = 'abhyas.materials.v1';
const SOUND_KEY = 'abhyas.sound.v1';

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  loadMaterials(): StudyMaterial[] {
    return safeRead<StudyMaterial[]>(STORAGE_KEY, []);
  },

  saveMaterials(materials: StudyMaterial[]): boolean {
    return safeWrite(STORAGE_KEY, materials);
  },

  /** Returns the new material or an error message. */
  addMaterial(material: StudyMaterial): { ok: true } | { ok: false; message: string } {
    const existing = storage.loadMaterials();
    if (existing.length >= MAX_MATERIALS) {
      return {
        ok: false,
        message: `You can save up to ${MAX_MATERIALS} study materials. Delete an existing material to add a new one.`,
      };
    }
    existing.push(material);
    storage.saveMaterials(existing);
    return { ok: true };
  },

  updateMaterial(id: string, patch: Partial<StudyMaterial>): void {
    const list = storage.loadMaterials().map((m) =>
      m.id === id ? { ...m, ...patch } : m,
    );
    storage.saveMaterials(list);
  },

  deleteMaterial(id: string): void {
    const list = storage.loadMaterials().filter((m) => m.id !== id);
    storage.saveMaterials(list);
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },

  // ── Sound preference ──────────────────────────────────────────────────────
  loadSoundPreference(): boolean {
    const v = safeRead<boolean | null>(SOUND_KEY, null);
    return v === null ? true : v;
  },
  saveSoundPreference(enabled: boolean): void {
    safeWrite(SOUND_KEY, enabled);
  },
};

export function generateId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
