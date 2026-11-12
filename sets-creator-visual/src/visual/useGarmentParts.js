import { computed, ref, useId } from 'vue';

export const EMPTY_FILL = '#fbf8f4'; // część do wyboru, jeszcze bez materiału
export const STATIC_FILL = '#f1ede7'; // część rysunku bez powiązanego slotu
export const OUTLINE = '#b5a595';
export const METAL = '#c9c4bd';
const ACTIVE = '#c9a236';

/**
 * Wspólne zachowanie klikalnych części rysunku.
 * props.parts: { [partId]: { slot: { id, name }, product: { id, name, imageUrl } | null } }
 * Część, której nie ma w props.parts, jest rysowana neutralnie i nie reaguje na kliknięcia.
 */
export function useGarmentParts(props, emit, labels) {
  const hovered = ref(null);
  const uid = `sgv${useId().replace(/[^a-z0-9]/gi, '')}`;

  const entry = (partId) => props.parts[partId] ?? null;
  const product = (partId) => entry(partId)?.product ?? null;

  // Zdjęcia wybranych produktów jako tekstury SVG: [{ id, imageUrl }]
  const textures = computed(() => {
    const seen = new Map();
    for (const e of Object.values(props.parts)) {
      if (e.product?.imageUrl) seen.set(e.product.id, { id: e.product.id, imageUrl: e.product.imageUrl });
    }
    return [...seen.values()];
  });

  // Podświetlamy wszystkie części tego samego slotu naraz (np. "tkanina" = przód + tył + klin)
  const slotOf = (partId) => entry(partId)?.slot.id ?? null;
  const isOn = (partId) => {
    const slotId = slotOf(partId);
    return slotId !== null && (slotId === props.activeSlotId || slotId === slotOf(hovered.value));
  };

  // Wypełnienie: zdjęcie produktu, a gdy nic nie wybrano — kolor neutralny
  const fill = (partId, empty = EMPTY_FILL) => {
    const p = product(partId);
    if (p) return p.imageUrl ? `url(#${uid}-tex-${p.id})` : '#d9cfc2';
    return entry(partId) ? empty : empty === EMPTY_FILL ? STATIC_FILL : empty;
  };
  const outline = (partId) => (isOn(partId) ? ACTIVE : OUTLINE);
  const outlineW = (partId, base = 1.4) => (isOn(partId) ? 3 : base);
  const dash = (partId) => (!entry(partId) || product(partId) || isOn(partId) ? undefined : '5 4');

  const partProps = (partId) => {
    const e = entry(partId);
    if (!e) return { class: 'sgv-part sgv-part--static', 'aria-hidden': 'true' };
    const pick = () => emit('select', e.slot.id);
    return {
      class: ['sgv-part', { 'is-active': props.activeSlotId === e.slot.id }],
      role: 'button',
      tabindex: 0,
      'aria-haspopup': 'dialog',
      'aria-label': `${labels[partId]} (${e.slot.name})${e.product ? `: ${e.product.name}` : ' — wybierz produkt'}`,
      onClick: pick,
      onKeydown: (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          pick();
        }
      },
      onMouseenter: () => (hovered.value = partId),
      onMouseleave: () => (hovered.value = null),
      onFocus: () => (hovered.value = partId),
      onBlur: () => (hovered.value = null),
    };
  };

  const caption = computed(() => {
    const id = hovered.value ?? Object.keys(props.parts).find((k) => props.parts[k].slot.id === props.activeSlotId);
    const e = id ? entry(id) : null;
    if (!e) return 'Najedź na część lub kliknij ją, aby dobrać produkt';
    return `${labels[id]} · ${e.slot.name}${e.product ? ` · ${e.product.name}` : ' · kliknij, aby wybrać'}`;
  });

  return { uid, textures, isOn, fill, outline, outlineW, dash, partProps, caption };
}
