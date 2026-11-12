import { FabricDefs, GarmentFigure, Mirror } from './GarmentBits.jsx';
import { isLace, useGarmentParts } from './useGarmentParts.js';

const LABELS = {
  front: 'Panel przedni',
  back: 'Panel tylny',
  gusset: 'Klin (krok)',
  waist: 'Gumka w pasie',
  legs: 'Wykończenie nogawek',
};

// Widok z przodu, majtki leżą płasko; tył wystaje przy nogawkach i nad linią pasa
const FRONT = 'M 95 72 Q 300 142 505 72 L 495 152 C 430 190, 370 290, 345 372 L 255 372 C 230 290, 170 190, 105 152 Z';
const BACK = 'M 95 72 L 505 72 L 497 160 C 488 260, 415 350, 352 388 Q 300 400 248 388 C 185 350, 112 260, 103 160 Z';
const GUSSET = 'M 230 309 Q 300 294 370 309 L 345 372 Q 300 384 255 372 Z';
const WAIST_FRONT = 'M 95 72 Q 300 142 505 72';
const WAIST_BACK = 'M 95 72 L 505 72';
// lewa nogawka (prawa = odbicie lustrzane)
const LEG_FRONT = 'M 105 152 C 170 190, 230 290, 255 372';
const LEG_BACK = 'M 103 160 C 112 260, 185 350, 248 388';

export default function PantiesSvg({ activePart, setActivePart, selections }) {
  const { isOn, fill, outline, outlineW, dash, partProps, caption } = useGarmentParts({
    activePart,
    setActivePart,
    selections,
    labels: LABELS,
  });

  return (
    <GarmentFigure viewBox="0 0 600 440" label="Majtki — kliknij część, aby dobrać materiał" caption={caption}>
      <FabricDefs prefix="pan" />

      {/* 1. TYŁ (widoczny od środka: nad pasem i przy nogawkach) */}
      <g {...partProps('back')}>
        <path d={BACK} fill={fill('back')} stroke={outline('back')} strokeWidth={outlineW('back')} strokeDasharray={dash('back')} />
        {isLace(selections.back) && <path d={BACK} fill="url(#pan-lace)" pointerEvents="none" />}
        <path d={BACK} fill="rgba(0,0,0,0.14)" pointerEvents="none" />
      </g>

      {/* 2. PRZÓD */}
      <g {...partProps('front')}>
        <path d={FRONT} fill={fill('front')} stroke={outline('front')} strokeWidth={outlineW('front', 1.6)} strokeDasharray={dash('front')} />
        {isLace(selections.front) && <path d={FRONT} fill="url(#pan-lace)" pointerEvents="none" />}
        <path d={FRONT} fill="url(#pan-volume)" pointerEvents="none" />
        {/* szwy boczne */}
        <Mirror>
          <path d="M 100 76 L 109 150" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.9" strokeDasharray="3 3" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 3. KLIN */}
      <g {...partProps('gusset')}>
        <path d={GUSSET} fill={fill('gusset')} stroke={outline('gusset')} strokeWidth={outlineW('gusset')} strokeDasharray={dash('gusset')} />
        <path d="M 236 314 Q 300 300 364 314" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.9" strokeDasharray="3 3" pointerEvents="none" />
      </g>

      {/* 4. WYKOŃCZENIE NOGAWEK */}
      <g {...partProps('legs')}>
        <Mirror>
          <path d={LEG_FRONT} fill="none" stroke="transparent" strokeWidth="16" />
          <path d={LEG_BACK} fill="none" stroke={outline('legs')} strokeWidth={isOn('legs') ? 7.5 : 6} strokeLinecap="round" />
          <path d={LEG_BACK} fill="none" stroke={fill('legs')} strokeWidth="4" strokeLinecap="round" />
          <path d={LEG_FRONT} fill="none" stroke={outline('legs')} strokeWidth={isOn('legs') ? 9.5 : 8} strokeLinecap="round" />
          <path d={LEG_FRONT} fill="none" stroke={fill('legs')} strokeWidth="6" strokeLinecap="round" />
          <path d={LEG_FRONT} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 5. GUMKA W PASIE (z pikotką) */}
      <g {...partProps('waist')}>
        <path d={WAIST_BACK} fill="none" stroke={outline('waist')} strokeWidth={isOn('waist') ? 8 : 6.5} strokeLinecap="round" />
        <path d={WAIST_BACK} fill="none" stroke={fill('waist')} strokeWidth="4.5" strokeLinecap="round" />
        <path d={WAIST_FRONT} fill="none" stroke={outline('waist')} strokeWidth={isOn('waist') ? 11 : 9.5} strokeLinecap="round" strokeDasharray="0.1 9" transform="translate(0 -5)" />
        <path d={WAIST_FRONT} fill="none" stroke={fill('waist')} strokeWidth="7.5" strokeLinecap="round" strokeDasharray="0.1 9" transform="translate(0 -5)" />
        <path d={WAIST_FRONT} fill="none" stroke={outline('waist')} strokeWidth={isOn('waist') ? 13 : 11.5} strokeLinecap="round" />
        <path d={WAIST_FRONT} fill="none" stroke={fill('waist')} strokeWidth="9.5" strokeLinecap="round" />
        <path d={WAIST_FRONT} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />
        {/* kokardka */}
        <g pointerEvents="none" stroke={outline('waist')} strokeWidth="1" fill={fill('waist')}>
          <path d="M 300 108 L 282 98 L 284 118 Z M 300 108 L 318 98 L 316 118 Z" />
          <circle cx="300" cy="108" r="4" />
        </g>
      </g>
    </GarmentFigure>
  );
}
