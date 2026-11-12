// Warstwa komunikacji ze sklepem. Jedyny plik, który wykonuje zapytania sieciowe.

// Konfiguracja z atrybutów data-* elementu, w którym osadzono konstruktor.
export function readConfig(el) {
  const d = el?.dataset ?? {};
  return {
    // Bez data-materials-url ładowany jest katalog demonstracyjny dołączony do buildu
    materialsUrl: d.materialsUrl || `${import.meta.env.BASE_URL}materials.json`,
    // Bez data-cart-url konstruktor działa w trybie demo (nic nie jest wysyłane)
    cartUrl: d.cartUrl || null,
    cartPageUrl: d.cartPageUrl || null,
    csrfToken: d.csrfToken || document.querySelector('meta[name="csrf-token"]')?.content || null,
  };
}

// Sprowadza rekord z API do jednego kształtu (Laravel zwraca decimal jako string, id jako liczbę)
export function normalizeProduct(raw) {
  const price = Number(raw.price);
  const id = raw.id != null ? String(raw.id) : '';
  if (!id || !raw.name || !raw.category || !Number.isFinite(price)) return null;
  const hex = /^#[0-9a-f]{6}$/i.test(raw.colorHex ?? '') ? raw.colorHex : '#d1d5db';
  return {
    id,
    name: String(raw.name),
    category: String(raw.category),
    type: raw.type ? String(raw.type) : null,
    colorName: raw.colorName ? String(raw.colorName) : '',
    colorHex: hex,
    price,
    unit: raw.unit ? String(raw.unit) : 'szt',
    step: Number(raw.step) > 0 ? Number(raw.step) : null,
    description: raw.description ? String(raw.description) : '',
    image: typeof raw.image === 'string' && raw.image ? raw.image : null,
    url: typeof raw.url === 'string' && raw.url ? raw.url : null,
    inStock: raw.inStock !== false,
    parts: Array.isArray(raw.parts) ? raw.parts.map(String) : null,
    palettes: Array.isArray(raw.palettes) ? raw.palettes.map(String) : null,
  };
}

export async function loadMaterials(config) {
  const res = await fetch(config.materialsUrl, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.data;
  if (!Array.isArray(list)) throw new Error('Nieprawidłowy format katalogu');
  return list.map(normalizeProduct).filter(Boolean);
}

// Zwraca adres tylko wtedy, gdy prowadzi do tej samej domeny (ochrona przed open redirect)
export function sameOriginUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin ? parsed.href : null;
  } catch {
    return null;
  }
}

export class CartError extends Error {}

/**
 * Dodaje pozycje do koszyka sklepu.
 * items: [{ product_id, quantity }]
 * Zwraca { demo: true } gdy koszyk nie jest podłączony, inaczej { cartUrl }.
 */
export async function addToCart(config, items) {
  if (!config.cartUrl) return { demo: true };

  let res;
  try {
    res = await fetch(config.cartUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(config.csrfToken ? { 'X-CSRF-TOKEN': config.csrfToken } : {}),
      },
      body: JSON.stringify({ items }),
    });
  } catch {
    throw new CartError('Brak połączenia ze sklepem. Sprawdź internet i spróbuj ponownie.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* odpowiedź bez JSON */
  }

  if (!res.ok || !data?.success) {
    if (res.status === 419) throw new CartError('Sesja wygasła. Odśwież stronę i spróbuj ponownie.');
    if (res.status === 429) throw new CartError('Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.');
    if (res.status === 422 && data) {
      const first = data.errors ? Object.values(data.errors).flat()[0] : data.message;
      throw new CartError(first || 'Nie można dodać tych produktów do koszyka.');
    }
    throw new CartError('Nie udało się dodać do koszyka. Spróbuj ponownie za chwilę.');
  }

  return { demo: false, cartUrl: sameOriginUrl(data.cart_url) || sameOriginUrl(config.cartPageUrl) };
}
