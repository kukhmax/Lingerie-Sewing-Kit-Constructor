// Zapamiętywanie zestawu w przeglądarce (localStorage), żeby przetrwał odświeżenie strony.
import { GARMENTS, GARMENT_IDS, SIZES } from '../config/garments.js';

const KEY = 'sdc.kit.v1';

export function defaultState() {
  return {
    activeGarment: GARMENT_IDS[0],
    selections: Object.fromEntries(GARMENT_IDS.map((g) => [g, {}])),
    sizes: Object.fromEntries(GARMENT_IDS.map((g) => [g, 'M'])),
    overrides: {},
  };
}

// Z dowolnych (być może uszkodzonych lub starych) danych robi poprawny stan
export function sanitizeState(raw) {
  const state = defaultState();
  if (!raw || typeof raw !== 'object') return state;

  if (GARMENT_IDS.includes(raw.activeGarment)) state.activeGarment = raw.activeGarment;

  for (const g of GARMENT_IDS) {
    if (SIZES.includes(raw.sizes?.[g])) state.sizes[g] = raw.sizes[g];
    const saved = raw.selections?.[g];
    if (!saved || typeof saved !== 'object') continue;
    for (const part of GARMENTS[g].parts) {
      const id = saved[part.id];
      if (typeof id === 'string' || typeof id === 'number') state.selections[g][part.id] = String(id);
    }
  }

  if (raw.overrides && typeof raw.overrides === 'object') {
    for (const [id, qty] of Object.entries(raw.overrides)) {
      if (Number.isFinite(qty) && qty > 0 && qty <= 1000) state.overrides[id] = qty;
    }
  }
  return state;
}

// Usuwa wybory materiałów, których nie ma już w katalogu lub które przestały pasować do części.
// Zwraca { selections, overrides, removed } — removed = ile wyborów usunięto.
export function pruneState(selections, overrides, productsById, isCompatible) {
  let removed = 0;
  const nextSelections = {};
  const used = new Set();
  for (const g of GARMENT_IDS) {
    nextSelections[g] = {};
    for (const part of GARMENTS[g].parts) {
      const id = selections[g]?.[part.id];
      if (id == null) continue;
      const product = productsById.get(String(id));
      if (product && isCompatible(g, part, product)) {
        nextSelections[g][part.id] = String(id);
        used.add(String(id));
      } else {
        removed += 1;
      }
    }
  }
  const nextOverrides = Object.fromEntries(Object.entries(overrides).filter(([id]) => used.has(id)));
  return { selections: nextSelections, overrides: nextOverrides, removed };
}

export function loadState() {
  try {
    return sanitizeState(JSON.parse(window.localStorage.getItem(KEY)));
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* tryb prywatny / brak miejsca — konstruktor działa dalej, tylko bez pamięci */
  }
}
