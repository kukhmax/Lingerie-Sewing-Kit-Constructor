import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GARMENTS, PALETTES, SIZES } from '../src/config/garments.js';
import { buildKit, ceilToStep, getPart, isCompatible, kitTotal, matchesPalette, pickForPalette, productsForPart } from '../src/lib/kit.js';
import { normalizeProduct } from '../src/api.js';

const catalog = JSON.parse(readFileSync(new URL('../public/materials.json', import.meta.url), 'utf8'))
  .map(normalizeProduct)
  .filter(Boolean);
const byId = new Map(catalog.map((p) => [p.id, p]));

test('katalog demo: wszystkie rekordy przechodzą normalizację, id są unikalne', () => {
  const raw = JSON.parse(readFileSync(new URL('../public/materials.json', import.meta.url), 'utf8'));
  assert.equal(catalog.length, raw.length);
  assert.equal(byId.size, catalog.length);
});

test('każda część każdego wyrobu ma co najmniej jeden zgodny materiał', () => {
  for (const [gid, g] of Object.entries(GARMENTS)) {
    for (const part of g.parts) {
      assert.ok(productsForPart(gid, part, catalog).length > 0, `${gid}.${part.id}`);
      for (const s of SIZES) assert.ok(part.qty[s] > 0, `${gid}.${part.id} qty ${s}`);
    }
  }
});

test('każda paleta pokrywa wszystkie części wszystkich wyrobów', () => {
  for (const palette of PALETTES) {
    for (const [gid, g] of Object.entries(GARMENTS)) {
      for (const part of g.parts) {
        const ok = productsForPart(gid, part, catalog).some((p) => matchesPalette(p, palette.key));
        assert.ok(ok, `${palette.key} → ${gid}.${part.id}`);
      }
    }
  }
});

test('zgodność: okucia nie pasują do miseczek, taśma ramiączkowa nie jest gumką wykończeniową', () => {
  const cups = getPart('bra', 'cups');
  assert.equal(isCompatible('bra', cups, byId.get('hard-gold-15')), false);
  assert.equal(isCompatible('bra', cups, byId.get('fab-lace-wine')), true);
  assert.equal(isCompatible('bra', getPart('bra', 'elastics'), byId.get('elas-strap-wine')), false);
  assert.equal(isCompatible('bra', getPart('bra', 'gore'), byId.get('fab-lace-wine')), false);
});

test('jawna lista parts z API ma pierwszeństwo przed regułą kategoria/typ', () => {
  const p = { ...byId.get('fab-lace-wine'), parts: ['panties.front'] };
  assert.equal(isCompatible('bra', getPart('bra', 'cups'), p), false);
  assert.equal(isCompatible('panties', getPart('panties', 'front'), p), true);
});

test('ceilToStep zaokrągla w górę do kroku sprzedaży bez błędów zmiennoprzecinkowych', () => {
  assert.equal(ceilToStep(0.3 + 0.3 + 0.1, 0.1), 0.7);
  assert.equal(ceilToStep(0.41, 0.1), 0.5);
  assert.equal(ceilToStep(1, 1), 1);
  assert.equal(ceilToStep(0.55, 0.5), 1);
});

test('buildKit: ten sam materiał w kilku częściach to jedna pozycja z sumą norm', () => {
  const selections = { bra: { gore: 'fab-mesh-nude', wings: 'fab-mesh-nude' }, panties: { gusset: 'fab-mesh-nude' }, nightgown: {} };
  const sizes = { bra: 'M', panties: 'M', nightgown: 'M' };
  const lines = buildKit(selections, sizes, byId);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].uses.length, 3);
  assert.equal(lines[0].needed, 0.5); // 0.1 + 0.3 + 0.1
  assert.equal(lines[0].total, 12.5);
  assert.equal(kitTotal(lines), 12.5);
});

test('buildKit: rozmiar zmienia normę, ręczna ilość ją nadpisuje, nieznane id jest pomijane', () => {
  const sel = { bra: { cups: 'fab-lace-wine', straps: 'nie-ma-takiego' }, panties: {}, nightgown: {} };
  const m = buildKit(sel, { bra: 'M' }, byId);
  const xl = buildKit(sel, { bra: 'XL' }, byId);
  assert.equal(m.length, 1);
  assert.equal(m[0].quantity, 0.5);
  assert.equal(xl[0].quantity, 0.7);
  const manual = buildKit(sel, { bra: 'M' }, byId, { 'fab-lace-wine': 1.5 });
  assert.equal(manual[0].quantity, 1.5);
  assert.equal(manual[0].needed, 0.5);
  assert.equal(manual[0].total, 63);
});

test('normalizeProduct: kształt z Laravel (id liczbowe, cena jako string) i odrzucanie śmieci', () => {
  const p = normalizeProduct({ id: 17, name: 'Koronka', category: 'fabric', price: '38.00', unit: 'm', colorHex: 'javascript:alert(1)' });
  assert.equal(p.id, '17');
  assert.equal(p.price, 38);
  assert.equal(p.colorHex, '#d1d5db');
  assert.equal(p.inStock, true);
  assert.equal(normalizeProduct({ id: 1, name: 'x', category: 'fabric', price: 'abc' }), null);
  assert.equal(normalizeProduct({ name: 'bez id', category: 'fabric', price: 1 }), null);
});

test('pickForPalette wybiera typ preferowany dla części (dół koszulki → satyna, miseczki → koronka)', () => {
  assert.equal(pickForPalette('nightgown', getPart('nightgown', 'skirt'), catalog, 'wine').id, 'fab-satin-wine');
  assert.equal(pickForPalette('bra', getPart('bra', 'cups'), catalog, 'wine').id, 'fab-lace-wine');
  assert.equal(pickForPalette('bra', getPart('bra', 'cups'), catalog, 'brak-takiej'), null);
});

test('sanitizeState: uszkodzone dane z localStorage dają poprawny stan', async () => {
  const { sanitizeState, pruneState } = await import('../src/lib/storage.js');
  const s = sanitizeState({
    activeGarment: 'kapelusz',
    sizes: { bra: 'XXL', panties: 'L' },
    selections: { bra: { cups: 17, nieznana: 'x', gore: { zly: 1 } }, panties: 'zle' },
    overrides: { a: -1, b: 'dużo', c: 1.5 },
  });
  assert.equal(s.activeGarment, 'bra');
  assert.deepEqual(s.sizes, { bra: 'M', panties: 'L', nightgown: 'M' });
  assert.deepEqual(s.selections, { bra: { cups: '17' }, panties: {}, nightgown: {} });
  assert.deepEqual(s.overrides, { c: 1.5 });
  assert.deepEqual(sanitizeState(null).selections, { bra: {}, panties: {}, nightgown: {} });

  // materiał usunięty ze sklepu oraz materiał niezgodny z częścią znikają z zestawu
  const sel = { bra: { cups: 'fab-lace-wine', gore: 'hard-gold-15', straps: 'usuniety' }, panties: {}, nightgown: {} };
  const pruned = pruneState(sel, { 'fab-lace-wine': 1, usuniety: 2 }, byId, isCompatible);
  assert.equal(pruned.removed, 2);
  assert.deepEqual(pruned.selections.bra, { cups: 'fab-lace-wine' });
  assert.deepEqual(pruned.overrides, { 'fab-lace-wine': 1 });
});
