import React, { useState } from 'react';
import BraOutlines from './BraOutlines';

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
            viewBox="0 0 3000 2121"
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
                markerWidth="12"
                markerHeight="12"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 10 5 L 0 8.5 Z" fill="#475569" />
              </marker>
            </defs>

            {/* Ambient drafting board style background grid */}
            <g stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="10 10" opacity="0.65">
              <line x1="1500" y1="50" x2="1500" y2="2070" />
              <line x1="100" y1="1060" x2="2900" y2="1060" />
              <line x1="450" y1="200" x2="2550" y2="1920" opacity="0.4" />
              <line x1="2550" y1="200" x2="450" y2="1920" opacity="0.4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 1: BACK WINGS / ELASTIC POWERNET (tiul_elastyczny)  */}
            {/* ========================================================= */}
            <g
              id="wing-left-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
              <path
                d="M 780,1280 C 500,1350 250,1400 60,1400 L 60,1500 C 250,1500 500,1480 780,1450 Z"
                style={getPartStyle('tiul_elastyczny')}
              />
            </g>

            <g
              id="wing-right-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
              <path
                d="M 2220,1280 C 2500,1350 2750,1400 2940,1400 L 2940,1500 C 2750,1500 2500,1480 2220,1450 Z"
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
              <path
                d="M 60,1400 L 20,1400 L 20,1500 L 60,1500 Z"
                style={getPartStyle('haftka')}
              />
              <path
                d="M 2940,1400 L 2980,1400 L 2980,1500 L 2940,1500 Z"
                style={getPartStyle('haftka')}
              />
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
                d="M 1440,1430 L 1560,1430 L 1500,1270 Z"
                style={getPartStyle('tiul_stabilny')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 4: LOWER CUPS (material)                            */}
            {/* ========================================================= */}
            <g
              id="part-lower-cups"
              onMouseEnter={() => setHoveredPartId('material')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('material'))}
            >
              <path
                d="M 1440,1430 C 1300,1620 1000,1620 780,1280 C 780,1280 1100,1180 1440,1430 Z"
                style={getPartStyle('material')}
              />
              <path
                d="M 1560,1430 C 1700,1620 2000,1620 2220,1280 C 2220,1280 1900,1180 1560,1430 Z"
                style={getPartStyle('material')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 5: UPPER CUPS INTRICATE PANELS (koronka)            */}
            {/* ========================================================= */}
            <g
              id="part-upper-cups-lace"
              onMouseEnter={() => setHoveredPartId('koronka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('koronka'))}
            >
              <path
                d="M 1440,1430 C 1100,1180 780,1280 C 780,1280 820,1050 860,920 C 1050,1100 1300,1200 1440,1270 Z"
                style={getPartStyle('koronka')}
              />
              <path
                d="M 1560,1430 C 1900,1180 2220,1280 C 2220,1280 2180,1050 2140,920 C 1950,1100 1700,1200 1560,1270 Z"
                style={getPartStyle('koronka')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 6: EDGE ENVELOPING ELASTICS (guma_obszywkowa)        */}
            {/* ========================================================= */}
            <g
              id="part-obszywkowa-band-elastics"
              onMouseEnter={() => setHoveredPartId('guma_obszywkowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_obszywkowa'))}
            >
              {/* Left & Right wing bottom elastics */}
              <path d="M 60,1500 C 250,1500 500,1480 780,1450" style={getLineStyle('guma_obszywkowa', 10)} />
              <path d="M 2940,1500 C 2750,1500 2500,1480 2220,1450" style={getLineStyle('guma_obszywkowa', 10)} />
              {/* Left & Right wing top elastics */}
              <path d="M 60,1400 C 250,1400 500,1350 780,1280" style={getLineStyle('guma_obszywkowa', 8)} />
              <path d="M 2940,1400 C 2750,1400 2500,1350 2220,1280" style={getLineStyle('guma_obszywkowa', 8)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 7: CHANNELS & WIRE CASING COVERS (tunel_gorseciarski) */}
            {/* ========================================================= */}
            <g
              id="part-wire-casing-tunnel"
              onMouseEnter={() => setHoveredPartId('tunel_gorseciarski')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tunel_gorseciarski'))}
            >
              <path d="M 1440,1430 C 1300,1620 1000,1620 780,1280" style={getLineStyle('tunel_gorseciarski', 26)} />
              <path d="M 1560,1430 C 1700,1620 2000,1620 2220,1280" style={getLineStyle('tunel_gorseciarski', 26)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 8: UNDERWIRES (fiszbiny)                             */}
            {/* ========================================================= */}
            <g
              id="part-metal-underwires"
              onMouseEnter={() => setHoveredPartId('fiszbiny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('fiszbiny'))}
            >
              <path d="M 1435,1425 C 1295,1615 1005,1615 785,1285" style={getLineStyle('fiszbiny', 10)} />
              <path d="M 1565,1425 C 1705,1615 1995,1615 2215,1285" style={getLineStyle('fiszbiny', 10)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 9: SHOULDER STRAPS (guma_ramiackowa)                */}
            {/* ========================================================= */}
            <g
              id="part-straps-elastic"
              onMouseEnter={() => setHoveredPartId('guma_ramiackowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_ramiackowa'))}
            >
              <path d="M 860,920 C 700,500 500,400 400,500 C 300,600 250,1000 250,1400" style={getLineStyle('guma_ramiackowa', 24)} />
              <path d="M 2140,920 C 2300,500 2500,400 2600,500 C 2700,600 2750,1000 2750,1400" style={getLineStyle('guma_ramiackowa', 24)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 10: RINGS (kolka)                                    */}
            {/* ========================================================= */}
            <g
              id="part-hardware-rings"
              onMouseEnter={() => setHoveredPartId('kolka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kolka'))}
            >
              <circle cx="860" cy="920" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="2140" cy="920" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="250" cy="1400" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="2750" cy="1400" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 11: SLIDERS (regulatory)                             */}
            {/* ========================================================= */}
            <g
              id="part-hardware-adjusters"
              onMouseEnter={() => setHoveredPartId('regulatory')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('regulatory'))}
            >
              <rect x="380" y="485" width="40" height="30" rx="6" style={getPartStyle('regulatory')} strokeWidth="4" />
              <rect x="2580" y="485" width="40" height="30" rx="6" style={getPartStyle('regulatory')} strokeWidth="4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 12: DECORATIVE BOW (kokardka)                        */}
            {/* ========================================================= */}
            <g
              id="part-ribbon-bow"
              onMouseEnter={() => setHoveredPartId('kokardka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kokardka'))}
            >
              <circle cx="1500" cy="1280" r="12" style={getPartStyle('kokardka')} strokeWidth="2.5" />
              <path d="M 1500,1280 C 1460,1240 1440,1320 1500,1280 Z" style={getPartStyle('kokardka')} strokeWidth="2" />
              <path d="M 1500,1280 C 1540,1240 1560,1320 1500,1280 Z" style={getPartStyle('kokardka')} strokeWidth="2" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 13: THE OUTLINE OVERLAY (185 Paths from SVG)         */}
            {/* ========================================================= */}
            <BraOutlines />

            {/* ========================================================= */}
            {/* LAYER 14: TECHNICAL LABELS AND POINTERS                    */}
            {/* ========================================================= */}
            {showLabels && (
              <g id="technical-annotations" style={{ pointerEvents: 'none', transition: 'all 0.3s' }}>
                {/* 1. Strap Elastic - Guma ramiączkowa */}
                <path d="M 700 400 L 440 480" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="715" y="410" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">guma ramiączkowa</text>

                <path d="M 2300 400 L 2560 480" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2285" y="410" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">guma ramiączkowa</text>

                {/* 2. Top cup neckline elastic - Guma obszywkowa (dekolt) */}
                <path d="M 1500 780 Q 1320 830 1150 1020" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <path d="M 1500 780 Q 1680 830 1850 1020" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1500" y="740" fontFamily="Montserrat, sans-serif" fontSize="30" fontWeight="bold" fill="#1e293b" textAnchor="middle">guma obszywkowa (dekolt)</text>

                {/* 3. Upper Cup - Tkanina lub koronka */}
                <text x="1100" y="1150" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>
                <text x="1900" y="1150" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>

                {/* 4. Lower Cup - Dolna część miseczki */}
                <text x="1100" y="1450" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>
                <text x="1900" y="1450" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>

                {/* 5. Hook and eye closure - Haftka */}
                <path d="M 220 1320 L 40 1430" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="235" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">haftka (zapięcie)</text>

                <path d="M 2780 1320 L 2960 1430" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2765" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">haftka (zapięcie)</text>

                {/* 6. Wings - Skrzydełko obwodu */}
                <path d="M 435 1320 L 400 1400" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="445" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">skrzydełko obwodu</text>

                <path d="M 2565 1320 L 2600 1400" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2555" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">skrzydełko obwodu</text>

                {/* 7. Underband - Dolna guma obszywkowa */}
                <path d="M 250 1780 L 400 1495" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="235" y="1810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">guma obszywkowa (dół)</text>

                <path d="M 2750 1780 L 2600 1495" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2765" y="1810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">guma obszywkowa (dół)</text>

                {/* 8. Underwire casing - Tunel gorseciarski */}
                <path d="M 660 1880 L 980 1560" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="650" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                <path d="M 2340 1880 L 2020 1560" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2350" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                {/* 9. Underwires - Fiszbiny */}
                <path d="M 1140 1880 L 1100 1590" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1140" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                <path d="M 1860 1880 L 1900 1590" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1860" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                {/* 10. Center Gore - Mostek */}
                <text x="1500" y="1320" fontFamily="Montserrat, sans-serif" fontSize="30" fontWeight="bold" fill="#1e293b" textAnchor="middle">mostek</text>

                {/* 11. Mostek do miseczki */}
                <path d="M 1362 1830 L 1435 1445" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1362" y="1860" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">mostek do miseczki</text>

                {/* 12. Rings - Kółka */}
                <path d="M 680 850 L 840 910" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="665" y="840" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#334155" textAnchor="end">kółko (łącznik)</text>

                <path d="M 2320 850 L 2160 910" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2335" y="840" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#334155" textAnchor="start">kółko (łącznik)</text>

                {/* 13. Sliders - Regulatory */}
                <path d="M 520 580 L 420 510" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="535" y="600" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">regulatory</text>

                <path d="M 2480 580 L 2580 510" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2465" y="600" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">regulatory</text>
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
