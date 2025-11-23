import { ref } from 'vue';
import {
  EmplacementCreateInput,
  EmplacementRecord,
  EmplacementType,
} from 'src/shared/emplacement';

export interface Emplacement {
  id: number;
  nom: string;
  type: EmplacementType;
  capacite?: number;
  temperature?: string;
  humidite?: string;
  notes?: string;
}

export interface EmplacementInput {
  nom: string;
  type: Emplacement['type'];
  capacite?: number;
  temperature?: string;
  humidite?: string;
  notes?: string;
}

export type EmplacementUpdate = Partial<EmplacementInput>;

const emplacements = ref<Emplacement[]>([]);
let nextEmplacementId = 1;
let hasSyncedWithElectron = false;

function parseLegacyNotes(value: string | null | undefined) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed as {
        type?: EmplacementType;
        capacite?: number | null;
        temperature?: string | null;
        humidite?: string | null;
        notes?: string | null;
      };
    }
  } catch {
    // not JSON, ignore
  }
  return null;
}

function mapRecordToEmplacement(record: EmplacementRecord): Emplacement {
  const legacy = parseLegacyNotes(record.notes);
  return {
    id: record.id,
    nom: record.nom,
    type: record.type ?? legacy?.type ?? 'Autre',
    capacite: record.capacite ?? legacy?.capacite ?? undefined,
    temperature: record.temperature ?? legacy?.temperature ?? undefined,
    humidite: record.humidite ?? legacy?.humidite ?? undefined,
    notes: legacy?.notes ?? record.notes ?? undefined,
  };
}

async function hydrateFromElectron() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService?.emplacements) {
    return;
  }

  try {
    const remote = await window.electronService.emplacements.getEmplacements();
    emplacements.value = remote.map(mapRecordToEmplacement);
    nextEmplacementId = emplacements.value.length
      ? Math.max(...emplacements.value.map((e) => e.id)) + 1
      : 1;
    hasSyncedWithElectron = true;
  } catch (err) {
    console.error('fetchEmplacements failed', err);
  }
}

async function addEmplacement(payload: EmplacementInput) {
  const emplacementToPersist: EmplacementCreateInput = {
    nom: payload.nom.trim(),
    type: payload.type,
    capacite: payload.capacite ?? null,
    temperature: payload.temperature?.trim() || null,
    humidite: payload.humidite?.trim() || null,
    notes: payload.notes?.trim() || null,
  };

  if (typeof window !== 'undefined' && window.electronService?.emplacements) {
    try {
      const created = await window.electronService.emplacements.addEmplacement(emplacementToPersist);
      const emplacement = mapRecordToEmplacement(created);
      emplacements.value = [emplacement, ...emplacements.value];
      return emplacement;
    } catch (err) {
      console.error('addEmplacement failed', err);
    }
  }

  const fallback: Emplacement = {
    id: nextEmplacementId++,
    nom: emplacementToPersist.nom,
    type: emplacementToPersist.type,
    capacite: emplacementToPersist.capacite ?? undefined,
    temperature: emplacementToPersist.temperature ?? undefined,
    humidite: emplacementToPersist.humidite ?? undefined,
    notes: emplacementToPersist.notes ?? undefined,
  };
  emplacements.value = [fallback, ...emplacements.value];
  return fallback;
}

async function updateEmplacement(id: number, updates: EmplacementUpdate) {
  const index = emplacements.value.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const current = emplacements.value[index];
  const payload: EmplacementUpdate = {
    nom: updates.nom?.trim() || current.nom,
    type: updates.type ?? current.type,
    capacite: updates.capacite ?? current.capacite,
    temperature: updates.temperature?.trim() || current.temperature,
    humidite: updates.humidite?.trim() || current.humidite,
    notes: updates.notes?.trim() || current.notes,
  };

  if (typeof window !== 'undefined' && window.electronService?.emplacements) {
    try {
      const updatedRecord = await window.electronService.emplacements.updateEmplacement(id, {
        nom: payload.nom,
        type: payload.type,
        capacite: payload.capacite ?? null,
        temperature: payload.temperature ?? null,
        humidite: payload.humidite ?? null,
        notes: payload.notes ?? null,
      });
      const mapped = mapRecordToEmplacement(updatedRecord);
      emplacements.value.splice(index, 1, mapped);
      return mapped;
    } catch (err) {
      console.error('updateEmplacement failed', err);
    }
  }

  const updated: Emplacement = {
    ...current,
    ...payload,
  };
  emplacements.value.splice(index, 1, updated);
  return updated;
}

async function deleteEmplacement(id: number) {
  const index = emplacements.value.findIndex((e) => e.id === id);
  if (index === -1) return false;

  if (typeof window !== 'undefined' && window.electronService?.emplacements) {
    try {
      await window.electronService.emplacements.deleteEmplacement(id);
    } catch (err) {
      console.error('deleteEmplacement failed', err);
    }
  }

  emplacements.value.splice(index, 1);
  return true;
}

export function useEmplacementService() {
  hydrateFromElectron();

  return {
    emplacements,
    addEmplacement,
    fetchEmplacements: hydrateFromElectron,
    updateEmplacement,
    deleteEmplacement,
  };
}
