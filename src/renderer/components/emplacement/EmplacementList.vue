<template>
  <section class="entity-list">
    <header>
      <div>
        <p class="entity-list__eyebrow">Implantations</p>
        <h3>Emplacements</h3>
      </div>
      <p>{{ emplacements.length }} zones</p>
    </header>

    <table>
      <colgroup>
        <col class="col-nom" />
        <col class="col-type" />
        <col class="col-capacite" />
        <col class="col-temperature" />
        <col class="col-humidite" />
        <col class="col-notes" />
        <col class="col-actions" />
      </colgroup>
      <thead>
        <tr>
          <th class="align-left">Nom</th>
          <th class="align-center">Type</th>
          <th class="align-center">Capacité</th>
          <th class="align-center">Température</th>
          <th class="align-center">Humidité</th>
          <th class="align-left">Notes</th>
          <th class="actions-header align-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emplacement in emplacements" :key="emplacement.id">
          <template v-if="editingId === emplacement.id">
            <td class="align-left">
              <input v-model="editForm.nom" type="text" />
            </td>
            <td class="align-center">
              <select v-model="editForm.type">
                <option value="Cave">Cave</option>
                <option value="Casier">Casier</option>
                <option value="Armoire">Armoire</option>
                <option value="Autre">Autre</option>
              </select>
            </td>
            <td class="align-center">
              <input v-model.number="editForm.capacite" type="number" min="0" />
            </td>
            <td class="align-center">
              <input v-model="editForm.temperature" type="text" placeholder="12°C" />
            </td>
            <td class="align-center">
              <input v-model="editForm.humidite" type="text" placeholder="70%" />
            </td>
            <td class="align-left">
              <input v-model="editForm.notes" type="text" />
            </td>
            <td class="actions align-right">
              <button class="btn btn--primary" @click="saveEdit">Enregistrer</button>
              <button class="btn btn--ghost" @click="cancelEdit">Annuler</button>
            </td>
          </template>
          <template v-else>
            <td class="align-left">{{ emplacement.nom }}</td>
            <td class="align-center">{{ emplacement.type }}</td>
            <td class="align-center">{{ emplacement.capacite ?? '—' }}</td>
            <td class="align-center">{{ emplacement.temperature ?? '—' }}</td>
            <td class="align-center">{{ emplacement.humidite ?? '—' }}</td>
            <td class="align-left truncate">{{ formatNotes(emplacement.notes) }}</td>
            <td class="actions align-right">
              <button class="btn btn--ghost" @click="startEdit(emplacement)">Modifier</button>
              <button class="btn btn--danger" @click="confirmDelete(emplacement.id)">Supprimer</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useEmplacementService, type Emplacement } from '../../services/emplacementService';

const { emplacements, updateEmplacement, deleteEmplacement } = useEmplacementService();
const editingId = ref<number | null>(null);
const editForm = reactive({
  nom: '',
  type: 'Autre',
  capacite: undefined as number | undefined,
  temperature: '',
  humidite: '',
  notes: '',
});

const formatNotes = (value?: string) => {
  if (!value) return '—';
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && 'notes' in parsed) {
      const noteValue = (parsed as any).notes;
      if (typeof noteValue === 'string' && noteValue.trim()) return noteValue.trim();
    }
  } catch {
    // ignore
  }
  return value;
};

const startEdit = (emplacement: Emplacement) => {
  editingId.value = emplacement.id;
  Object.assign(editForm, {
    nom: emplacement.nom,
    type: emplacement.type,
    capacite: emplacement.capacite ?? undefined,
    temperature: emplacement.temperature ?? '',
    humidite: emplacement.humidite ?? '',
    notes: emplacement.notes ?? '',
  });
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async () => {
  if (!editingId.value) return;
  await updateEmplacement(editingId.value, { ...editForm });
  editingId.value = null;
};

const confirmDelete = (id: number) => {
  if (window.confirm('Supprimer cet emplacement ?')) {
    deleteEmplacement(id);
    if (editingId.value === id) {
      editingId.value = null;
    }
  }
};
</script>

<style scoped>
.entity-list {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  background: #0b1221;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

header {
  display: flex;
  justify-content: space-between;
}

.entity-list__eyebrow {
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.9rem;
  vertical-align: middle;
}

thead {
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.col-nom {
  width: 22%;
}

.col-type {
  width: 14%;
}

.col-capacite {
  width: 12%;
}

.col-temperature {
  width: 14%;
}

.col-humidite {
  width: 14%;
}

.col-notes {
  width: 24%;
}

.col-actions {
  width: 12%;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  white-space: nowrap;
}

.actions-header {
  text-align: right;
}

.btn {
  border: 1px solid #1e293b;
  border-radius: 0.5rem;
  padding: 0.3rem 0.65rem;
  background: transparent;
  color: #e2e8f0;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn--primary {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.btn--ghost {
  border-color: rgba(148, 163, 184, 0.4);
}

.btn--danger {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.4);
  color: #fca5a5;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid #1e293b;
  background: #020617;
  color: #e2e8f0;
  padding: 0.35rem 0.5rem;
}

.truncate {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
