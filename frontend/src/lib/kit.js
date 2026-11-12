// Czysta logika zestawu: zgodność materiałów, normy zużycia, lista zakupów.
import { GARMENTS } from '../config/garments.js';

export function getPart(garmentId, partId) {
  return GARMENTS[garmentId]?.parts.find((p) => p.id === partId);
}

// Czy materiał wolno przypisać do części.
// Jawna lista product.parts (np. ["bra.cups"]) z API ma pierwszeństwo przed regułą kategoria/typ.
export function isCompatible(garmentId, part, product) {
  if (!part || !product) return false;
  if (Array.isArray(product.parts) && product.parts.length > 0) {
    return product.parts.includes(`${garmentId}.${part.id}`);
  }
  if (product.category !== part.accepts.category) return false;
  const { types } = part.accepts;
  if (!types || !product.type) return true;
  return types.includes(product.type);
}

export function productsForPart(garmentId, part, products) {
  return products.filter((p) => isCompatible(garmentId, part, p));
}

export function partQty(part, size) {
  return part.qty[size] ?? part.qty.M;
}

// Minimalny krok sprzedaży: metry co 0,1; sztuki / komplety / pary co 1
export function stepFor(product) {
  if (product.step > 0) return product.step;
  return product.unit === 'm' ? 0.1 : 1;
}

const round2 = (n) => Math.round(n * 100) / 100;

export function ceilToStep(qty, step) {
  return round2(Math.ceil(round2(qty / step)) * step);
}

export function matchesPalette(product, key) {
  if (Array.isArray(product.palettes)) return product.palettes.includes(key);
  return String(product.id).includes(key);
}

// Materiał dla części w danej palecie. Kolejność accepts.types = preferencja (np. dół koszulki: najpierw satyna).
export function pickForPalette(garmentId, part, products, key) {
  const types = part.accepts.types ?? [];
  const rank = (p) => {
    const i = types.indexOf(p.type);
    return i === -1 ? types.length : i;
  };
  return (
    productsForPart(garmentId, part, products)
      .filter((p) => p.inStock !== false && matchesPalette(p, key))
      .sort((x, y) => rank(x) - rank(y))[0] ?? null
  );
}

/**
 * Buduje listę zakupów ze wszystkich wyrobów.
 * selections: { bra: { cups: productId, ... }, ... }
 * sizes:      { bra: 'M', ... }
 * overrides:  { [productId]: ręcznie ustawiona ilość }
 */
export function buildKit(selections, sizes, productsById, overrides = {}) {
  const lines = new Map();
  for (const [garmentId, garment] of Object.entries(GARMENTS)) {
    for (const part of garment.parts) {
      const productId = selections[garmentId]?.[part.id];
      const product = productId != null ? productsById.get(String(productId)) : null;
      if (!product) continue;
      const key = String(product.id);
      if (!lines.has(key)) lines.set(key, { product, uses: [], raw: 0 });
      const line = lines.get(key);
      const qty = partQty(part, sizes[garmentId]);
      line.uses.push({ garmentId, partId: part.id, label: part.label, garmentLabel: garment.label, qty });
      line.raw += qty;
    }
  }
  return [...lines.values()].map((line) => {
    const step = stepFor(line.product);
    const needed = ceilToStep(line.raw, step);
    const override = overrides[String(line.product.id)];
    const quantity = override > 0 ? override : needed;
    return { ...line, step, needed, quantity, total: round2(quantity * line.product.price) };
  });
}

export function kitTotal(lines) {
  return round2(lines.reduce((sum, l) => sum + l.total, 0));
}

export function garmentProgress(garmentId, selections, productsById) {
  const parts = GARMENTS[garmentId].parts;
  const done = parts.filter((p) => productsById.has(String(selections[garmentId]?.[p.id]))).length;
  return { done, total: parts.length };
}
