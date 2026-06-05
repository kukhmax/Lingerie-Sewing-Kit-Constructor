import React from 'react';

export default function PantiesSvg({ activePart, setActivePart, selections }) {
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
        {/* Lace pattern overlay */}
        <pattern id="lace-pattern-panties" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <path d="M 0 0 A 5 5 0 0 1 10 5 A 5 5 0 0 0 20 10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.2)" />
        </pattern>
      </defs>

      {/* 1. BACK PANEL / TYŁ (Shows at sides as a backdrop) */}
      <g 
        id="back" 
        className={`interactive-part ${activePart === 'back' ? 'active' : ''}`}
        onClick={() => setActivePart('back')}
      >
        <path 
          d="M 80 50 L 320 50 C 320 50, 360 120, 310 170 C 270 210, 220 220, 220 220 L 180 220 C 180 220, 130 210, 90 170 C 40 120, 80 50, 80 50 Z" 
          fill={getPartFill('back', '#e5e7eb')} 
          stroke={activePart === 'back' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'back' ? '2.5' : '1.2'}
        />
      </g>

      {/* 2. FRONT PANEL / PRZÓD (Main front piece overlays back) */}
      <g 
        id="front" 
        className={`interactive-part ${activePart === 'front' ? 'active' : ''}`}
        onClick={() => setActivePart('front')}
      >
        <path 
          d="M 83 55 L 317 55 C 317 55, 300 130, 240 180 C 225 192, 220 195, 220 195 L 180 195 C 180 195, 175 192, 160 180 C 100 130, 83 55, 83 55 Z" 
          fill={getPartFill('front', '#f9fafb')} 
          stroke={activePart === 'front' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'front' ? '2.5' : '1.5'}
        />
        {/* Overlay lace pattern */}
        {selections.front && (
          <path 
            d="M 83 55 L 317 55 C 317 55, 300 130, 240 180 C 225 192, 220 195, 220 195 L 180 195 C 180 195, 175 192, 160 180 C 100 130, 83 55, 83 55 Z" 
            fill="url(#lace-pattern-panties)" 
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        )}
      </g>

      {/* 3. GUSSET / KLIN (Crotch area) */}
      <g 
        id="gusset" 
        className={`interactive-part ${activePart === 'gusset' ? 'active' : ''}`}
        onClick={() => setActivePart('gusset')}
      >
        <path 
          d="M 180 195 L 220 195 C 220 195, 220 215, 215 220 L 185 220 C 180 215, 180 195, 180 195 Z" 
          fill={getPartFill('gusset', '#f3f4f6')} 
          stroke={activePart === 'gusset' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'gusset' ? '2.5' : '1.2'}
        />
      </g>

      {/* 4. WAISTBAND ELASTIC / GUMA W PASIE */}
      <g 
        id="waist" 
        className={`interactive-part ${activePart === 'waist' ? 'active' : ''}`}
        onClick={() => setActivePart('waist')}
      >
        <path 
          d="M 76 48 L 324 48" 
          fill="none" 
          stroke={getPartFill('waist', '#c9cdd4')} 
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* 5. LEG ELASTICS / GUMKI W NOGAWKACH (Left & Right) */}
      <g 
        id="legs" 
        className={`interactive-part ${activePart === 'legs' ? 'active' : ''}`}
        onClick={() => setActivePart('legs')}
      >
        {/* Left Leg Open Elastic */}
        <path 
          d="M 80 52 C 80 52, 98 135, 180 195" 
          fill="none" 
          stroke={getPartFill('legs', '#c9cdd4')} 
          strokeWidth="3"
        />
        {/* Right Leg Open Elastic */}
        <path 
          d="M 320 52 C 320 52, 302 135, 220 195" 
          fill="none" 
          stroke={getPartFill('legs', '#c9cdd4')} 
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
