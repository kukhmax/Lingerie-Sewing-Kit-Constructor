import { useState } from 'react';

// Podpisy części pokazywane po najechaniu / dla czytników ekranu
const PART_LABELS = {
  cups: 'Miseczki',
  gore: 'Mostek',
  wings: 'Obwód biustonosza',
  straps: 'Ramiączka',
  elastics: 'Gumki wykończeniowe',
  underwires: 'Tunele na fiszbiny',
  hardware: 'Regulatory i kółka',
  closure: 'Zapięcie tyłu',
};

const EMPTY_FILL = '#fbf8f4';
const OUTLINE = '#b5a595';

// Geometria lewej połowy (prawa jest lustrzanym odbiciem względem x = 300)
const CUP = 'M 120 222 L 166 205 C 185 250, 235 285, 286 300 C 288 350, 262 418, 195 428 C 130 432, 92 370, 86 300 C 95 270, 108 245, 120 222 Z';
const CUP_SEAM = 'M 88 322 C 150 296, 230 302, 286 320';
const CUP_DART = 'M 190 306 C 194 350, 196 390, 195 428';
const WIRE = 'M 286 302 C 288 350, 262 418, 195 428 C 130 432, 92 370, 86 302';
const STRAP = 'M 95 8 L 133 8 L 166 205 L 120 222 Z';
const SIDE_WING = 'M 104 258 C 72 266, 46 284, 34 310 L 30 396 C 62 418, 112 434, 195 436 L 195 300 Z';
const NECKLINE = 'M 166 205 C 185 250, 235 285, 286 300';
const ARMHOLE = 'M 120 222 C 108 245, 95 270, 86 300 M 104 258 C 72 266, 46 284, 34 310';
const BOTTOM_EDGE = 'M 30 397 C 62 419, 112 435, 195 437 C 240 438, 275 428, 300 422';

// Rysuje dzieci dwa razy: oryginał + lustrzane odbicie
function Mirror({ children }) {
  return (
    <>
      {children}
      <g transform="translate(600 0) scale(-1 1)">{children}</g>
    </>
  );
}

export default function BraSvg({ activePart, setActivePart, selections }) {
  const [hovered, setHovered] = useState(null);

  const fill = (partId) => selections[partId]?.colorHex || EMPTY_FILL;
  const isOn = (partId) => activePart === partId || hovered === partId;
  const outline = (partId) => (isOn(partId) ? 'var(--color-primary)' : OUTLINE);
  const outlineW = (partId, base = 1.4) => (isOn(partId) ? 3 : base);
  // Niewybrana część = sam kontur (linia przerywana), wybrana = pełny kolor
  const dash = (partId) => (selections[partId] || isOn(partId) ? undefined : '5 4');

  const partProps = (partId) => ({
    id: partId,
    className: `interactive-part ${activePart === partId ? 'active' : ''}`,
    role: 'button',
    tabIndex: 0,
    'aria-label': PART_LABELS[partId],
    'aria-pressed': activePart === partId,
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

  const label = hovered || activePart;

  return (
    <svg
      viewBox="0 0 600 520"
      className="svg-garment svg-garment-bra"
      xmlns="http://www.w3.org/2000/svg"
      role="group"
      aria-label="Biustonosz — kliknij część, aby dobrać materiał"
    >
      <defs>
        <pattern id="bra-lace" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 0 11 Q 5.5 4 11 11 T 22 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
          <path d="M 0 0 Q 5.5 7 11 0 T 22 0" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
          <circle cx="5.5" cy="16" r="1.3" fill="rgba(255,255,255,0.35)" />
          <circle cx="16.5" cy="5" r="1.3" fill="rgba(0,0,0,0.1)" />
        </pattern>
        {/* Cieniowanie nadające objętość miseczce */}
        <radialGradient id="bra-cup-volume" cx="0.55" cy="0.5" r="0.65">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <linearGradient id="bra-flat-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* 1. OBWÓD: tylna taśma (widoczna od środka) + boczne skrzydełka */}
      <g {...partProps('wings')}>
        <path
          d="M 185 428 C 235 478, 365 478, 415 428 L 415 452 C 365 504, 235 504, 185 452 Z"
          fill={fill('wings')} stroke={outline('wings')} strokeWidth={outlineW('wings')} strokeDasharray={dash('wings')}
        />
        <path d="M 185 428 C 235 478, 365 478, 415 428 L 415 452 C 365 504, 235 504, 185 452 Z" fill="rgba(0,0,0,0.16)" pointerEvents="none" />
        <Mirror>
          <path d={SIDE_WING} fill={fill('wings')} stroke={outline('wings')} strokeWidth={outlineW('wings')} strokeDasharray={dash('wings')} />
          <path d={SIDE_WING} fill="url(#bra-flat-shade)" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 2. ZAPIĘCIE: haftki na środku tylnej taśmy */}
      <g {...partProps('closure')}>
        <rect x="278" y="462" width="44" height="30" rx="3"
          fill={fill('closure')} stroke={outline('closure')} strokeWidth={outlineW('closure')} strokeDasharray={dash('closure')} />
        <path d="M 300 464 L 300 490" stroke="rgba(0,0,0,0.25)" strokeWidth="1" pointerEvents="none" />
        {[470, 484].map((y) => (
          <g key={y} pointerEvents="none">
            <circle cx="289" cy={y} r="2.2" fill="none" stroke="#6b7280" strokeWidth="1.2" />
            <path d={`M 307 ${y} h 7`} stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* 3. RAMIĄCZKA */}
      <g {...partProps('straps')}>
        <Mirror>
          <path d={STRAP} fill={fill('straps')} stroke={outline('straps')} strokeWidth={outlineW('straps')} strokeDasharray={dash('straps')} strokeLinejoin="round" />
          <path d={STRAP} fill="url(#bra-flat-shade)" pointerEvents="none" />
          {/* przeszycia wzdłuż krawędzi */}
          <path d="M 101 10 L 126 216 M 127 10 L 160 204" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 4. MOSTEK */}
      <g {...partProps('gore')}>
        <path d="M 284 298 L 316 298 L 352 424 L 248 424 Z"
          fill={fill('gore')} stroke={outline('gore')} strokeWidth={outlineW('gore')} strokeDasharray={dash('gore')} strokeLinejoin="round" />
      </g>

      {/* 5. MISECZKI (z cięciem poziomym i zaszewką, jak w szytym biustonoszu) */}
      <g {...partProps('cups')}>
        <Mirror>
          <path d={CUP} fill={fill('cups')} stroke={outline('cups')} strokeWidth={outlineW('cups', 1.6)} strokeDasharray={dash('cups')} strokeLinejoin="round" />
          {selections.cups && <path d={CUP} fill="url(#bra-lace)" pointerEvents="none" />}
          <path d={CUP} fill="url(#bra-cup-volume)" pointerEvents="none" />
          <path d={CUP_SEAM} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1.2" pointerEvents="none" />
          <path d={CUP_SEAM} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="4 3" transform="translate(0 4)" pointerEvents="none" />
          <path d={CUP_DART} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 6. FISZBINY I TUNELE: łuk pod miseczką */}
      <g {...partProps('underwires')}>
        <Mirror>
          <path d={WIRE} fill="none" stroke="transparent" strokeWidth="20" />
          <path d={WIRE} fill="none" stroke={outline('underwires')} strokeWidth={isOn('underwires') ? 13 : 10.5} strokeLinecap="round" />
          <path d={WIRE} fill="none" stroke={fill('underwires')} strokeWidth="8" strokeLinecap="round" />
          <path d={WIRE} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 7. GUMKI: koronkowy brzeg dekoltu, pacha, dolny pas */}
      <g {...partProps('elastics')}>
        <Mirror>
          <path d={`${NECKLINE} ${ARMHOLE} ${BOTTOM_EDGE}`} fill="none" stroke="transparent" strokeWidth="18" />
          <path d={BOTTOM_EDGE} fill="none" stroke={outline('elastics')} strokeWidth={isOn('elastics') ? 10 : 8} strokeLinecap="round" />
          <path d={BOTTOM_EDGE} fill="none" stroke={fill('elastics')} strokeWidth="6" strokeLinecap="round" />
          <path d={ARMHOLE} fill="none" stroke={outline('elastics')} strokeWidth={isOn('elastics') ? 7 : 5.5} strokeLinecap="round" />
          <path d={ARMHOLE} fill="none" stroke={fill('elastics')} strokeWidth="3.5" strokeLinecap="round" />
          {/* pikotka: rząd ząbków wzdłuż dekoltu */}
          <path d={NECKLINE} fill="none" stroke={outline('elastics')} strokeWidth={isOn('elastics') ? 11 : 9.5} strokeLinecap="round" strokeDasharray="0.1 9" transform="translate(4 -4)" />
          <path d={NECKLINE} fill="none" stroke={fill('elastics')} strokeWidth="7.5" strokeLinecap="round" strokeDasharray="0.1 9" transform="translate(4 -4)" />
          <path d={NECKLINE} fill="none" stroke={outline('elastics')} strokeWidth="5.5" strokeLinecap="round" />
          <path d={NECKLINE} fill="none" stroke={fill('elastics')} strokeWidth="3.5" strokeLinecap="round" />
        </Mirror>
      </g>

      {/* 8. REGULATORY I KÓŁKA */}
      <g {...partProps('hardware')}>
        <Mirror>
          {/* powiększony obszar klikalny */}
          <rect x="88" y="52" width="72" height="46" fill="transparent" stroke="none" />
          <circle cx="143" cy="210" r="16" fill="transparent" stroke="none" />
          {/* regulator */}
          <g transform="rotate(-9 124 75)">
            <rect x="98" y="66" width="52" height="18" rx="5" fill="none"
              stroke={outline('hardware')} strokeWidth={isOn('hardware') ? 8 : 6.5} />
            <rect x="98" y="66" width="52" height="18" rx="5" fill="none"
              stroke={selections.hardware?.colorHex || '#c9c4bd'} strokeWidth="4" />
            <path d="M 100 75 H 148" stroke={selections.hardware?.colorHex || '#c9c4bd'} strokeWidth="3" />
          </g>
          {/* kółko łączące ramiączko z miseczką */}
          <ellipse cx="143" cy="211" rx="21" ry="6.5" fill="none" transform="rotate(-20 143 211)"
            stroke={outline('hardware')} strokeWidth={isOn('hardware') ? 7 : 5.5} />
          <ellipse cx="143" cy="211" rx="21" ry="6.5" fill="none" transform="rotate(-20 143 211)"
            stroke={selections.hardware?.colorHex || '#c9c4bd'} strokeWidth="3.2" />
        </Mirror>
      </g>

      {/* Podpis części pod kursorem / aktywnej */}
      {label && (
        <text x="300" y="150" textAnchor="middle" className="svg-part-label" pointerEvents="none">
          {PART_LABELS[label]}
          {selections[label] ? ` · ${selections[label].colorName}` : ''}
        </text>
      )}
    </svg>
  );
}
