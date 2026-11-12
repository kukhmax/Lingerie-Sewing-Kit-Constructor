import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSummary, buildVerdict, goalCard, pageState, validateSelection } from '../mock-server/state.mjs';
import { buildLines, buildParts, normalizeSelection } from '../src/visual/contract.js';

const { goals, limits } = JSON.parse(readFileSync(new URL('../mock-server/data/goals.json', import.meta.url), 'utf8'));
const majtki = goals.find((g) => g.id === 2);

const PART_IDS = {
  bra: ['cups', 'gore', 'wings', 'straps', 'elastics', 'underwires', 'hardware', 'closure'],
  panties: ['front', 'back', 'gusset', 'waist', 'legs'],
  nightgown: ['bodice', 'skirt', 'straps', 'underbust', 'trim'],
};

test('makieta odwzorowuje prawdziwy cel „majtki”: 3 sloty, 28 produktów, 2 wymagane', () => {
  assert.deepEqual(goalCard(majtki), { id: 2, name: 'majtki', requiredSlots: 2, optionalSlots: 1, availableProducts: 28, visual: 'panties' });
});

test('visualParts każdego slotu wskazują istniejące części rysunku, bez powtórzeń między slotami', () => {
  for (const goal of goals) {
    const seen = new Set();
    for (const slot of goal.slots) {
      for (const part of slot.visualParts) {
        assert.ok(PART_IDS[goal.visual].includes(part), `${goal.name}: ${part}`);
        assert.ok(!seen.has(part), `${goal.name}: ${part} w dwóch slotach`);
        seen.add(part);
      }
    }
  }
});

test('pusty stan ma ten sam kształt co prawdziwa strona (selection jako [])', () => {
  const state = pageState(majtki, { selection: {}, sentAt: null }, limits);
  assert.deepEqual(state.selection, []);
  assert.deepEqual(state.verdict, {
    complete: false,
    missingRequired: [{ id: 3, name: 'tkanina' }, { id: 5, name: 'nici' }],
    filledSlots: 0,
    requiredSlots: 2,
    totalSlots: 3,
  });
  assert.deepEqual(state.summary, { items: [], total: '0.00' });
  assert.deepEqual(state.limits, { minQuantity: 1, maxQuantity: 99 });
});

test('walidacja: produkt musi należeć do slotu, ilość całkowita w limitach', () => {
  assert.equal(validateSelection(majtki, 3, { product_id: 7, quantity: 2 }, limits).ok, true);
  assert.ok(validateSelection(majtki, 3, { product_id: 22, quantity: 1 }, limits).errors.product_id); // nici w slocie tkaniny
  assert.ok(validateSelection(majtki, 3, { product_id: 7, quantity: 0.5 }, limits).errors.quantity);
  assert.ok(validateSelection(majtki, 3, { product_id: 7, quantity: 100 }, limits).errors.quantity);
  assert.equal(validateSelection(majtki, 999, { product_id: 7, quantity: 1 }, limits).status, 404);
});

test('werdykt i suma po wyborze', () => {
  const selection = { 3: { productId: 7, quantity: 2 }, 5: { productId: 22, quantity: 1 } };
  assert.equal(buildVerdict(majtki, selection).complete, true);
  assert.equal(buildSummary(majtki, selection).total, '37.00');
});

test('klient: normalizeSelection, buildParts (jeden slot koloruje kilka części), buildLines', () => {
  assert.deepEqual(normalizeSelection([]), {});
  const selection = normalizeSelection({ 3: { productId: '7', quantity: 2 } });
  const parts = buildParts(majtki, selection);
  assert.deepEqual(Object.keys(parts).sort(), ['back', 'front', 'gusset']);
  assert.equal(parts.front.product.id, 7);
  assert.equal(parts.front.slot.id, 3);
  const lines = buildLines(majtki, selection);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].lineTotal, 28);
});
