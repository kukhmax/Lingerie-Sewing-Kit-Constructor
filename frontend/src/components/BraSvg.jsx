import React from 'react';

export default function BraSvg({ activePart, setActivePart, selections }) {
  // Helper to get fill color for a part based on selection
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
        {/* Semi-transparent lace texture overlay */}
        <pattern id="lace-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <path d="M 0 0 A 5 5 0 0 1 10 5 A 5 5 0 0 0 20 10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.2)" />
          <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.3)" />
        </pattern>
      </defs>

      {/* 1. WINGS / PAS OBWODU (Left & Right) */}
      <g 
        id="wings" 
        className={`interactive-part ${activePart === 'wings' ? 'active' : ''}`}
        onClick={() => setActivePart('wings')}
      >
        {/* Left Wing */}
        <path 
          d="M 50 120 C 50 120, 20 125, 10 140 C 5 147, 5 160, 25 155 C 45 150, 100 135, 110 135 L 110 155 C 90 155, 60 162, 50 162 Z" 
          fill={getPartFill('wings', '#e5e7eb')} 
          stroke={activePart === 'wings' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'wings' ? '2.5' : '1.2'}
        />
        {/* Right Wing */}
        <path 
          d="M 350 120 C 350 120, 380 125, 390 140 C 395 147, 395 160, 375 155 C 355 150, 300 135, 290 135 L 290 155 C 310 155, 340 162, 350 162 Z" 
          fill={getPartFill('wings', '#e5e7eb')} 
          stroke={activePart === 'wings' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'wings' ? '2.5' : '1.2'}
        />
      </g>

      {/* 2. STRAPS / RAMIĄCZKA (Left & Right) */}
      <g 
        id="straps" 
        className={`interactive-part ${activePart === 'straps' ? 'active' : ''}`}
        onClick={() => setActivePart('straps')}
      >
        {/* Left Strap */}
        <path 
          d="M 128 100 L 128 30 C 128 30, 126 25, 120 25 C 114 25, 112 30, 112 30 L 112 120 L 118 120 L 118 35 L 122 35 L 122 100 Z" 
          fill={getPartFill('straps', '#d1d5db')} 
          stroke={activePart === 'straps' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'straps' ? '2.5' : '1'}
        />
        {/* Right Strap */}
        <path 
          d="M 272 100 L 272 30 C 272 30, 274 25, 280 25 C 286 25, 288 30, 288 30 L 288 120 L 282 120 L 282 35 L 278 35 L 278 100 Z" 
          fill={getPartFill('straps', '#d1d5db')} 
          stroke={activePart === 'straps' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'straps' ? '2.5' : '1'}
        />
      </g>

      {/* 3. CUPS / MISECZKI (Left & Right) */}
      <g 
        id="cups" 
        className={`interactive-part ${activePart === 'cups' ? 'active' : ''}`}
        onClick={() => setActivePart('cups')}
      >
        {/* Left Cup */}
        <path 
          d="M 110 135 C 110 135, 115 85, 145 80 C 175 75, 195 105, 195 130 C 195 155, 150 180, 115 155 C 105 147, 110 135, 110 135 Z" 
          fill={getPartFill('cups', '#f9fafb')} 
          stroke={activePart === 'cups' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'cups' ? '2.5' : '1.5'}
        />
        {/* Left Cup Lace Pattern Overlay */}
        {selections.cups && (
          <path 
            d="M 110 135 C 110 135, 115 85, 145 80 C 175 75, 195 105, 195 130 C 195 155, 150 180, 115 155 C 105 147, 110 135, 110 135 Z" 
            fill="url(#lace-pattern)" 
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        )}

        {/* Right Cup */}
        <path 
          d="M 290 135 C 290 135, 285 85, 255 80 C 225 75, 205 105, 205 130 C 205 155, 250 180, 285 155 C 295 147, 290 135, 290 135 Z" 
          fill={getPartFill('cups', '#f9fafb')} 
          stroke={activePart === 'cups' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'cups' ? '2.5' : '1.5'}
        />
        {/* Right Cup Lace Pattern Overlay */}
        {selections.cups && (
          <path 
            d="M 290 135 C 290 135, 285 85, 255 80 C 225 75, 205 105, 205 130 C 205 155, 250 180, 285 155 C 295 147, 290 135, 290 135 Z" 
            fill="url(#lace-pattern)" 
            style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
          />
        )}
      </g>

      {/* 4. UNDERWIRE / TUNELE NA FISZBINY (Left & Right) */}
      <g 
        id="underwires" 
        className={`interactive-part ${activePart === 'underwires' ? 'active' : ''}`}
        onClick={() => setActivePart('underwires')}
      >
        {/* Left Underwire Channel */}
        <path 
          d="M 112 153 C 122 165, 155 178, 190 135 C 193 131, 195 125, 195 125" 
          fill="none" 
          stroke={getPartFill('underwires', '#d1d5db')} 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        {/* Right Underwire Channel */}
        <path 
          d="M 288 153 C 278 165, 245 178, 210 135 C 207 131, 205 125, 205 125" 
          fill="none" 
          stroke={getPartFill('underwires', '#d1d5db')} 
          strokeWidth="6" 
          strokeLinecap="round"
        />
      </g>

      {/* 5. GORE / MOSTEK */}
      <g 
        id="gore" 
        className={`interactive-part ${activePart === 'gore' ? 'active' : ''}`}
        onClick={() => setActivePart('gore')}
      >
        <polygon 
          points="195,130 205,130 208,162 192,162" 
          fill={getPartFill('gore', '#e5e7eb')} 
          stroke={activePart === 'gore' ? 'var(--color-primary)' : '#b5a595'}
          strokeWidth={activePart === 'gore' ? '2.5' : '1.2'}
        />
      </g>

      {/* 6. ELASTICS / GUMKI (Underband and Upper Edge) */}
      <g 
        id="elastics" 
        className={`interactive-part ${activePart === 'elastics' ? 'active' : ''}`}
        onClick={() => setActivePart('elastics')}
      >
        {/* Underband Elastic */}
        <path 
          d="M 20 157 C 50 156, 112 165, 192, 163 L 208, 163 C 288, 165, 350 156, 380 157" 
          fill="none" 
          stroke={getPartFill('elastics', '#c9cdd4')} 
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Upper Left Wing Elastic */}
        <path 
          d="M 10 140 C 20 125, 50 120, 110 135" 
          fill="none" 
          stroke={getPartFill('elastics', '#c9cdd4')} 
          strokeWidth="2.5"
        />
        {/* Upper Right Wing Elastic */}
        <path 
          d="M 390 140 C 380 125, 350 120, 290 135" 
          fill="none" 
          stroke={getPartFill('elastics', '#c9cdd4')} 
          strokeWidth="2.5"
        />
      </g>

      {/* 7. HARDWARE / REGULATORY */}
      <g 
        id="hardware" 
        className={`interactive-part ${activePart === 'hardware' ? 'active' : ''}`}
        onClick={() => setActivePart('hardware')}
      >
        {/* Left Adjuster Rings */}
        <circle cx="120" cy="35" r="4" fill="none" stroke={getPartFill('hardware', '#9ca3af')} strokeWidth="2.5" />
        {/* Right Adjuster Rings */}
        <circle cx="280" cy="35" r="4" fill="none" stroke={getPartFill('hardware', '#9ca3af')} strokeWidth="2.5" />
      </g>

      {/* 8. CLOSURE / ZAPIĘCIE */}
      <g 
        id="closure" 
        className={`interactive-part ${activePart === 'closure' ? 'active' : ''}`}
        onClick={() => setActivePart('closure')}
      >
        {/* Back Hook & Eye Piece representation on Left Wing end */}
        <rect 
          x="12" 
          y="138" 
          width="12" 
          height="18" 
          rx="1" 
          fill={getPartFill('closure', '#d1d5db')} 
          stroke={activePart === 'closure' ? 'var(--color-primary)' : '#9ca3af'}
          strokeWidth={activePart === 'closure' ? '2' : '1'}
        />
        {/* Small hooks */}
        <path d="M 9 143 L 12 143 M 9 151 L 12 151" stroke="#4b5563" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
