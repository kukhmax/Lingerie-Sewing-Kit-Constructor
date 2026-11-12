import { useState } from 'react';

export const EMPTY_FILL = '#fbf8f4';
export const OUTLINE = '#b5a595';
export const METAL = '#c9c4bd';

// Czy na części narysować fakturę koronki
export const isLace = (product) => product?.type === 'lace';

// Wspólne zachowanie klikalnych części rysunku: kolor, kontur, podświetlenie, klawiatura
export function useGarmentParts({ activePart, setActivePart, selections, labels }) {
  const [hovered, setHovered] = useState(null);

  const isOn = (partId) => activePart === partId || hovered === partId;
  const fill = (partId, empty = EMPTY_FILL) => selections[partId]?.colorHex || empty;
  const outline = (partId) => (isOn(partId) ? 'var(--color-primary)' : OUTLINE);
  const outlineW = (partId, base = 1.4) => (isOn(partId) ? 3 : base);
  // Niewybrana część = sam kontur (linia przerywana), wybrana = pełny kolor
  const dash = (partId) => (selections[partId] || isOn(partId) ? undefined : '5 4');

  const partProps = (partId) => ({
    id: partId,
    className: `interactive-part ${activePart === partId ? 'active' : ''}`,
    role: 'button',
    tabIndex: 0,
    'aria-label': `${labels[partId]}${selections[partId] ? `: ${selections[partId].name}` : ' — wybierz materiał'}`,
    'aria-haspopup': 'dialog',
    onClick: () => setActivePart(partId),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActivePart(partId);
      }
    },
    onMouseEnter: () => setHovered(partId),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(partId),
    onBlur: () => setHovered(null),
  });

  const shown = hovered || activePart;
  const caption = shown && labels[shown]
    ? `${labels[shown]}${selections[shown] ? ` · ${selections[shown].colorName || selections[shown].name}` : ' · kliknij, aby wybrać'}`
    : 'Najedź na część lub kliknij ją, aby dobrać materiał';

  return { isOn, fill, outline, outlineW, dash, partProps, caption };
}
