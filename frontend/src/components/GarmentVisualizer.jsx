import React, { useState } from 'react';

// GarmentVisualizer renders Front and Back SVGs side-by-side
// Props:
// - garmentType: 'biustonosz', 'majtki', 'bralet'
// - selectedPartId: string (e.g. 'fabric', 'lace', 'elastic_trim')
// - onPartClick: function(partId)
// - partColors: object mapping partId -> hex color string (defaults to light grey)
export default function GarmentVisualizer({
  garmentType,
  selectedPartId,
  onPartClick,
  partColors = {},
  showLabels = true
}) {
  const [hoveredPartId, setHoveredPartId] = useState(null);

  const getPartColor = (partId, defaultColor = '#ffffff') => {
    if (partId === 'fabric') {
      return partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric || defaultColor;
    }
    if (partId === 'lace') {
      return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultColor;
    }
    return partColors[partId] || defaultColor;
  };

  const getPartStroke = (partId) => {
    const isSelected = selectedPartId === partId ||
      (partId === 'fabric' && (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable')) ||
      (partId === 'lace' && (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable'));
    return isSelected ? '#c9a236' : '#a49e95';
  };

  const getPartStrokeWidth = (partId) => {
    const isSelected = selectedPartId === partId ||
      (partId === 'fabric' && (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable')) ||
      (partId === 'lace' && (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable'));
    return isSelected ? '2.5' : '1.2';
  };

  const defaultGuideColors = {
    miseczki: '#3B82F6', // Blue
    material: '#8B5CF6', // Purple
    koronka: '#EC4899', // Pink
    tiul_elastyczny: '#06B6D4', // Cyan
    tiul_stabilny: '#14B8A6', // Teal
    guma_obszywkowa: '#F59E0B', // Amber
    guma_ramiackowa: '#10B981', // Emerald
    kolka: '#EF4444', // Red
    regulatory: '#EF4444', // Red
    haftka: '#84CC16', // Lime
    fiszbiny: '#6366F1', // Indigo
    tunel_gorseciarski: '#D946EF', // Fuchsia
    kokardka: '#EAB308', // Yellow
  };

  const mapGuidePartIdToMainId = (id) => {
    switch (id) {
      case 'material':
      case 'miseczki':
      case 'fabric':
        if (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable') {
          return selectedPartId;
        }
        return 'fabric_elastic';
      case 'koronka':
      case 'lace':
        if (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable') {
          return selectedPartId;
        }
        return 'lace_elastic';
      case 'tiul_elastyczny':
        return 'tulle_elastic';
      case 'tiul_stabilny':
        return 'tulle_stable';
      case 'guma_obszywkowa':
        return 'elastic_trim';
      case 'guma_ramiackowa':
        return 'elastic_strap';
      case 'kolka':
        return 'ring';
      case 'regulatory':
        return 'slider';
      case 'haftka':
        return 'closure';
      case 'fiszbiny':
        return 'underwire';
      case 'tunel_gorseciarski':
        return 'tunnel';
      case 'kokardka':
        return 'bow';
      default:
        return id;
    }
  };

  const isPartSelected = (guideId) => {
    const mainId = mapGuidePartIdToMainId(guideId);
    return !!partColors[mainId] || 
      (guideId === 'koronka' && (partColors.lace_elastic || partColors.lace_stable || partColors.lace)) ||
      ((guideId === 'material' || guideId === 'miseczki') && (partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric));
  };

  const getGuidePartColor = (guideId) => {
    if (guideId === 'koronka') {
      return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'material' || guideId === 'miseczki') {
      return partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'tiul_elastyczny') {
      return partColors.tulle_elastic || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'tiul_stabilny') {
      return partColors.tulle_stable || defaultGuideColors[guideId] || '#e2ded5';
    }
    const mainId = mapGuidePartIdToMainId(guideId);
    return partColors[mainId] || defaultGuideColors[guideId] || '#e2ded5';
  };

  const isPartActive = (id) => {
    if (hoveredPartId === id) return true;
    if (id === 'koronka') {
      return selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable' || selectedPartId === 'lace';
    }
    if (id === 'material' || id === 'miseczki') {
      return selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable' || selectedPartId === 'fabric';
    }
    return mapGuidePartIdToMainId(id) === selectedPartId;
  };

  const getPartStyle = (id) => {
    const active = isPartActive(id);
    const selected = isPartSelected(id);
    const color = getGuidePartColor(id);
    
    let fill = '#ffffff';
    if (selected) {
      fill = color;
    } else if (active) {
      const guideColor = defaultGuideColors[id] || '#c9a236';
      fill = `${guideColor}35`;
    }
    
    let stroke = '#1e293b';
    if (active || selected) {
      stroke = color;
    }
    
    return {
      fill,
      stroke,
      strokeWidth: active ? '3.5' : '1.8',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  const getLineStyle = (id, thickness = 1.8) => {
    const active = isPartActive(id);
    const selected = isPartSelected(id);
    const color = getGuidePartColor(id);
    
    let stroke = '#1e293b';
    if (selected || active) {
      stroke = color;
    }
    
    return {
      stroke,
      strokeWidth: active ? thickness + 2 : thickness,
      fill: 'none',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  const getPartName = (partId) => {
    switch (partId) {
      case 'fabric': return 'Miseczki (główny kształt)';
      case 'fabric_elastic': return 'Tkanina elastyczna';
      case 'fabric_stable': return 'Tkanina stabilna';
      case 'lace': return 'Koronka elastyczna';
      case 'lace_elastic': return 'Koronka elastyczna';
      case 'lace_stable': return 'Koronka stabilna';
      case 'tulle_elastic': return 'Tiul elastyczny';
      case 'tulle_stable': return 'Tiul stabilny';
      case 'elastic_trim': return 'Guma obszywkowa (obwód)';
      case 'elastic_strap': return 'Guma ramiączkowa';
      case 'ring': return 'Kółka metalowe';
      case 'slider': return 'Regulatory metalowe';
      case 'closure': return 'Zapięcie haftkowe';
      case 'underwire': return 'Fiszbiny metalowe';
      case 'bow': return 'Kokardka ozdobna';
      case 'tunnel': return 'Tunel gorseciarski';
      case 'threads': return 'Nici Ariadna Talia 120';
      default: return partId;
    }
  };

  const renderBiustonosz = () => {
    return (
      <div className="garment-visualizer" style={{ flexDirection: 'column', padding: '1.5rem', alignItems: 'center' }}>
        <div className="view-section" style={{ width: '100%', maxWidth: '950px' }}>
          
          {/* SVG Interaction Guides */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'monospace',
            marginBottom: '0.75rem',
            width: '100%',
            padding: '0 0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ec4899',
              }} />
              <span>Interaktywny model wektorowy</span>
            </div>
            <div>
              {selectedPartId ? (
                <span>Wybrano: <strong style={{ color: '#475569' }}>{getPartName(selectedPartId)}</strong></span>
              ) : (
                <span>Najedź lub kliknij część, by wyodrębnić</span>
              )}
            </div>
          </div>

          <svg
            id="interactive-bra-svg"
            viewBox="0 0 1000 500"
            className="garment-svg"
            style={{ width: '100%', height: 'auto', userSelect: 'none', overflow: 'visible' }}
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
            {/* LAYER 1: BACK WINGS / ELASTIC POWERNET (tiul_elastyczny)  */}
            {/* ========================================================= */}
            
            {/* Left Wing (Back band side - Full band construction) */}
            <g
              id="wing-left-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
              <path
                d="M 91 300 C 130 282, 160 264, 180 254 L 180 333 C 150 332, 120 335, 91 340 Z"
                style={getPartStyle('tiul_elastyczny')}
              />
            </g>

            {/* Right Wing (Back band side - Symmetrical Full band construction) */}
            <g
              id="wing-right-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
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
              onMouseEnter={() => setHoveredPartId('haftka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('haftka'))}
            >
              {/* Left Wing Hooks Tape */}
              <g transform="translate(73, 290)">
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="50"
                  rx="2"
                  fill={isPartSelected('haftka') ? getGuidePartColor('haftka') : (isPartActive('haftka') ? `${getGuidePartColor('haftka')}35` : '#ffffff')}
                  stroke={(isPartActive('haftka') || isPartSelected('haftka')) ? getGuidePartColor('haftka') : '#1e293b'}
                  strokeWidth={isPartActive('haftka') ? '3.5' : '1.8'}
                  style={{ transition: 'all 0.2s' }}
                />
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
                  fill={isPartSelected('haftka') ? getGuidePartColor('haftka') : (isPartActive('haftka') ? `${getGuidePartColor('haftka')}35` : '#ffffff')}
                  stroke={(isPartActive('haftka') || isPartSelected('haftka')) ? getGuidePartColor('haftka') : '#1e293b'}
                  strokeWidth={isPartActive('haftka') ? '3.5' : '1.8'}
                  style={{ transition: 'all 0.2s' }}
                />
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
              onMouseEnter={() => setHoveredPartId('tiul_stabilny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_stabilny'))}
            >
              <path
                d="M 465 250 C 485 245, 515 245, 535 250 L 545 345 Q 500 310, 455 345 Z"
                style={getPartStyle('tiul_stabilny')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 4: FRONT BAND BASE / CRADLE FRAME (material)        */}
            {/* ========================================================= */}
            <g
              id="part-cup-base-frame"
              onMouseEnter={() => setHoveredPartId('material')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('material'))}
            >
              <path
                d="M 180 254 L 255 245 C 275 350, 445 355, 455 330 C 455 338, 455 345, 455 345 C 320 358, 240 335, 180 333 Z"
                style={getPartStyle('material')}
              />
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
              onMouseEnter={() => setHoveredPartId('material')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('material'))}
            >
              <path
                d="M 255 245 Q 345 285, 435 310 C 448 296, 458 274, 465 250 C 445 355, 275 350, 255 245 Z"
                style={getPartStyle('material')}
              />
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
              onMouseEnter={() => setHoveredPartId('koronka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('koronka'))}
            >
              <path
                d="M 255 245 Q 345 285, 435 310 C 445 290, 455 270, 465 250 C 440 220, 390 170, 360 140 C 330 170, 280 210, 255 245 Z"
                style={getPartStyle('koronka')}
              />
              <path
                d="M 745 245 Q 655 285, 565 310 C 555 290, 545 270, 535 250 C 560 220, 610 170, 640 140 C 670 170, 720 210, 745 245 Z"
                style={getPartStyle('koronka')}
              />
              <path
                d="M 360 140 Q 338 160, 321 180 Q 303 200, 287 220 Q 271 233, 255 245"
                fill="none"
                stroke={isPartActive('koronka') ? getGuidePartColor('koronka') : '#475569'}
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <path
                d="M 640 140 Q 662 160, 679 180 Q 697 200, 713 220 Q 729 233, 745 245"
                fill="none"
                stroke={isPartActive('koronka') ? getGuidePartColor('koronka') : '#475569'}
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 7: DIAGONAL CUP SEAM DOUBLE STITCHES (miseczki)     */}
            {/* ========================================================= */}
            <g
              id="part-cup-seam-details"
              onMouseEnter={() => setHoveredPartId('miseczki')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('miseczki'))}
            >
              <path
                d="M 255 245 Q 345 285, 435 310"
                fill="none"
                stroke={isPartActive('miseczki') ? getGuidePartColor('miseczki') : '#1e293b'}
                strokeWidth={isPartActive('miseczki') ? '3.5' : '1.8'}
                style={{ transition: 'all 0.25s' }}
              />
              <path
                d="M 255 248 Q 345 288, 435 313"
                fill="none"
                stroke={isPartActive('miseczki') ? getGuidePartColor('miseczki') : '#1e293b'}
                strokeWidth="1"
                strokeDasharray="3 2"
                style={{ transition: 'all 0.25s' }}
              />
              <path
                d="M 745 245 Q 655 285, 565 310"
                fill="none"
                stroke={isPartActive('miseczki') ? getGuidePartColor('miseczki') : '#1e293b'}
                strokeWidth={isPartActive('miseczki') ? '3.5' : '1.8'}
                style={{ transition: 'all 0.25s' }}
              />
              <path
                d="M 745 248 Q 655 288, 565 313"
                fill="none"
                stroke={isPartActive('miseczki') ? getGuidePartColor('miseczki') : '#1e293b'}
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
              onMouseEnter={() => setHoveredPartId('guma_obszywkowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_obszywkowa'))}
            >
              {/* Symmetrical vertical side seams denoting the wing attachment */}
              <line x1="180" y1="254" x2="180" y2="333" stroke="#1e293b" strokeWidth="1.8" />
              <line x1="820" y1="254" x2="820" y2="333" stroke="#1e293b" strokeWidth="1.8" />

              {/* Underband Picot Elastic along the entire lower base of the wings */}
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
              onMouseEnter={() => setHoveredPartId('tunel_gorseciarski')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tunel_gorseciarski'))}
            >
              {/* Heavy plush double-line seam covering the underwires */}
              <path
                d="M 255 245 C 275 350, 445 355, 465 250"
                style={getLineStyle('tunel_gorseciarski', 8.5)}
              />
              <path
                d="M 745 245 C 725 350, 555 355, 535 250"
                style={getLineStyle('tunel_gorseciarski', 8.5)}
              />

              {/* Technical dashed parallel lines signifying the underwire stitch lines */}
              <path
                d="M 253 245 C 273 353, 447 358, 467 250"
                fill="none"
                stroke={isPartActive('tunel_gorseciarski') ? getGuidePartColor('tunel_gorseciarski') : '#475569'}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                style={{ transition: 'all 0.25s' }}
              />
              <path
                d="M 747 245 C 727 353, 553 358, 533 250"
                fill="none"
                stroke={isPartActive('tunel_gorseciarski') ? getGuidePartColor('tunel_gorseciarski') : '#475569'}
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
              onMouseEnter={() => setHoveredPartId('fiszbiny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('fiszbiny'))}
            >
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
            {/* LAYER 11: DESIGNER SHOULDER STRAPS (guma_ramiackowa)       */}
            {/* ========================================================= */}
            <g
              id="part-straps-elastic"
              onMouseEnter={() => setHoveredPartId('guma_ramiackowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_ramiackowa'))}
              style={{ cursor: 'pointer' }}
            >
              {/* Left Strap */}
              <path
                d="M 360 140 C 352 90, 275 36, 175 51 C 115 63, 80 137, 85 300"
                fill="none"
                stroke={(isPartActive('guma_ramiackowa') || isPartSelected('guma_ramiackowa')) ? getGuidePartColor('guma_ramiackowa') : '#1e293b'}
                strokeWidth={isPartActive('guma_ramiackowa') ? 11 : 9}
                style={{ transition: 'all 0.2s' }}
              />
              <path
                d="M 360 140 C 352 90, 275 36, 175 51 C 115 63, 80 137, 85 300"
                fill="none"
                stroke={isPartSelected('guma_ramiackowa') ? getGuidePartColor('guma_ramiackowa') : (isPartActive('guma_ramiackowa') ? `${getGuidePartColor('guma_ramiackowa')}20` : '#ffffff')}
                strokeWidth={isPartActive('guma_ramiackowa') ? 7 : 6}
                style={{ transition: 'all 0.2s' }}
              />

              {/* Right Strap */}
              <path
                d="M 640 130 C 648 80, 725 36, 825 51 C 885 63, 920 137, 915 300"
                fill="none"
                stroke={(isPartActive('guma_ramiackowa') || isPartSelected('guma_ramiackowa')) ? getGuidePartColor('guma_ramiackowa') : '#1e293b'}
                strokeWidth={isPartActive('guma_ramiackowa') ? 11 : 9}
                style={{ transition: 'all 0.2s' }}
              />
              <path
                d="M 640 130 C 648 80, 725 36, 825 51 C 885 63, 920 137, 915 300"
                fill="none"
                stroke={isPartSelected('guma_ramiackowa') ? getGuidePartColor('guma_ramiackowa') : (isPartActive('guma_ramiackowa') ? `${getGuidePartColor('guma_ramiackowa')}20` : '#ffffff')}
                strokeWidth={isPartActive('guma_ramiackowa') ? 7 : 6}
                style={{ transition: 'all 0.2s' }}
              />

              {/* Left peak horizontal connection stitch */}
              <line x1="352" y1="140" x2="368" y2="140" stroke="#1e293b" strokeWidth="1.8" />
              <line x1="352" y1="142" x2="368" y2="142" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 1" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 12: METAL RING HARDWARE ASYMMETRICAL (kolka)        */}
            {/* ========================================================= */}
            <g
              id="part-hardware-rings"
              onMouseEnter={() => setHoveredPartId('kolka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kolka'))}
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
                stroke={(isPartActive('kolka') || isPartSelected('kolka')) ? getGuidePartColor('kolka') : '#1e293b'}
                strokeWidth={isPartActive('kolka') ? '3.5' : '1.8'}
                style={{ transition: 'all 0.2s' }}
              />
              <circle
                cx="640"
                cy="140"
                r="7.5"
                fill="none"
                stroke={(isPartActive('kolka') || isPartSelected('kolka')) ? getGuidePartColor('kolka') : '#1e293b'}
                strokeWidth="1"
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 13: ADJUSTABLE STRAP HARDWARE / BRACKETS (regulatory) */}
            {/* ========================================================= */}
            <g
              id="part-hardware-adjusters"
              onMouseEnter={() => setHoveredPartId('regulatory')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('regulatory'))}
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
                  fill={isPartSelected('regulatory') ? getGuidePartColor('regulatory') : (isPartActive('regulatory') ? getGuidePartColor('regulatory') : '#ffffff')}
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
                  fill={isPartSelected('regulatory') ? getGuidePartColor('regulatory') : (isPartActive('regulatory') ? getGuidePartColor('regulatory') : '#ffffff')}
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
              onMouseEnter={() => setHoveredPartId('kokardka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kokardka'))}
              style={{ cursor: 'pointer' }}
            >
              {/* Centered on center front bridge upper region */}
              <g transform="translate(500, 252)">
                <path
                  d="M 0 0 C -12 -12, -15 8, 0 0 Z"
                  fill={isPartSelected('kokardka') ? getGuidePartColor('kokardka') : (isPartActive('kokardka') ? getGuidePartColor('kokardka') : '#f43f5e')}
                  stroke="#be123c"
                  strokeWidth="0.8"
                />
                <path
                  d="M 0 0 C 12 -12, 15 8, 0 0 Z"
                  fill={isPartSelected('kokardka') ? getGuidePartColor('kokardka') : (isPartActive('kokardka') ? getGuidePartColor('kokardka') : '#f43f5e')}
                  stroke="#be123c"
                  strokeWidth="0.8"
                />
                <path d="M 0 0 Q -4 12, -8 18" fill="none" stroke={isPartSelected('kokardka') ? getGuidePartColor('kokardka') : (isPartActive('kokardka') ? getGuidePartColor('kokardka') : '#be123c')} strokeWidth="1.8" />
                <path d="M 0 0 Q 4 12, 8 18" fill="none" stroke={isPartSelected('kokardka') ? getGuidePartColor('kokardka') : (isPartActive('kokardka') ? getGuidePartColor('kokardka') : '#be123c')} strokeWidth="1.8" />
                <circle cx="0" cy="0" r="3.2" fill={isPartSelected('kokardka') ? getGuidePartColor('kokardka') : (isPartActive('kokardka') ? getGuidePartColor('kokardka') : '#be123c')} />
              </g>
            </g>

            {/* ======================================================================= */}
            {/* MICROSCOPIC ACCURATE ANNOTATIONS (Perfect match of the drawing text!)  */}
            {/* ======================================================================= */}
            {showLabels && (
              <g id="technical-annotations" style={{ pointerEvents: 'none', transition: 'all 0.3s' }}>
                
                {/* 1. Strap Elastic - Guma ramiączkowa */}
                <path d="M 230 100 L 195 85" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="235" y="104" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="start">guma ramiączkowa</text>

                <path d="M 770 100 L 805 85" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="765" y="104" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="end">guma ramiączkowa</text>

                {/* 2. Top cup with strap extension / Neckline elastic */}
                <path d="M 430 160 L 372 148" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="438" y="164" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569">guma obszywkowa</text>

                {/* 3. top cup - Tkanina lub koronka */}
                <text x="350" y="205" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>
                <text x="650" y="205" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>

                {/* 4. Neckline - Górna guma obszywkowa */}
                <path d="M 500 195 C 485 205, 465 210, 442 214" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <path d="M 500 195 Q 520 205, 558 214" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="500" y="185" fontFamily="Montserrat, sans-serif" fontSize="11.5" fontWeight="bold" fill="#1e293b" textAnchor="middle">guma obszywkowa (dekolt)</text>

                {/* 5. Lower cup - Dolna część miseczki */}
                <text x="350" y="290" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>
                <text x="650" y="290" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>

                {/* 6. Hook and eye closure - Haftka */}
                <path d="M 32 310 L 71 310" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="26" y="313" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="end">haftka (zapięcie)</text>

                <path d="M 968 310 L 929 310" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="974" y="313" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="start">haftka (zapięcie)</text>

                {/* 7. Wings - Skrzydełko obwodu */}
                <text x="145" y="310" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">skrzydełko obwodu</text>
                <text x="855" y="310" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">skrzydełko obwodu</text>

                {/* 8. Underband - Dolna guma obszywkowa */}
                <path d="M 80 415 C 100 385, 120 355, 130 338" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="75" y="428" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="end">guma obszywkowa (dół)</text>

                <path d="M 920 415 C 900 385, 880 355, 870 338" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="925" y="428" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="start">guma obszywkowa (dół)</text>

                {/* 9. Underwire casing - Tunel gorseciarski */}
                <path d="M 220 425 C 250 395, 270 365, 285 330" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="220" y="440" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                <path d="M 780 425 C 750 395, 730 365, 715 330" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="780" y="440" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                {/* 10. Underwires - Fiszbiny */}
                <path d="M 380 425 C 375 395, 365 375, 355 344" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="380" y="440" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                <path d="M 620 425 C 625 395, 635 375, 645 344" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="620" y="440" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                {/* 11. Center Gore - Mostek */}
                <text x="500" y="305" fontFamily="Montserrat, sans-serif" fontSize="11.5" fontWeight="bold" fill="#1e293b" textAnchor="middle">mostek</text>

                {/* 12. Mostek do miseczki */}
                <path d="M 458 410 C 470 395, 480 375, 488 350" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="454" y="424" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="middle">mostek do miseczki</text>

                {/* 13. Rings - Kółka */}
                <path d="M 720 140 L 655 140" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="728" y="144" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#334155">kółko (łącznik)</text>

                {/* 14. Bust apex - Szczyt piersi */}
                <path d="M 730 220 L 657 275" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="738" y="224" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#334155">szczyt piersi (apex)</text>

                {/* 15. Side Seam & Short Bones - Szew boczny / Fiszbiny krótkie */}
                <text x="180" y="235" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">szew boczny</text>
                <text x="180" y="247" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny krótkie</text>

                <text x="820" y="235" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">szew boczny</text>
                <text x="820" y="247" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny krótkie</text>

                {/* 16. Sliders - Regulatory */}
                <path d="M 175 33 L 230 35" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="168" y="36" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="end">regulatory</text>

                <path d="M 825 33 L 785 35" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#pointer-arrow)" />
                <text x="832" y="36" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600" fill="#475569" textAnchor="start">regulatory</text>
              </g>
            )}
          </svg>
          <span className="view-label">Anatomia Biustonosza (Rysunek płaski)</span>
        </div>
      </div>
    );
  };

  // Render Panties (Majtki) SVGs
  const renderMajtki = () => {
    const mainColor = getPartColor('fabric');
    const extraColor = getPartColor('fabric_extra', '#eae8e3'); // additional decorative panel
    const laceColor = getPartColor('lace');
    const gussetColor = getPartColor('gusset', '#e2ded5'); // Bawełna na klin
    const elasticColor = getPartColor('elastic_trim');
    const threadColor = getPartColor('threads', '#888');

    return (
      <div className="garment-visualizer">
        {/* FRONT VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 30)">
              {/* Front main fabric panel */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 C 205,100 170,160 155,185 C 145,188 115,188 105,185 C 90,160 55,100 40,60 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Decorative Material 2 Panels (fabric_extra) */}
              <path
                d="M 60,61 C 75,90 90,110 100,120 L 100,62 Z"
                fill={extraColor}
                stroke={getPartStroke('fabric_extra')}
                strokeWidth={getPartStrokeWidth('fabric_extra')}
                className="interactive-part"
                onClick={() => onPartClick('fabric_extra')}
              />
              <path
                d="M 200,61 C 185,90 170,110 160,120 L 160,62 Z"
                fill={extraColor}
                stroke={getPartStroke('fabric_extra')}
                strokeWidth={getPartStrokeWidth('fabric_extra')}
                className="interactive-part"
                onClick={() => onPartClick('fabric_extra')}
              />

              {/* Decorative Lace Inserts on the sides */}
              <path
                d="M 40,60 C 48,72 58,88 68,102 C 60,95 50,80 40,60 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />
              <path
                d="M 220,60 C 212,72 202,88 192,102 C 200,95 210,80 220,60 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Gusset (klin) outline visible inside front */}
              <path
                d="M 107,175 C 115,145 145,145 153,175 C 150,182 110,182 107,175 Z"
                fill={gussetColor}
                stroke={getPartStroke('gusset')}
                strokeWidth={getPartStrokeWidth('gusset')}
                strokeDasharray="3,3"
                className="interactive-part"
                onClick={() => onPartClick('gusset')}
              />

              {/* Waistband Elastic Trim */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 L 220,63 C 195,68 65,68 40,63 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Left leg opening elastic */}
              <path
                d="M 40,60 C 55,100 90,160 105,185 L 103,186 C 88,161 53,101 38,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Right leg opening elastic */}
              <path
                d="M 220,60 C 205,100 170,160 155,185 L 157,186 C 172,161 207,101 222,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Thread stitches lines */}
              <path
                d="M 45,67 C 70,71 190,71 215,67"
                fill="none"
                stroke={threadColor}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
            </g>
          </svg>
          <span className="view-label">Przód</span>
        </div>

        {/* BACK VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 30)">
              {/* Back main panel (usually wider coverage) */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 C 200,110 168,170 155,185 C 145,188 115,188 105,185 C 92,170 60,110 40,60 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Waistband Elastic Trim */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 L 220,63 C 195,68 65,68 40,63 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Left leg opening elastic */}
              <path
                d="M 40,60 C 60,110 92,170 105,185 L 103,186 C 90,171 58,111 38,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Right leg opening elastic */}
              <path
                d="M 220,60 C 200,110 168,170 155,185 L 157,186 C 170,171 202,111 222,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />
            </g>
          </svg>
          <span className="view-label">Tył</span>
        </div>
      </div>
    );
  };

  // Render Bralette (Bralet) SVGs
  const renderBralet = () => {
    const mainColor = getPartColor('fabric'); // Main cup lining / elastyczny tiul
    const laceColor = getPartColor('lace');   // Lace cups
    const elasticColor = getPartColor('elastic_trim');
    const strapColor = getPartColor('elastic_strap');
    const ringColor = getPartColor('ring', '#d1d5db');
    const sliderColor = getPartColor('slider', '#d1d5db');
    const closureColor = getPartColor('closure');
    const bowColor = getPartColor('bow');
    const insertColor = getPartColor('cup_insert', 'rgba(255, 255, 255, 0.4)');
    const underwireColor = getPartColor('underwire', '#bfb5a8');
    const tunnelColor = getPartColor('tunnel', '#e2ded5');

    return (
      <div className="garment-visualizer">
        {/* FRONT VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 20)">
              {/* Back wing elastics visible on sides */}
              <line x1="30" y1="145" x2="80" y2="145" stroke={elasticColor} strokeWidth="6" />
              <line x1="180" y1="145" x2="230" y2="145" stroke={elasticColor} strokeWidth="6" />

              {/* Left Triangle Cup (Main Lace) */}
              <path
                d="M 80,145 L 130,145 L 105,65 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Left Cup Inside Insert outline (visible) */}
              <path
                d="M 85,142 L 125,142 L 105,80 Z"
                fill={insertColor}
                stroke={getPartStroke('cup_insert')}
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="interactive-part"
                onClick={() => onPartClick('cup_insert')}
              />

              {/* Right Triangle Cup (Main Lace) */}
              <path
                d="M 130,145 L 180,145 L 155,65 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Right Cup Inside Insert outline */}
              <path
                d="M 135,142 L 175,142 L 155,80 Z"
                fill={insertColor}
                stroke={getPartStroke('cup_insert')}
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="interactive-part"
                onClick={() => onPartClick('cup_insert')}
              />

              {/* Bralet side underwires (underwire & tunnel) */}
              <line 
                x1="80" y1="145" x2="80" y2="110" 
                stroke={tunnelColor} 
                strokeWidth={selectedPartId === 'tunnel' ? '4' : '2.5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
              />
              <line 
                x1="80" y1="141" x2="80" y2="114" 
                stroke={underwireColor} 
                strokeWidth={selectedPartId === 'underwire' ? '2.5' : '1.5'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
              />

              <line 
                x1="180" y1="145" x2="180" y2="110" 
                stroke={tunnelColor} 
                strokeWidth={selectedPartId === 'tunnel' ? '4' : '2.5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
              />
              <line 
                x1="180" y1="141" x2="180" y2="114" 
                stroke={underwireColor} 
                strokeWidth={selectedPartId === 'underwire' ? '2.5' : '1.5'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
              />

              {/* Underband Elastic Band (Front bottom band) */}
              <rect
                x="80" y="145" width="100" height="6"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Straps (Front) */}
              <rect
                x="103" y="15" width="4" height="50"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />
              <rect
                x="153" y="15" width="4" height="50"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />

              {/* Center bow */}
              <circle
                cx="130" cy="144" r="3.5"
                fill={bowColor}
                stroke={getPartStroke('bow')}
                strokeWidth={getPartStrokeWidth('bow')}
                className="interactive-part"
                onClick={() => onPartClick('bow')}
              />
            </g>
          </svg>
          <span className="view-label">Przód</span>
        </div>

        {/* BACK VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 20)">
              {/* Back Mesh/Lining Band Wings (fabric) */}
              <path
                d="M 30,139 C 55,143 95,145 120,145 L 120,154 C 95,154 55,150 30,144 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />
              <path
                d="M 230,139 C 205,143 165,145 140,145 L 140,154 C 165,154 205,150 230,144 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Hook Closure (Back center) */}
              <rect
                x="120" y="139" width="20" height="16"
                fill={closureColor}
                stroke={getPartStroke('closure')}
                strokeWidth={getPartStrokeWidth('closure')}
                className="interactive-part"
                onClick={() => onPartClick('closure')}
              />

              {/* Straps (Back) */}
              <rect
                x="70" y="15" width="4" height="126"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />
              <rect
                x="186" y="15" width="4" height="126"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />

              {/* Rings */}
              <circle
                cx="72" cy="141" r="4"
                fill="none"
                stroke={ringColor}
                strokeWidth={getPartStrokeWidth('ring')}
                className="interactive-part"
                onClick={() => onPartClick('ring')}
              />
              <circle
                cx="188" cy="141" r="4"
                fill="none"
                stroke={ringColor}
                strokeWidth={getPartStrokeWidth('ring')}
                className="interactive-part"
                onClick={() => onPartClick('ring')}
              />

              {/* Sliders */}
              <rect
                x="69" y="60" width="6" height="3"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
              />
              <rect
                x="185" y="60" width="6" height="3"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
              />
            </g>
          </svg>
          <span className="view-label">Tył</span>
        </div>
      </div>
    );
  };

  switch (garmentType) {
    case 'majtki':
      return renderMajtki();
    case 'bralet':
      return renderBralet();
    case 'biustonosz':
    default:
      return renderBiustonosz();
  }
}
