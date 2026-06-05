import React from 'react';

export default function NightgownSvg({ activePart, setActivePart, selections }) {
  const getPartFill = (partId, defaultColor = '#f3f4f6') => {
    const selectedItem = selections[partId];
    return selectedItem ? selectedItem.colorHex : defaultColor;
  };

  return (
    <svg 
      viewBox="0 0 400 250" 
      className="svg-garment" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))' }}
    >
      <defs>
        {/* Lace pattern overlay for bodice and trim */}
        <pattern id="lace-pattern-gown" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.0" />
          <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.15)" />
        </pattern>
      </defs>

      {/* 1. STRAPS / RAMIĄCZKA (Left & Right) */}
      <g 
        id="straps" 
        className={`interactive-part ${activePart === 'straps' ? 'active' : ''}`}
        onClick={() => setActivePart('straps')}
      >
        {/* Left Strap */}
        <path 
          d="M 160 60 L 160 15 C 160 15, 158 10, 154 10 C 150 10, 148 15, 148 15 L 148 65 L 152 65 L 152 20 L 156 20 L 156 60 Z" 
          fill={getPartFill('straps', '#d1d5db')} 
          stroke={activePart === 'straps' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'straps' ? '2.5' : '1'}
        />
        {/* Right Strap */}
        <path 
          d="M 240 60 L 240 15 C 240 15, 242 10, 246 10 C 250 10, 252 15, 252 15 L 252 65 L 248 65 L 248 20 L 244 20 L 244 60 Z" 
          fill={getPartFill('straps', '#d1d5db')} 
          stroke={activePart === 'straps' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'straps' ? '2.5' : '1'}
        />
      </g>

      {/* 2. SKIRT / DÓŁ KOSZULKI (Flowy gown body) */}
      <g 
        id="skirt" 
        className={`interactive-part ${activePart === 'skirt' ? 'active' : ''}`}
        onClick={() => setActivePart('skirt')}
      >
        <path 
          d="M 145 92 L 255 92 C 255 92, 275 160, 290 220 L 110 220 C 125 160, 145 92, 145 92 Z" 
          fill={getPartFill('skirt', '#f9fafb')} 
          stroke={activePart === 'skirt' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'skirt' ? '2.5' : '1.5'}
        />
      </g>

      {/* 3. BODICE / STANIK (Upper lace chest area) */}
      <g 
        id="bodice" 
        className={`interactive-part ${activePart === 'bodice' ? 'active' : ''}`}
        onClick={() => setActivePart('bodice')}
      >
        {/* Left cup area */}
        <path 
          d="M 145 90 C 145 90, 140 55, 170 55 C 190 55, 200 75, 200 90 L 145 90 Z" 
          fill={getPartFill('bodice', '#e5e7eb')} 
          stroke={activePart === 'bodice' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'bodice' ? '2.5' : '1.2'}
        />
        {/* Right cup area */}
        <path 
          d="M 255 90 C 255 90, 260 55, 230 55 C 210 55, 200 75, 200 90 L 255 90 Z" 
          fill={getPartFill('bodice', '#e5e7eb')} 
          stroke={activePart === 'bodice' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'bodice' ? '2.5' : '1.2'}
        />
        {/* Lace Overlay */}
        {selections.bodice && (
          <path 
            d="M 145 90 C 145 90, 140 55, 170 55 C 190 55, 200 75, 200 90 C 200 75, 210 55, 230 55 C 260 55, 255 90, 255 90 Z" 
            fill="url(#lace-pattern-gown)" 
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        )}
      </g>

      {/* 4. UNDER-BUST ELASTIC / GUMKA POD BIUSTEM */}
      <g 
        id="underbust" 
        className={`interactive-part ${activePart === 'underbust' ? 'active' : ''}`}
        onClick={() => setActivePart('underbust')}
      >
        <rect 
          x="142" 
          y="90" 
          width="116" 
          height="4" 
          fill={getPartFill('underbust', '#c9cdd4')} 
          stroke={activePart === 'underbust' ? 'var(--color-primary)' : 'none'}
          strokeWidth="1.5"
        />
      </g>

      {/* 5. LACE TRIM / WYKOŃCZENIE (Hem lace at bottom) */}
      <g 
        id="trim" 
        className={`interactive-part ${activePart === 'trim' ? 'active' : ''}`}
        onClick={() => setActivePart('trim')}
      >
        {/* Scalloped edge representation at bottom hem */}
        <path 
          d="M 110 220 Q 115 228 120 220 Q 125 228 130 220 Q 135 228 140 220 Q 145 228 150 220 Q 155 228 160 220 Q 165 228 170 220 Q 175 228 180 220 Q 185 228 190 220 Q 195 228 200 220 Q 205 228 210 220 Q 215 228 220 220 Q 225 228 230 220 Q 235 228 240 220 Q 245 228 250 220 Q 255 228 260 220 Q 265 228 270 220 Q 275 228 280 220 Q 285 228 290 220 L 290 226 L 110 226 Z" 
          fill={getPartFill('trim', '#d1d5db')} 
          stroke={activePart === 'trim' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'trim' ? '2' : '1'}
        />
        {/* Lace pattern overlay */}
        {selections.trim && (
          <path 
            d="M 110 220 Q 115 228 120 220 Q 125 228 130 220 Q 135 228 140 220 Q 145 228 150 220 Q 155 228 160 220 Q 165 228 170 220 Q 175 228 180 220 Q 185 228 190 220 Q 195 228 200 220 Q 205 228 210 220 Q 215 228 220 220 Q 225 228 230 220 Q 235 228 240 220 Q 245 228 250 220 Q 255 228 260 220 Q 265 228 270 220 Q 275 228 280 220 Q 285 228 290 220 L 290 226 L 110 226 Z" 
            fill="url(#lace-pattern-gown)" 
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        )}
      </g>
    </svg>
  );
}
