// Pomocnicze funkcje dla danych w kształcie sets-creator (props strony Customer/Goals/Show).

// Laravel serializuje pusty wybór jako [] — sprowadzamy do obiektu { [slotId]: { productId, quantity } }
export function normalizeSelection(selection) {
  if (!selection || Array.isArray(selection)) return {};
  const out = {};
  for (const [slotId, value] of Object.entries(selection)) {
    if (value && value.productId != null) {
      out[slotId] = { productId: Number(value.productId), quantity: Number(value.quantity) || 1 };
    }
  }
  return out;
}

export function selectedProduct(slot, selection) {
  const sel = selection[slot.id];
  return sel ? slot.products.find((p) => p.id === sel.productId) ?? null : null;
}

// { [partId]: { slot, product } } — z nowych pól goal.visual / slot.visualParts
export function buildParts(goal, selection) {
  const parts = {};
  for (const slot of goal.slots) {
    for (const partId of slot.visualParts ?? []) {
      parts[partId] = { slot: { id: slot.id, name: slot.name }, product: selectedProduct(slot, selection) };
    }
  }
  return parts;
}

// Pozycje zestawu liczone po stronie klienta (do wyświetlenia); kwotę "razem" podaje serwer w summary.total
export function buildLines(goal, selection) {
  return goal.slots
    .map((slot) => {
      const product = selectedProduct(slot, selection);
      if (!product) return null;
      const quantity = selection[slot.id].quantity;
      return { slot, product, quantity, lineTotal: Number(product.price) * quantity };
    })
    .filter(Boolean);
}

const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
export const formatPrice = (value) => money.format(Number(value));
