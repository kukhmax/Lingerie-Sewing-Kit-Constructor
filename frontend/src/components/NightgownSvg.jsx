import { FabricDefs, GarmentFigure, Mirror } from './GarmentBits.jsx';
import { METAL, isLace, useGarmentParts } from './useGarmentParts.js';

const LABELS = {
  bodice: 'Góra (stanik)',
  skirt: 'Dół koszulki',
  straps: 'Ramiączka',
  underbust: 'Gumka pod biustem',
  trim: 'Koronka na dole',
  hardware: 'Regulatory i kółka',
};

// lewa połowa (prawa = odbicie lustrzane względem x = 300)
const CUP = 'M 200 118 C 230 150, 275 190, 300 214 L 300 252 C 250 264, 190 260, 150 242 C 152 200, 170 150, 200 118 Z';
const STRAP = 'M 211 8 L 223 8 L 208 124 L 194 120 Z';
const UNDERBUST = 'M 150 242 C 190 260, 250 264, 300 252';
const NECK = 'M 200 118 C 230 150, 275 190, 300 214';
// całość
const SKIRT = 'M 150 242 C 190 260, 250 264, 300 252 C 350 264, 410 260, 450 242 C 470 380, 500 520, 530 640 Q 300 680 70 640 C 100 520, 130 380, 150 242 Z';
const TRIM = 'M 70 640 Q 300 680 530 640 L 537 674 Q 300 716 63 674 Z';
const HEM = 'M 63 674 Q 300 716 537 674';

export default function NightgownSvg({ activePart, setActivePart, selections }) {
  const { isOn, fill, outline, outlineW, dash, partProps, caption } = useGarmentParts({
    activePart,
    setActivePart,
    selections,
    labels: LABELS,
  });
  const metal = selections.hardware?.colorHex || METAL;

  return (
    <GarmentFigure viewBox="0 0 600 730" label="Koszulka nocna — kliknij część, aby dobrać materiał" caption={caption}>
      <FabricDefs prefix="ng" />

      {/* 1. RAMIĄCZKA */}
      <g {...partProps('straps')}>
        <Mirror>
          <path d="M 200 8 L 234 8 L 220 126 L 184 120 Z" fill="transparent" stroke="none" />
          <path d={STRAP} fill={fill('straps')} stroke={outline('straps')} strokeWidth={outlineW('straps')} strokeDasharray={dash('straps')} strokeLinejoin="round" />
        </Mirror>
      </g>

      {/* 2. DÓŁ KOSZULKI */}
      <g {...partProps('skirt')}>
        <path d={SKIRT} fill={fill('skirt')} stroke={outline('skirt')} strokeWidth={outlineW('skirt', 1.6)} strokeDasharray={dash('skirt')} strokeLinejoin="round" />
        {isLace(selections.skirt) && <path d={SKIRT} fill="url(#ng-lace)" pointerEvents="none" />}
        <path d={SKIRT} fill="url(#ng-folds)" pointerEvents="none" />
        <path d={SKIRT} fill="url(#ng-shade)" pointerEvents="none" />
        {/* fałdy */}
        <path
          d="M 215 262 C 205 400, 175 540, 150 652 M 270 262 C 268 400, 255 540, 245 664 M 330 262 C 332 400, 345 540, 355 664 M 385 262 C 395 400, 425 540, 450 652"
          fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="1.2" pointerEvents="none"
        />
      </g>

      {/* 3. KORONKA NA DOLE */}
      <g {...partProps('trim')}>
        <path d={TRIM} fill={fill('trim')} stroke={outline('trim')} strokeWidth={outlineW('trim')} strokeDasharray={dash('trim')} strokeLinejoin="round" />
        <path d={TRIM} fill="url(#ng-lace)" pointerEvents="none" />
        {/* ząbki koronki */}
        <path d={HEM} fill="none" stroke={outline('trim')} strokeWidth={isOn('trim') ? 15 : 13.5} strokeLinecap="round" strokeDasharray="0.1 13" />
        <path d={HEM} fill="none" stroke={fill('trim')} strokeWidth="11.5" strokeLinecap="round" strokeDasharray="0.1 13" />
      </g>

      {/* 4. GÓRA */}
      <g {...partProps('bodice')}>
        <Mirror>
          <path d={CUP} fill={fill('bodice')} stroke={outline('bodice')} strokeWidth={outlineW('bodice', 1.6)} strokeDasharray={dash('bodice')} strokeLinejoin="round" />
          {isLace(selections.bodice) && <path d={CUP} fill="url(#ng-lace)" pointerEvents="none" />}
          <path d={CUP} fill="url(#ng-volume)" pointerEvents="none" />
          {/* zaszewka */}
          <path d="M 228 256 C 226 225, 222 200, 216 180" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1" pointerEvents="none" />
          {/* ząbki wzdłuż dekoltu */}
          <path d={NECK} fill="none" stroke={outline('bodice')} strokeWidth="8" strokeLinecap="round" strokeDasharray="0.1 8.5" transform="translate(3 -3)" pointerEvents="none" />
          <path d={NECK} fill="none" stroke={fill('bodice')} strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 8.5" transform="translate(3 -3)" pointerEvents="none" />
        </Mirror>
      </g>

      {/* 5. REGULATORY I KÓŁKA na ramiączkach */}
      <g {...partProps('hardware')}>
        <Mirror>
          {/* powiększony obszar klikalny */}
          <rect x="192" y="40" width="42" height="32" fill="transparent" stroke="none" />
          <circle cx="201" cy="121" r="13" fill="transparent" stroke="none" />
          {/* regulator */}
          <g transform="rotate(-7 213 56)">
            <rect x="201" y="50" width="24" height="12" rx="3.5" fill="none" stroke={outline('hardware')} strokeWidth={isOn('hardware') ? 6.5 : 5} />
            <rect x="201" y="50" width="24" height="12" rx="3.5" fill="none" stroke={metal} strokeWidth="2.8" />
            <path d="M 202 56 H 224" stroke={metal} strokeWidth="2" />
          </g>
          {/* kółko łączące ramiączko ze stanikiem */}
          <ellipse cx="201" cy="121" rx="10" ry="4.2" fill="none" stroke={outline('hardware')} strokeWidth={isOn('hardware') ? 6 : 4.8} transform="rotate(-12 201 121)" />
          <ellipse cx="201" cy="121" rx="10" ry="4.2" fill="none" stroke={metal} strokeWidth="2.6" transform="rotate(-12 201 121)" />
        </Mirror>
      </g>

      {/* 6. GUMKA POD BIUSTEM */}
      <g {...partProps('underbust')}>
        <Mirror>
          <path d={UNDERBUST} fill="none" stroke="transparent" strokeWidth="22" />
          <path d={UNDERBUST} fill="none" stroke={outline('underbust')} strokeWidth={isOn('underbust') ? 12.5 : 11} strokeLinecap="round" />
          <path d={UNDERBUST} fill="none" stroke={fill('underbust')} strokeWidth="9" strokeLinecap="round" />
          <path d={UNDERBUST} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />
        </Mirror>
        {/* kokardka */}
        <g pointerEvents="none" stroke={outline('underbust')} strokeWidth="1" fill={fill('underbust')}>
          <path d="M 300 252 L 284 243 L 286 262 Z M 300 252 L 316 243 L 314 262 Z" />
          <circle cx="300" cy="252" r="3.6" />
        </g>
      </g>
    </GarmentFigure>
  );
}
