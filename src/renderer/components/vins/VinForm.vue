<template>
  <form class="vin-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="vin-form__eyebrow">Nouvelle entrée</p>
        <h2>Ajouter un vin</h2>
      </div>
        <button type="submit">Enregistrer</button>
    </header>

    <div class="vin-form__grid">
      <label>
        Nom du vin *
        <input v-model="form.nom" type="text" placeholder="Chateau..." required />
      </label>

      <label>
        Millesime
        <input v-model.number="form.millesime" type="number" min="1900" max="2100" />
      </label>

      <label>
        Type
        <select v-model="form.type" required>
          <option v-for="type in vinTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>

      <label>
        Pays
        <input v-model="form.pays" type="text" list="country-options" placeholder="France..." />
        <datalist id="country-options">
          <option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </option>
        </datalist>
      </label>

      <label>
        Region
        <input
          v-model="form.region"
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
        Stock
        <input v-model.number="form.stock" type="number" min="0" />
      </label>

      <label>
        Potentiel de garde (annees)
        <select v-model.number="form.potentielGardeYears">
          <option v-for="years in potentielOptions" :key="years" :value="years">
            {{ years }} ans
          </option>
        </select>
      </label>

      <label>
        Fournisseur
        <select v-model.number="form.fournisseurId">
          <option :value="undefined">Non specifie</option>
          <option v-for="f in fournisseurs" :key="f.id" :value="f.id">{{ f.nom }}</option>
        </select>
      </label>

      <label>
        Emplacement
        <select v-model.number="form.emplacementId">
          <option :value="undefined">Non specifie</option>
          <option v-for="e in emplacements" :key="e.id" :value="e.id">{{ e.nom }}</option>
        </select>
      </label>

      <label>
        Emplacement precis
        <input
          v-model="form.emplacementPrecision"
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

    <label>
      Notes
      <textarea v-model="form.notes" rows="3" placeholder="Commentaires ou instructions"></textarea>
    </label>

    <label>
      Tags (separes par des virgules)
      <input v-model="tagsInput" type="text" list="tag-options" placeholder="Grand cru, A surveiller..." />
      <datalist id="tag-options">
        <option v-for="tag in tagSuggestions" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </datalist>
    </label>

    <p v-if="feedback" class="vin-form__feedback">{{ feedback }}</p>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useVinStore, type VinInput, type VinType } from '../../services/vinService';
import { useFournisseurService } from '../../services/fournisseurService';
import { useEmplacementService } from '../../services/emplacementService';

const { addVin, vins } = useVinStore();
const { fournisseurs } = useFournisseurService();
const { emplacements } = useEmplacementService();

const vinTypes: VinType[] = ['Rouge', 'Blanc', 'Rose', 'Effervescent', 'Liquoreux', 'Autre'];
const potentielOptions = [2, 4, 6, 8, 10, 12, 15, 20, 25];
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
const regionOptions = computed(() => {
  const country = form.pays?.trim();
  if (!country) return baseRegionOptions;
  return regionByCountry[country] ?? baseRegionOptions;
});
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
const tagSuggestions = computed(() => {
  const set = new Set<string>();
  baseTagSuggestions.forEach((tag) => set.add(tag));
  vins.value.forEach((vin) => vin.tags?.forEach((tag) => set.add(tag)));
  return Array.from(set);
});

const form = reactive<VinInput & { stock: number; potentielGardeYears: number }>({
  nom: '',
  type: 'Rouge',
  millesime: new Date().getFullYear(),
  region: '',
  pays: '',
  fournisseurId: undefined,
  emplacementId: undefined,
  emplacementPrecision: '',
  notes: '',
  tags: [],
  stock: 6,
  potentielGardeYears: 6,
});

const tagsInput = ref('');
const feedback = ref('');

const handleSubmit = () => {
  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  addVin({
    ...form,
    tags,
    stock: form.stock,
    potentielGarde: `${form.potentielGardeYears} ans`,
  });

  feedback.value = 'Vin ajoute avec succes';

  Object.assign(form, {
    nom: '',
    millesime: new Date().getFullYear(),
    region: '',
    pays: '',
    notes: '',
    stock: 6,
    potentielGardeYears: 6,
    fournisseurId: undefined,
    emplacementId: undefined,
    emplacementPrecision: '',
    tags: [],
  });
  tagsInput.value = '';

  setTimeout(() => (feedback.value = ''), 2500);
};
</script>

<style scoped>
.vin-form {
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 1.5rem;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vin-form header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.vin-form__eyebrow {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.vin-form button {
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  border-radius: 9999px;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
}

.vin-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #cbd5f5;
}

input,
select,
textarea {
  background: #020617;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

.vin-form__feedback {
  margin: 0;
  font-size: 0.9rem;
  color: #34d399;
}
</style>
