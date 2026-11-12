// Klient makiety. W sets-creator te wywołania zastąpi router Inertia (patrz INTEGRATION.md).
export class ApiError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.errors = errors;
  }
}

async function call(method, path, body) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Brak połączenia z serwerem.', { network: ['Brak połączenia z serwerem.'] });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message ?? `HTTP ${res.status}`, data.errors ?? { server: [data.message ?? 'Błąd serwera.'] });
  return data;
}

export const listGoals = () => call('GET', '/goals');
export const showGoal = (id) => call('GET', `/goals/${id}`);
export const setSlot = (goalId, slotId, productId, quantity) =>
  call('PATCH', `/goals/${goalId}/slots/${slotId}`, { product_id: productId, quantity });
export const clearSlot = (goalId, slotId) => call('DELETE', `/goals/${goalId}/slots/${slotId}`);
export const sendToCart = (goalId, { replaceCart, confirmIncomplete }) =>
  call('POST', `/goals/${goalId}/cart`, { replace_cart: replaceCart, ...(confirmIncomplete ? { confirm_incomplete: true } : {}) });
