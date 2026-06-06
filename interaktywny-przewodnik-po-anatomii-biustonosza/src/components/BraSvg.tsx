import React from 'react';
import { BraPartId } from '../types.ts';

interface BraSvgProps {
  selectedPart: BraPartId | null;
  hoveredPart: BraPartId | null;
  onPartSelect: (id: BraPartId) => void;
  onPartHover: (id: BraPartId | null) => void;
  partColors: Record<BraPartId, string>;
  visibleLabels: boolean;
}

export const BraSvg: React.FC<BraSvgProps> = ({
  selectedPart,
  hoveredPart,
  onPartSelect,
  onPartHover,
  partColors,
  visibleLabels,
}) => {
  // Check if a part is active (either hovered or selected)
  const isPartActive = (id: BraPartId) => {
    return selectedPart === id || hoveredPart === id;
  };

  // Style for filled areas (cups, wings, bridge)
  const getPartStyle = (id: BraPartId) => {
    const active = isPartActive(id);
    const color = partColors[id];
    return {
      fill: active ? `${color}35` : '#ffffff', // semi-transparent highlight overlay or opaque clean workspace white
      stroke: active ? color : '#1e293b', // highlight color or slate-800 technical ink lines
      strokeWidth: active ? '3.5' : '1.8',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  // Style for technical lines or secondary borders
  const getLineStyle = (id: BraPartId, thickness = 1.8) => {
    const active = isPartActive(id);
    const color = partColors[id];
    return {
      stroke: active ? color : '#1e293b',
      strokeWidth: active ? thickness + 2 : thickness,
      fill: 'none',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-stone-50/40 rounded-3xl border border-stone-200/80 p-3 md:p-6 shadow-sm">
      <svg
        id="interactive-bra-svg"
        viewBox="0 0 1000 500"
        className="w-full h-auto select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG Defs for markers and visual artifacts */}
        <defs>
          <marker
            id="pointer-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 Z" fill="#1e293b" />
          </marker>
        </defs>

        {/* Ambient drafting board style background grid */}
        <g stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.65">
          <line x1="500" y1="20" x2="500" y2="480" />
          <line x1="40" y1="250" x2="960" y2="250" />
          <line x1="150" y1="50" x2="850" y2="450" opacity="0.4" />
          <line x1="850" y1="50" x2="150" y2="450" opacity="0.4" />
        </g>

        {/* ========================================================= */}
        {/* LAYER 1: BACK WINGS / ELESTIC POWERNET (tiul_elastyczny)  */}
        {/* ========================================================= */}
        
        {/* Left Wing (Back band side - Full band construction) */}
        <g
          id="wing-left-panel"
          onMouseEnter={() => onPartHover('tiul_elastyczny')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('tiul_elastyczny')}
        >
          {/* This wing goes from left side seam [180] to back closure hook [91] */}
          {/* Bounded by upper and lower band elastic lines */}
          <path
            d="M 91 300 C 130 282, 160 264, 180 254 L 180 333 C 150 332, 120 335, 91 340 Z"
            style={getPartStyle('tiul_elastyczny')}
          />
        </g>

        {/* Right Wing (Back band side - Symmetrical Full band construction) */}
        <g
          id="wing-right-panel"
          onMouseEnter={() => onPartHover('tiul_elastyczny')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('tiul_elastyczny')}
        >
          {/* This wing is a symmetrical mirror of the left wing, attaching to the right side seam [820] */}
          <path
            d="M 909 300 C 870 282, 840 264, 820 254 L 820 333 C 850 332, 880 335, 909 340 Z"
            style={getPartStyle('tiul_elastyczny')}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 2: THE BACK CLOSURE & HOOK-AND-EYE TAPE (haftka)     */}
        {/* ========================================================= */}
        <g
          id="part-haftka-closure"
          onMouseEnter={() => onPartHover('haftka')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('haftka')}
        >
          {/* Left Wing Hooks Tape */}
          <g transform="translate(73, 290)">
            <rect
              x="0"
              y="0"
              width="18"
              height="50"
              rx="2"
              fill={isPartActive('haftka') ? `${partColors.haftka}35` : '#ffffff'}
              stroke={isPartActive('haftka') ? partColors.haftka : '#1e293b'}
              strokeWidth="1.8"
              style={{ transition: 'all 0.2s' }}
            />
            {/* Hooks eyelets details */}
            <circle cx="9" cy="12" r="2.5" fill="#1e293b" />
            <circle cx="9" cy="25" r="2.5" fill="#1e293b" />
            <circle cx="9" cy="38" r="2.5" fill="#1e293b" />
          </g>

          {/* Right Wing Eyes tape */}
          <g transform="translate(909, 290)">
            <rect
              x="0"
              y="0"
              width="18"
              height="50"
              rx="2"
              fill={isPartActive('haftka') ? `${partColors.haftka}35` : '#ffffff'}
              stroke={isPartActive('haftka') ? partColors.haftka : '#1e293b'}
              strokeWidth="1.8"
              style={{ transition: 'all 0.2s' }}
            />
            {/* Symmetrical Eye loop detailing */}
            <path d="M 0 12 Q -5 12, -5 15 Q -5 18, 0 18" fill="none" stroke="#1e293b" strokeWidth="1.8" />
            <path d="M 0 25 Q -5 25, -5 28 Q -5 31, 0 31" fill="none" stroke="#1e293b" strokeWidth="1.8" />
            <path d="M 0 38 Q -5 38, -5 41 Q -5 44, 0 44" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          </g>
        </g>

        {/* ========================================================= */}
        {/* LAYER 3: THE STABLE TRAPEZOIDAL CENTER BRIDGE (tiul_stabilny) */}
        {/* ========================================================= */}
        <g
          id="part-bridge-core"
          onMouseEnter={() => onPartHover('tiul_stabilny')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('tiul_stabilny')}
        >
          {/* Perfectly centered support gore panel with Gothic High Arch bottom for exact blueprint replication */}
          <path
            d="M 465 250 C 485 245, 515 245, 535 250 L 545 345 Q 500 310, 455 345 Z"
            style={getPartStyle('tiul_stabilny')}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 4: FRONT BAND BASE / CRADLE FRAME (material)        */}
        {/* ========================================================= */}
        
        {/* This represents the physical symmetrical "Full band" fabric framework under BOTH cups */}
        <g
          id="part-cup-base-frame"
          onMouseEnter={() => onPartHover('material')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('material')}
        >
          {/* Left Cup Cradle Frame: connects side seam [180] back to center front gore [455] */}
          <path
            d="M 180 254 L 255 245 C 275 350, 445 355, 455 330 C 455 338, 455 345, 455 345 C 320 358, 240 335, 180 333 Z"
            style={getPartStyle('material')}
          />
          {/* Right Cup Cradle Frame: symmetrical mirror of the left cradle frame, connecting [820] to [545] */}
          <path
            d="M 820 254 L 745 245 C 725 350, 555 355, 545 330 C 545 338, 545 345, 545 345 C 680 358, 760 335, 820 333 Z"
            style={getPartStyle('material')}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 5: LOWER CUP LOBES (material)                       */}
        {/* ========================================================= */}
        <g
          id="part-lower-cups"
          onMouseEnter={() => onPartHover('material')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('material')}
        >
          {/* Left Lower Cup - bounded below by central wire casing and above by beautiful diagonal seam */}
          <path
            d="M 255 245 Q 345 285, 435 310 C 448 296, 458 274, 465 250 C 445 355, 275 350, 255 245 Z"
            style={getPartStyle('material')}
          />
          
          {/* Right Lower Cup */}
          <path
            d="M 745 245 Q 655 285, 565 310 C 552 296, 542 274, 535 250 C 555 355, 725 350, 745 245 Z"
            style={getPartStyle('material')}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 6: UPPER CUPS INTRICATE PANELS (koronka)            */}
        {/* ========================================================= */}
        <g
          id="part-upper-cups-lace"
          onMouseEnter={() => onPartHover('koronka')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('koronka')}
        >
          {/* Left Upper Cup - extending from diagonal seam to elegant neckline and armhole edge */}
          <path
            d="M 255 245 Q 345 285, 435 310 C 445 290, 455 270, 465 250 C 440 220, 390 170, 360 140 C 330 170, 280 210, 255 245 Z"
            style={getPartStyle('koronka')}
          />

          {/* Right Upper Cup */}
          <path
            d="M 745 245 Q 655 285, 565 310 C 555 290, 545 270, 535 250 C 560 220, 610 170, 640 140 C 670 170, 720 210, 745 245 Z"
            style={getPartStyle('koronka')}
          />

          {/* Delicate physical lace scalloped border edge lines inside upper panels */}
          <path
            d="M 360 140 Q 338 160, 321 180 Q 303 200, 287 220 Q 271 233, 255 245"
            fill="none"
            stroke={isPartActive('koronka') ? partColors.koronka : '#475569'}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 640 140 Q 662 160, 679 180 Q 697 200, 713 220 Q 729 233, 745 245"
            fill="none"
            stroke={isPartActive('koronka') ? partColors.koronka : '#475569'}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 7: DIAGONAL CUP SEAM DOUBLE STITCHES (miseczki)     */}
        {/* ========================================================= */}
        <g
          id="part-cup-seam-details"
          onMouseEnter={() => onPartHover('miseczki')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('miseczki')}
        >
          {/* Left seam stitch lines */}
          <path
            d="M 255 245 Q 345 285, 435 310"
            fill="none"
            stroke={isPartActive('miseczki') ? partColors.miseczki : '#1e293b'}
            strokeWidth={isPartActive('miseczki') ? '3.5' : '1.8'}
            style={{ transition: 'all 0.25s' }}
          />
          <path
            d="M 255 248 Q 345 288, 435 313"
            fill="none"
            stroke={isPartActive('miseczki') ? partColors.miseczki : '#1e293b'}
            strokeWidth="1"
            strokeDasharray="3 2"
            style={{ transition: 'all 0.25s' }}
          />

          {/* Right seam stitch lines */}
          <path
            d="M 745 245 Q 655 285, 565 310"
            fill="none"
            stroke={isPartActive('miseczki') ? partColors.miseczki : '#1e293b'}
            strokeWidth={isPartActive('miseczki') ? '3.5' : '1.8'}
            style={{ transition: 'all 0.25s' }}
          />
          <path
            d="M 745 248 Q 655 288, 565 313"
            fill="none"
            stroke={isPartActive('miseczki') ? partColors.miseczki : '#1e293b'}
            strokeWidth="1"
            strokeDasharray="3 2"
            style={{ transition: 'all 0.25s' }}
          />

          {/* Interactive invisible full breasts overlay to catch clicks representing "Cups" */}
          <path
            d="M 360 140 C 330 170, 280 210, 255 245 C 275 350, 445 355, 465 250 C 440 220, 390 170, 360 140 Z"
            fill="transparent"
            stroke="transparent"
            style={{ cursor: 'pointer' }}
          />
          <path
            d="M 640 140 C 670 170, 720 210, 745 245 C 725 350, 555 355, 535 250 C 560 220, 610 170, 640 140 Z"
            fill="transparent"
            stroke="transparent"
            style={{ cursor: 'pointer' }}
          />

          {/* Symmetrical design bust lines */}
          <path
            d="M 360 260 L 360 318"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.8"
          />
          <path
            d="M 640 260 L 640 318"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.8"
          />

          {/* PHYSICAL Symmetrical BUST APEX MARKERS ('X') - ON BOTH SEAMS REPLICATING THE BLUEPRINT PROMINENTLY */}
          <g transform="translate(355, 282)">
            <line x1="-7" y1="-7" x2="7" y2="7" stroke="#1e293b" strokeWidth="2.2" />
            <line x1="7" y1="-7" x2="-7" y2="7" stroke="#1e293b" strokeWidth="2.2" />
          </g>
          <g transform="translate(645, 282)">
            <line x1="-7" y1="-7" x2="7" y2="7" stroke="#1e293b" strokeWidth="2.2" />
            <line x1="7" y1="-7" x2="-7" y2="7" stroke="#1e293b" strokeWidth="2.2" />
          </g>
        </g>

        {/* ========================================================= */}
        {/* LAYER 8: UNDERBAND & EDGE ENVELOPING ELASTICS (guma_obszywkowa) */}
        {/* ========================================================= */}
        <g
          id="part-obszywkowa-band-elastics"
          onMouseEnter={() => onPartHover('guma_obszywkowa')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('guma_obszywkowa')}
        >
          {/* Symmetrical vertical side seams denoting the wing attachment */}
          <line x1="180" y1="254" x2="180" y2="333" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="820" y1="254" x2="820" y2="333" stroke="#1e293b" strokeWidth="1.8" />

          {/* Underband Picot Elastic along the entire lower base of the wings */}
          {/* Bottom Elastic Edge representing Left & Right wings bottom borders */}
          <path
            d="M 91 340 C 120 335, 150 332, 180 333"
            style={getLineStyle('guma_obszywkowa', 3)}
          />
          <path
            d="M 820 333 C 850 332, 880 335, 909 340"
            style={getLineStyle('guma_obszywkowa', 3)}
          />

          {/* Underband continuous elastic line extending under left cup as "Bottom of band" */}
          <path
            d="M 180 333 C 240 335, 320 358, 455 345"
            style={getLineStyle('guma_obszywkowa', 3.5)}
          />

          {/* Underband continuous elastic line extending under right cup */}
          <path
            d="M 545 345 C 680 358, 760 335, 820 333"
            style={getLineStyle('guma_obszywkowa', 3.5)}
          />

          {/* Gothic arch elastic line along the bottom of the center bridge */}
          <path
            d="M 455 345 Q 500 310, 545 345"
            style={getLineStyle('guma_obszywkowa', 3.5)}
          />

          {/* Top Elastic band edges along wings */}
          <path
            d="M 91 300 C 130 282, 160 264, 180 254"
            style={getLineStyle('guma_obszywkowa', 2.2)}
          />
          <path
            d="M 820 254 C 840 264, 870 282, 909 300"
            style={getLineStyle('guma_obszywkowa', 2.2)}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 9: CHANNELS & WIRE CASING COVERS (tunel_gorseciarski) */}
        {/* ========================================================= */}
        <g
          id="part-wire-casing-tunnel"
          onMouseEnter={() => onPartHover('tunel_gorseciarski')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('tunel_gorseciarski')}
        >
          {/* Heavy plush double-line seam covering the underwires */}
          {/* Left underwire casing ribbon */}
          <path
            d="M 255 245 C 275 350, 445 355, 465 250"
            style={getLineStyle('tunel_gorseciarski', 8.5)}
          />
          {/* Right underwire casing ribbon */}
          <path
            d="M 745 245 C 725 350, 555 355, 535 250"
            style={getLineStyle('tunel_gorseciarski', 8.5)}
          />

          {/* Technical dashed parallel lines signifying the underwire stitch lines */}
          <path
            d="M 253 245 C 273 353, 447 358, 467 250"
            fill="none"
            stroke={isPartActive('tunel_gorseciarski') ? partColors.tunel_gorseciarski : '#475569'}
            strokeWidth="1.2"
            strokeDasharray="4 3"
            style={{ transition: 'all 0.25s' }}
          />
          <path
            d="M 747 245 C 727 353, 553 358, 533 250"
            fill="none"
            stroke={isPartActive('tunel_gorseciarski') ? partColors.tunel_gorseciarski : '#475569'}
            strokeWidth="1.2"
            strokeDasharray="4 3"
            style={{ transition: 'all 0.25s' }}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 10: SPRING STEEL WIRE INSERT FLATS (fiszbiny)        */}
        {/* ========================================================= */}
        <g
          id="part-metal-underwires"
          onMouseEnter={() => onPartHover('fiszbiny')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('fiszbiny')}
        >
          {/* Internal rigid steel bars represented as sharp supportive curves */}
          <path
            d="M 259 248 C 278 344, 440 348, 461 251"
            style={getLineStyle('fiszbiny', 2.8)}
          />
          <path
            d="M 741 248 C 722 344, 560 348, 539 251"
            style={getLineStyle('fiszbiny', 2.8)}
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 11: DESIGNER SHOULDER STRAPS (guma_obszywkowa)       */}
        {/* ========================================================= */}
        <g
          id="part-straps-elastic"
          onMouseEnter={() => onPartHover('guma_ramiackowa')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('guma_ramiackowa')}
          style={{ cursor: 'pointer' }}
        >
          {/* Left Strap - double-border ribbon aesthetic going to left peak (which has NO ring) */}
          {/* Note: The physical extension connects to peak [360, 140] */}
          {/* We stitch horizontal line "Top cup with strap extension" at 360, 140 */}
          <path
            d="M 360 140 C 352 90, 275 36, 175 51 C 115 63, 80 137, 85 300"
            fill="none"
            stroke={isPartActive('guma_ramiackowa') ? partColors.guma_ramiackowa : '#1e293b'}
            strokeWidth="9"
            style={{ transition: 'all 0.2s' }}
          />
          <path
            d="M 360 140 C 352 90, 275 36, 175 51 C 115 63, 80 137, 85 300"
            fill="none"
            stroke={isPartActive('guma_ramiackowa') ? `${partColors.guma_ramiackowa}20` : '#ffffff'}
            strokeWidth="6"
            style={{ transition: 'all 0.2s' }}
          />

          {/* Right Strap - double-border ribbon connected above the metallic Ring [640, 130] */}
          <path
            d="M 640 130 C 648 80, 725 36, 825 51 C 885 63, 920 137, 915 300"
            fill="none"
            stroke={isPartActive('guma_ramiackowa') ? partColors.guma_ramiackowa : '#1e293b'}
            strokeWidth="9"
            style={{ transition: 'all 0.2s' }}
          />
          <path
            d="M 640 130 C 648 80, 725 36, 825 51 C 885 63, 920 137, 915 300"
            fill="none"
            stroke={isPartActive('guma_ramiackowa') ? `${partColors.guma_ramiackowa}20` : '#ffffff'}
            strokeWidth="6"
            style={{ transition: 'all 0.2s' }}
          />

          {/* Left peak horizontal connection stitch (representing "Top cup with strap extension") */}
          <line x1="352" y1="140" x2="368" y2="140" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="352" y1="142" x2="368" y2="142" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 1" />
        </g>

        {/* ========================================================= */}
        {/* LAYER 12: METAL RING HARDWARE ASYMMETRICAL (kolka)        */}
        {/* ========================================================= */}
        <g
          id="part-hardware-rings"
          onMouseEnter={() => onPartHover('kolka')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('kolka')}
          style={{ cursor: 'pointer' }}
        >
          {/* Fabric loop holding Ring at right peak */}
          <path d="M 632 148 C 632 148, 640 160, 648 148" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          
          {/* Symmetrical metal loop on right shoulder strap only */}
          <circle
            cx="640"
            cy="140"
            r="11"
            fill="#ffffff"
            stroke={isPartActive('kolka') ? partColors.kolka : '#1e293b'}
            strokeWidth={isPartActive('kolka') ? '3.5' : '1.8'}
            style={{ transition: 'all 0.2s' }}
          />
          <circle
            cx="640"
            cy="140"
            r="7.5"
            fill="none"
            stroke={isPartActive('kolka') ? partColors.kolka : '#1e293b'}
            strokeWidth="1"
          />
        </g>

        {/* ========================================================= */}
        {/* LAYER 13: ADJUSTABLE STRAP HARDWARE / BRACKETS (regulatory) */}
        {/* ========================================================= */}
        <g
          id="part-hardware-adjusters"
          onMouseEnter={() => onPartHover('regulatory')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('regulatory')}
          style={{ cursor: 'pointer' }}
        >
          {/* Left Slider representation (ósemki) */}
          <g transform="translate(235, 33) rotate(9)">
            <rect
              x="0"
              y="0"
              width="18"
              height="10"
              rx="1.5"
              fill={isPartActive('regulatory') ? partColors.regulatory : '#ffffff'}
              stroke="#1e293b"
              strokeWidth="1.8"
              style={{ transition: 'all 0.25s' }}
            />
            <line x1="9" y1="0" x2="9" y2="10" stroke="#1e293b" strokeWidth="1.5" />
          </g>

          {/* Right Slider representation */}
          <g transform="translate(765, 33) rotate(-9)">
            <rect
              x="0"
              y="0"
              width="18"
              height="10"
              rx="1.5"
              fill={isPartActive('regulatory') ? partColors.regulatory : '#ffffff'}
              stroke="#1e293b"
              strokeWidth="1.8"
              style={{ transition: 'all 0.25s' }}
            />
            <line x1="9" y1="0" x2="9" y2="10" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================= */}
        {/* LAYER 14: DECORATIVE CENTER RIBBON/BOW (kokardka)          */}
        {/* ========================================================= */}
        <g
          id="part-ribbon-bow"
          onMouseEnter={() => onPartHover('kokardka')}
          onMouseLeave={() => onPartHover(null)}
          onClick={() => onPartSelect('kokardka')}
          style={{ cursor: 'pointer' }}
        >
          {/* Centered on center front bridge upper region */}
          <g transform="translate(500, 252)">
            {/* Left Satin Bow Loop */}
            <path
              d="M 0 0 C -12 -12, -15 8, 0 0 Z"
              fill={isPartActive('kokardka') ? partColors.kokardka : '#f43f5e'}
              stroke="#be123c"
              strokeWidth="0.8"
            />
            {/* Right Satin Bow Loop */}
            <path
              d="M 0 0 C 12 -12, 15 8, 0 0 Z"
              fill={isPartActive('kokardka') ? partColors.kokardka : '#f43f5e'}
              stroke="#be123c"
              strokeWidth="0.8"
            />
            {/* Drooping satin tape tails */}
            <path d="M 0 0 Q -4 12, -8 18" fill="none" stroke={isPartActive('kokardka') ? partColors.kokardka : '#be123c'} strokeWidth="1.8" />
            <path d="M 0 0 Q 4 12, 8 18" fill="none" stroke={isPartActive('kokardka') ? partColors.kokardka : '#be123c'} strokeWidth="1.8" />
            
            {/* Ribbon central core knot */}
            <circle cx="0" cy="0" r="3.2" fill={isPartActive('kokardka') ? partColors.kokardka : '#be123c'} />
          </g>
        </g>

        {/* ======================================================================= */}
        {/* MICROSCOPIC ACCURATE ANNOTATIONS (Perfect match of the drawing text!)  */}
        {/* ======================================================================= */}
        {visibleLabels && (
          <g id="technical-annotations" className="pointer-events-none transition-all duration-300">
            {/* Arrow Marker Definitions used internally in defs */}
            
            {/* 1. Strap Elastic - Guma ramiączkowa */}
            <path d="M 230 100 L 195 85" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="235" y="104" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="start">guma ramiączkowa</text>

            <path d="M 770 100 L 805 85" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="765" y="104" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="end">guma ramiączkowa</text>

            {/* 2. Top cup with strap extension / Neckline elastic */}
            <path d="M 430 160 L 372 148" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="438" y="164" className="font-sans text-[11px] font-semibold fill-slate-600">guma obszywkowa</text>

            {/* 3. top cup - Tkanina lub koronka */}
            <text x="350" y="205" className="font-sans text-[11px] font-bold fill-slate-600" textAnchor="middle">tkanina lub koronka</text>
            <text x="650" y="205" className="font-sans text-[11px] font-bold fill-slate-600" textAnchor="middle">tkanina lub koronka</text>

            {/* 4. Neckline - Górna guma obszywkowa */}
            <path d="M 500 195 C 485 205, 465 210, 442 214" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <path d="M 500 195 Q 520 205, 558 214" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="500" y="185" className="font-sans text-[11.5px] font-bold fill-slate-800" textAnchor="middle">guma obszywkowa (dekolt)</text>

            {/* 5. Lower cup - Dolna część miseczki */}
            <text x="350" y="290" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">dolna część miseczki</text>
            <text x="650" y="290" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">dolna część miseczki</text>

            {/* 6. Hook and eye closure - Haftka */}
            <path d="M 32 310 L 71 310" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="26" y="313" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="end">haftka (zapięcie)</text>

            <path d="M 968 310 L 929 310" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="974" y="313" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="start">haftka (zapięcie)</text>

            {/* 7. Wings - Skrzydełko obwodu */}
            <text x="145" y="310" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">skrzydełko obwodu</text>
            <text x="855" y="310" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">skrzydełko obwodu</text>

            {/* 8. Underband - Dolna guma obszywkowa */}
            <path d="M 80 415 C 100 385, 120 355, 130 338" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="75" y="428" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="end">guma obszywkowa (dół)</text>

            <path d="M 920 415 C 900 385, 880 355, 870 338" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="925" y="428" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="start">guma obszywkowa (dół)</text>

            {/* 9. Underwire casing - Tunel gorseciarski */}
            <path d="M 220 425 C 250 395, 270 365, 285 330" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="220" y="440" className="font-sans text-[11px] font-bold fill-slate-700" textAnchor="middle">tunel gorseciarski</text>

            <path d="M 780 425 C 750 395, 730 365, 715 330" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="780" y="440" className="font-sans text-[11px] font-bold fill-slate-700" textAnchor="middle">tunel gorseciarski</text>

            {/* 10. Underwires - Fiszbiny */}
            <path d="M 380 425 C 375 395, 365 375, 355 344" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="380" y="440" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">fiszbiny</text>

            <path d="M 620 425 C 625 395, 635 375, 645 344" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="620" y="440" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">fiszbiny</text>

            {/* 11. Center Gore - Mostek */}
            <text x="500" y="305" className="font-sans text-[11.5px] font-bold fill-slate-800" textAnchor="middle">mostek</text>

            {/* 12. Mostek do miseczki */}
            <path d="M 458 410 C 470 395, 480 375, 488 350" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="454" y="424" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="middle">mostek do miseczki</text>

            {/* 13. Rings - Kółka */}
            <path d="M 720 140 L 655 140" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="728" y="144" className="font-sans text-[11px] font-semibold fill-slate-700">kółko (łącznik)</text>

            {/* 14. Bust apex - Szczyt piersi */}
            <path d="M 730 220 L 657 275" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="738" y="224" className="font-sans text-[11px] font-bold fill-slate-700">szczyt piersi (apex)</text>

            {/* 15. Side Seam & Short Bones - Szew boczny / Fiszbiny krótkie */}
            <text x="180" y="235" className="font-sans text-[11px] font-bold fill-slate-800" textAnchor="middle">szew boczny</text>
            <text x="180" y="247" className="font-sans text-[10px] font-semibold fill-slate-600" textAnchor="middle">fiszbiny krótkie</text>

            <text x="820" y="235" className="font-sans text-[11px] font-bold fill-slate-800" textAnchor="middle">szew boczny</text>
            <text x="820" y="247" className="font-sans text-[10px] font-semibold fill-slate-600" textAnchor="middle">fiszbiny krótkie</text>

            {/* 16. Sliders - Regulatory */}
            <path d="M 175 33 L 230 35" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="168" y="36" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="end">regulatory</text>

            <path d="M 825 33 L 785 35" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
            <text x="832" y="36" className="font-sans text-[11px] font-semibold fill-slate-600" textAnchor="start">regulatory</text>
          </g>
        )}
      </svg>
    </div>
  );
};
