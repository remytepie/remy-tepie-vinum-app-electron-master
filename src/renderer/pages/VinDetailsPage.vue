<template>
  <div class="vin-details-page">
    <button class="vin-details-page__back" type="button" @click="goBack">
      ← Retour à la liste
    </button>
    <VinDetails :vin="vin" />

    <div v-if="vin && isAdmin" class="vin-details-page__actions">
      <button type="button" class="vin-details-page__delete" @click="handleDeleteVin" :disabled="isDeleting">
        {{ isDeleting ? 'Suppression…' : 'Supprimer ce vin' }}
      </button>
      <span v-if="deleteFeedback" class="vin-details-page__delete-feedback">{{ deleteFeedback }}</span>
    </div>

    <form
      v-if="vin && isAdmin"
      class="vin-details-page__general"
      @submit.prevent="handleGeneralUpdate"
    >
      <div class="vin-details-page__general-header">
        <div>
          <h3>Informations générales</h3>
          <p>Modifiez le descriptif principal de ce vin.</p>
        </div>
        <button type="submit" :disabled="isUpdatingGeneral">
          {{ isUpdatingGeneral ? 'Mise à jour…' : 'Enregistrer les modifications' }}
        </button>
      </div>

      <div class="vin-details-page__general-grid">
        <label>
          Nom du vin
          <input v-model="generalForm.nom" type="text" required />
        </label>
        <label>
          Millésime
          <input v-model.number="generalForm.millesime" type="number" min="1900" max="2100" />
        </label>
        <label>
          Type
          <select v-model="generalForm.type">
            <option v-for="type in vinTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </label>
        <label>
          Pays
          <input
            v-model="generalForm.pays"
            type="text"
            list="country-options"
            placeholder="France..."
          />
          <datalist id="country-options">
            <option v-for="country in countryOptions" :key="country" :value="country">
              {{ country }}
            </option>
          </datalist>
        </label>
        <label>
          Région
          <input
            v-model="generalForm.region"
            type="text"
            list="region-options"
            placeholder="Bourgogne..."
          />
          <datalist id="region-options">
            <option v-for="region in regionOptions" :key="region" :value="region">
              {{ region }}
            </option>
          </datalist>
        </label>
        <label>
          Fournisseur
          <select v-model="selectedFournisseurId">
            <option value="">Non spécifié</option>
            <option v-for="fournisseur in fournisseurs" :key="fournisseur.id" :value="fournisseur.id">
              {{ fournisseur.nom }}
            </option>
          </select>
        </label>
        <label>
          Potentiel de garde
          <input v-model="generalForm.potentielGarde" type="text" placeholder="2028-2035" />
        </label>
      </div>

      <label>
        Notes
        <textarea v-model="generalForm.notes" rows="3" placeholder="Notes de dégustation ou instructions"></textarea>
      </label>

      <label>
        Tags (séparés par des virgules)
        <input
          v-model="tagsInput"
          type="text"
          list="tag-options"
          placeholder="Grand cru, A surveiller..."
        />
        <datalist id="tag-options">
          <option v-for="tag in tagSuggestions" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </datalist>
      </label>

      <span v-if="generalFeedback" class="vin-details-page__general-feedback">
        {{ generalFeedback }}
      </span>
    </form>

    <form
      v-if="vin && isAdmin"
      class="vin-details-page__location"
      @submit.prevent="handleLocationUpdate"
    >
      <div>
        <h3>Emplacement dans la cave</h3>
        <p>Spécifiez précisément où trouver ce vin.</p>
      </div>
      <div class="vin-details-page__location-grid">
        <label>
          Emplacement principal
          <select v-model="selectedEmplacementId">
            <option value="">Non spécifié</option>
            <option v-for="emplacement in emplacements" :key="emplacement.id" :value="emplacement.id">
              {{ emplacement.nom }}
            </option>
          </select>
        </label>
        <label>
          Détail précis
          <input
            v-model="emplacementForm.emplacementPrecision"
            type="text"
            list="emplacement-precision-options"
            placeholder="Rangee A - Case 1"
          />
          <datalist id="emplacement-precision-options">
            <option
              v-for="precision in emplacementPrecisionOptions"
              :key="precision"
              :value="precision"
            >
              {{ precision }}
            </option>
          </datalist>
        </label>
      </div>
      <div class="vin-details-page__location-actions">
        <button type="submit" :disabled="isUpdatingLocation">
          {{ isUpdatingLocation ? 'Mise à jour…' : 'Mettre à jour l’emplacement' }}
        </button>
        <span v-if="locationFeedback" class="vin-details-page__location-feedback">
          {{ locationFeedback }}
        </span>
      </div>
    </form>

    <div class="vin-details-page__grid" v-if="vin">
      <MouvementForm v-if="isAdmin" :vin-id="vin.id" />
      <div v-else class="vin-details-page__notice">
        Mode lecture seule : seuls les administrateurs peuvent enregistrer des mouvements.
      </div>
      <MouvementList :vin-id="vin.id" title="Historique du vin" />
    </div>

    <div v-else class="vin-details-page__empty">
      <p>Impossible de charger ce vin.</p>
      <RouterLink to="/">Retour à la liste</RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import VinDetails from '../components/vins/VinDetails.vue';
import MouvementForm from '../components/mouvements/MouvementForm.vue';
import MouvementList from '../components/mouvements/MouvementList.vue';
import { useVinStore, type VinType } from '../services/vinService';
import { useAuth } from '../services/authService';
import { useEmplacementService } from '../services/emplacementService';
import { useFournisseurService } from '../services/fournisseurService';
import { useMouvementService } from '../services/mouvementService';

const route = useRoute();
const router = useRouter();
const { vins, fetchVins, updateVin, deleteVin } = useVinStore();
const { emplacements } = useEmplacementService();
const { fournisseurs } = useFournisseurService();
const { removeMouvementsForVin } = useMouvementService();

const vinId = computed(() => Number(route.params.id));
const vin = computed(() => vins.value.find((value) => value.id === vinId.value));
const { isAdmin } = useAuth();

const vinTypes: VinType[] = ['Rouge', 'Blanc', 'Rosé', 'Effervescent', 'Liquoreux', 'Autre'];
const countryOptions = [
  'France',
  'Italie',
  'Espagne',
  'Portugal',
  'Allemagne',
  'Suisse',
  'Autriche',
  'Etats-Unis',
  'Canada',
  'Chili',
  'Argentine',
  'Uruguay',
  'Afrique du Sud',
  'Australie',
  'Nouvelle-Zelande',
  'Grece',
  'Hongrie',
  'Slovenie',
  'Georgie',
  'Liban',
];
const emplacementPrecisionOptions = [
  'Rangee A - Case 1',
  'Rangee A - Case 2',
  'Rangee B - Case 1',
  'Rangee B - Case 2',
  'Rangee C - Case 1',
  'Cave principale',
  'Cave secondaire',
  'Haut de l etagere',
  'Bas de l etagere',
  'Frigo a vin',
];
const baseRegionOptions = [
  'Bordeaux',
  'Bourgogne',
  'Champagne',
  'Vallee du Rhone',
  'Loire',
  'Alsace',
  'Provence',
  'Languedoc',
  'Beaujolais',
  'Jura',
  'Savoie',
  'Sud-Ouest',
  'Corse',
  'Rioja',
  'Ribera del Duero',
  'Priorat',
  'Douro',
  'Vinho Verde',
  'Piemonte',
  'Toscane',
  'Veneto',
  'Sicile',
  'Mosel',
  'Baden',
  'Nahe',
  'Mendoza',
  'Maipo Valley',
  'Colchagua',
  'Napa Valley',
  'Sonoma',
  'Willamette Valley',
  'Barossa Valley',
  'Hunter Valley',
  'Marlborough',
  'Stellenbosch',
];
const regionByCountry: Record<string, string[]> = {
  France: [
    'Alsace',
    'Beaujolais',
    'Bordeaux',
    'Bourgogne',
    'Champagne',
    'Corse',
    'Jura',
    'Languedoc',
    'Loire',
    'Provence',
    'Roussillon',
    'Savoie',
    'Sud-Ouest',
    'Vallee du Rhone',
  ],
  Italie: ['Piemonte', 'Toscane', 'Veneto', 'Sicile', 'Puglia', 'Sardaigne', 'Lombardie', 'Umbria'],
  Espagne: ['Rioja', 'Ribera del Duero', 'Priorat', 'Rias Baixas', 'Navarre', 'Penedes', 'La Mancha'],
  Portugal: ['Douro', 'Vinho Verde', 'Dao', 'Alentejo', 'Bairrada', 'Lisbonne'],
  Allemagne: ['Mosel', 'Rheingau', 'Nahe', 'Pfalz', 'Baden', 'Franken'],
  Suisse: ['Valais', 'Vaud', 'Tessin', 'Geneve'],
  Autriche: ['Wachau', 'Kamptal', 'Burgenland', 'Styrie'],
  'Etats-Unis': ['Napa Valley', 'Sonoma', 'Willamette Valley', 'Paso Robles', 'Finger Lakes'],
  Canada: ['Okanagan', 'Niagara', 'Prince Edward County'],
  Chili: ['Maipo Valley', 'Colchagua', 'Casablanca', 'Aconcagua'],
  Argentine: ['Mendoza', 'Salta', 'Patagonie'],
  Uruguay: ['Canelones', 'Montevideo', 'San Jose'],
  'Afrique du Sud': ['Stellenbosch', 'Paarl', 'Swartland', 'Constantia'],
  Australie: ['Barossa Valley', 'Hunter Valley', 'Yarra Valley', 'Margaret River'],
  'Nouvelle-Zelande': ['Marlborough', 'Hawkes Bay', 'Central Otago'],
  Grece: ['Santorin', 'Nemea', 'Naoussa'],
  Hongrie: ['Tokaj', 'Eger', 'Villany'],
  Slovenie: ['Primorska', 'Podravje', 'Posavje'],
  Georgie: ['Kakheti', 'Kartli'],
  Liban: ['Bekaa Valley'],
};

const generalForm = reactive({
  nom: '',
  type: 'Rouge' as VinType,
  millesime: undefined as number | undefined,
  region: '',
  pays: '',
  fournisseurId: undefined as number | undefined,
  potentielGarde: '',
  notes: '',
});
const tagsInput = ref('');
const regionOptions = computed(() => {
  const country = generalForm.pays?.trim();
  if (!country) return baseRegionOptions;
  return regionByCountry[country] ?? baseRegionOptions;
});
const tagSuggestions = computed(() => {
  const set = new Set<string>();
  const baseTagSuggestions = [
    'Grand cru',
    'Bio',
    'Biodynamie',
    'A boire',
    'A garder',
    'Carafer',
    'Sans sulfites',
    'Fruite',
    'Epicé',
    'Boise',
    'Sec',
    'Demi-sec',
    'Moelleux',
    'Sucre',
  ];
  baseTagSuggestions.forEach((tag) => set.add(tag));
  vins.value.forEach((v) => v.tags?.forEach((t) => set.add(t)));
  return Array.from(set);
});

const selectedFournisseurId = computed({
  get: () => generalForm.fournisseurId ?? '',
  set: (value: string | number) => {
    if (value === '' || value === undefined) {
      generalForm.fournisseurId = undefined;
      return;
    }
    generalForm.fournisseurId = typeof value === 'number' ? value : Number(value);
  },
});

const emplacementForm = reactive<{
  emplacementId?: number;
  emplacementPrecision: string;
}>({
  emplacementId: undefined,
  emplacementPrecision: '',
});

const selectedEmplacementId = computed({
  get: () => emplacementForm.emplacementId ?? '',
  set: (value: string | number) => {
    if (value === '' || value === undefined) {
      emplacementForm.emplacementId = undefined;
      return;
    }

    emplacementForm.emplacementId = typeof value === 'number' ? value : Number(value);
  },
});

const locationFeedback = ref('');
const isUpdatingLocation = ref(false);
const generalFeedback = ref('');
const isUpdatingGeneral = ref(false);
const isDeleting = ref(false);
const deleteFeedback = ref('');

watch(
  vin,
  (current) => {
    emplacementForm.emplacementId = current?.emplacementId;
    emplacementForm.emplacementPrecision = current?.emplacementPrecision ?? '';
  },
  { immediate: true },
);

watch(
  vin,
  (current) => {
    generalForm.nom = current?.nom ?? '';
    generalForm.type = current?.type ?? 'Rouge';
    generalForm.millesime = current?.millesime;
    generalForm.region = current?.region ?? '';
    generalForm.pays = current?.pays ?? '';
    generalForm.fournisseurId = current?.fournisseurId;
    generalForm.potentielGarde = current?.potentielGarde ?? '';
    generalForm.notes = current?.notes ?? '';
    tagsInput.value = current?.tags?.join(', ') ?? '';
  },
  { immediate: true },
);

const handleLocationUpdate = () => {
  if (!vin.value) return;

  isUpdatingLocation.value = true;
  updateVin(vin.value.id, {
    emplacementId: emplacementForm.emplacementId,
    emplacementPrecision: emplacementForm.emplacementPrecision.trim() || undefined,
  });
  locationFeedback.value = 'Emplacement mis à jour';
  isUpdatingLocation.value = false;
  setTimeout(() => (locationFeedback.value = ''), 2000);
};

const handleGeneralUpdate = () => {
  if (!vin.value) return;

  isUpdatingGeneral.value = true;
  const normalizedMillesime =
    typeof generalForm.millesime === 'number' && !Number.isNaN(generalForm.millesime)
      ? generalForm.millesime
      : undefined;
  const normalizedTags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  updateVin(vin.value.id, {
    nom: generalForm.nom.trim(),
    type: generalForm.type,
    millesime: normalizedMillesime,
    region: generalForm.region.trim() || undefined,
    pays: generalForm.pays.trim() || undefined,
    fournisseurId: generalForm.fournisseurId,
    potentielGarde: generalForm.potentielGarde.trim() || undefined,
    notes: generalForm.notes.trim() || undefined,
    tags: normalizedTags,
  });
  generalFeedback.value = 'Informations mises à jour';
  isUpdatingGeneral.value = false;
  setTimeout(() => (generalFeedback.value = ''), 2000);
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/vins');
};

const handleDeleteVin = () => {
  if (!vin.value) return;
  const confirmed = window.confirm(`Supprimer "${vin.value.nom}" ? Cette action retirera aussi ses mouvements.`);
  if (!confirmed) return;

  isDeleting.value = true;
  removeMouvementsForVin(vin.value.id);
  deleteVin(vin.value.id);
  deleteFeedback.value = 'Vin supprimé';
  setTimeout(() => (deleteFeedback.value = ''), 2000);
  router.push('/vins');
};

onMounted(fetchVins);
</script>

<style scoped>
.vin-details-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vin-details-page__back {
  border: 1px solid #1e293b;
  background: transparent;
  color: #cbd5f5;
  border-radius: 9999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.vin-details-page__back:hover {
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
}

.vin-details-page__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vin-details-page__general,
.vin-details-page__location {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vin-details-page__general-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.vin-details-page__general-header button {
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.vin-details-page__general-header button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vin-details-page__general-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.vin-details-page__general label,
.vin-details-page__location label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5f5;
}

.vin-details-page__general input,
.vin-details-page__general select,
.vin-details-page__general textarea,
.vin-details-page__location select,
.vin-details-page__location input {
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
  background: #020617;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
}

.vin-details-page__general textarea {
  resize: vertical;
}

.vin-details-page__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vin-details-page__delete {
  border: none;
  border-radius: 9999px;
  padding: 0.45rem 1.2rem;
  background: linear-gradient(120deg, #ef4444, #f97316);
  color: white;
  cursor: pointer;
  font-weight: 700;
}

.vin-details-page__delete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.vin-details-page__delete-feedback {
  color: #fca5a5;
  font-size: 0.9rem;
}

.vin-details-page__general-feedback {
  color: #34d399;
  font-size: 0.9rem;
}

.vin-details-page__location-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.vin-details-page__location-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.vin-details-page__location button {
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.vin-details-page__location button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vin-details-page__location-feedback {
  color: #34d399;
  font-size: 0.9rem;
}

.vin-details-page__notice {
  border: 1px dashed #475569;
  border-radius: 1rem;
  padding: 1rem;
  color: #cbd5f5;
  background: rgba(148, 163, 184, 0.1);
}

.vin-details-page__empty {
  text-align: center;
  padding: 2rem;
  border: 1px dashed #475569;
  border-radius: 1rem;
}
</style>


