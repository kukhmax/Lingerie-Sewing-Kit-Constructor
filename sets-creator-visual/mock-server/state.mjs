// Logika makiety sets-creator: wybór w slotach, werdykt kompletności, podsumowanie.
// Kształty odpowiedzi odwzorowują props strony Customer/Goals/Show z prawdziwej aplikacji.

export function findSlot(goal, slotId) {
  return goal.slots.find((s) => s.id === Number(slotId)) ?? null;
}

// Zwraca { ok: true, value } albo { ok: false, errors } w formacie błędów walidacji Laravel
export function validateSelection(goal, slotId, body, limits) {
  const slot = findSlot(goal, slotId);
  if (!slot) return { ok: false, status: 404, errors: { slot: ['Nie ma takiego elementu zestawu.'] } };

  const errors = {};
  const productId = body?.product_id;
  const quantity = body?.quantity;

  if (!Number.isInteger(productId)) errors.product_id = ['Pole product_id jest wymagane.'];
  else if (!slot.products.some((p) => p.id === productId)) errors.product_id = ['Ten produkt nie pasuje do wybranego elementu.'];

  if (!Number.isInteger(quantity)) errors.quantity = ['Ilość musi być liczbą całkowitą.'];
  else if (quantity < limits.minQuantity || quantity > limits.maxQuantity)
    errors.quantity = [`Ilość musi być między ${limits.minQuantity} a ${limits.maxQuantity}.`];

  if (Object.keys(errors).length) return { ok: false, status: 422, errors };
  return { ok: true, value: { productId, quantity } };
}

export function buildVerdict(goal, selection) {
  const filled = goal.slots.filter((s) => selection[s.id]);
  const required = goal.slots.filter((s) => s.required);
  const missingRequired = required.filter((s) => !selection[s.id]).map((s) => ({ id: s.id, name: s.name }));
  return {
    complete: missingRequired.length === 0,
    missingRequired,
    filledSlots: filled.length,
    requiredSlots: required.length,
    totalSlots: goal.slots.length,
  };
}

export function buildSummary(goal, selection) {
  let cents = 0;
  const items = [];
  for (const slot of goal.slots) {
    const sel = selection[slot.id];
    const product = sel && slot.products.find((p) => p.id === sel.productId);
    if (!product) continue;
    const line = Math.round(Number(product.price) * 100) * sel.quantity;
    cents += line;
    // UWAGA: kształt pozycji jest zgadywany — w prawdziwej aplikacji widziałem tylko pustą listę
    items.push({ slotId: slot.id, productId: product.id, name: product.name, quantity: sel.quantity, price: product.price, lineTotal: (line / 100).toFixed(2) });
  }
  return { items, total: (cents / 100).toFixed(2) };
}

export function pageState(goal, session, limits) {
  const selection = session.selection;
  return {
    selection: Object.keys(selection).length ? selection : [], // pusty wybór jako [] — tak jak PHP
    verdict: buildVerdict(goal, selection),
    summary: buildSummary(goal, selection),
    limits,
    sentAt: session.sentAt,
  };
}

export function goalCard(goal) {
  const ids = new Set(goal.slots.flatMap((s) => s.products.map((p) => p.id)));
  return {
    id: goal.id,
    name: goal.name,
    requiredSlots: goal.slots.filter((s) => s.required).length,
    optionalSlots: goal.slots.filter((s) => !s.required).length,
    availableProducts: ids.size,
    visual: goal.visual ?? null,
  };
}
