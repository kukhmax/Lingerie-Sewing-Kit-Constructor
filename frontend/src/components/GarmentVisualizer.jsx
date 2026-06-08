import React, { useState } from 'react';
import { BRA_PARTS_DATA, ARROWS_DATA } from './BraPathData';
import braBackground from './bra_background.png';

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
    const mapPartIdToMainId = (id) => {
      if (id.includes('material_glowny_3_left_outer') || id.includes('material_glowny_3_right_outer')) {
        return selectedPartId === 'fabric_stable' ? 'fabric_stable' : 'fabric_elastic';
      }
      if (id.includes('material_glowny_3_left_center') || id.includes('material_glowny_3_right_center')) {
        return selectedPartId === 'fabric_elastic' ? 'fabric_elastic' : 'fabric_stable';
      }
      if (id.includes('material_glowny_3_left_inner') || id.includes('material_glowny_3_right_inner')) {
        return selectedPartId === 'lace_stable' ? 'lace_stable' : 'lace_elastic';
      }
      if (id === 'material_glowny_1') return 'tulle_elastic';
      if (id === 'material_glowny_2') return 'tulle_stable';
      if (id === 'kolardka') return 'fabric_stable';
      if (id === 'guma_ramiackowa') return 'elastic_strap';
      if (id === 'kolka') return 'ring';
      if (id === 'regulatory') return 'slider';
      if (id === 'haftka') return 'closure';
      if (id === 'fiszbiny_krotkie') return 'underwire';
      if (id === 'tunel_gorseciarski') return 'tunnel';
      if (id === 'guma_obszywkowa') return 'elastic_trim';
      return id;
    };

    const getPairedId = (id) => {
      if (id.includes('left')) {
        return id.replace('left', 'right');
      }
      if (id.includes('right')) {
        return id.replace('right', 'left');
      }
      return null;
    };

    const getPartColorForCategory = (cat, defaultColor = '#ffffff') => {
      if (cat.includes('material_glowny_3_left_outer') || cat.includes('material_glowny_3_right_outer') ||
          cat.includes('material_glowny_3_left_center') || cat.includes('material_glowny_3_right_center')) {
        return partColors.fabric_stable || partColors.fabric_elastic || partColors.fabric || defaultColor;
      }
      if (cat.includes('material_glowny_3_left_inner') || cat.includes('material_glowny_3_right_inner')) {
        return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultColor;
      }
      if (cat === 'material_glowny_1') {
        return partColors.tulle_elastic || partColors.fabric_elastic || defaultColor;
      }
      if (cat === 'material_glowny_2') {
        return partColors.tulle_stable || defaultColor;
      }
      if (cat === 'kolardka') {
        return partColors.fabric_stable || partColors.tulle_stable || defaultColor;
      }
      
      const mainId = mapPartIdToMainId(cat);
      return partColors[mainId] || defaultColor;
    };

    const isPartSelected = (cat) => {
      const mainId = mapPartIdToMainId(cat);
      return !!partColors[mainId];
    };

    const isPartActive = (cat) => {
      const mainId = mapPartIdToMainId(cat);
      if (hoveredPartId === cat || getPairedId(cat) === hoveredPartId) {
        return true;
      }
      if (selectedPartId === mainId) {
        return true;
      }
      if ((selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable') && 
          (cat.includes('material_glowny_3_left_inner') || cat.includes('material_glowny_3_right_inner'))) {
        return true;
      }
      if ((selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable') && 
          (cat.includes('material_glowny_3_left_center') || cat.includes('material_glowny_3_right_center') ||
           cat.includes('material_glowny_3_left_outer') || cat.includes('material_glowny_3_right_outer'))) {
        return true;
      }
      if (selectedPartId === 'tulle_elastic' && cat === 'material_glowny_1') {
        return true;
      }
      if (selectedPartId === 'tulle_stable' && cat === 'material_glowny_2') {
        return true;
      }
      return false;
    };

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
            viewBox="0 0 1536 1085.25"
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

            {/* LAYER 0: The high-resolution bra background PNG drawing */}
            <g transform="matrix(0.511397, 0, 0, 0.511316, 1.026503, 0.0000399724)">
              <image href={braBackground} x="0" y="0" width="3000" height="2121" />
            </g>

            {/* LAYER 1: Interactive Background Fills & Outlines for each Category */}
            {Object.keys(BRA_PARTS_DATA).map((cat) => {
              const mainId = mapPartIdToMainId(cat);
              const color = getPartColorForCategory(cat);
              const active = isPartActive(cat);
              
              const isHovered = hoveredPartId === cat || getPairedId(cat) === hoveredPartId;
              const hasColor = !!partColors[mainId];
              
              let fillOpacity = 0.0;
              if (hasColor) {
                fillOpacity = 0.55; // blend overlay opacity
              } else if (isHovered || active) {
                fillOpacity = 0.25; // hover overlay opacity
              }
              
              let fillStyle = {
                transition: 'fill-opacity 0.2s ease, fill 0.2s ease',
                mixBlendMode: 'multiply', // blend mode to keep seams and shading visible underneath
                cursor: 'pointer'
              };
              
              return (
                <g
                  key={`part-group-${cat}`}
                  onMouseEnter={() => setHoveredPartId(cat)}
                  onMouseLeave={() => setHoveredPartId(null)}
                  onClick={() => onPartClick(mainId)}
                >
                  {/* Closed Fill Paths (blend color & handle hover fill) */}
                  {BRA_PARTS_DATA[cat].fills.map((d, fIdx) => (
                    <path
                      key={`fill-${cat}-${fIdx}`}
                      d={d}
                      fill={hasColor ? color : active ? '#c9a236' : '#ffffff'}
                      fillOpacity={fillOpacity}
                      style={fillStyle}
                    />
                  ))}
                  
                  {/* Highlight Outlines (po konturu) when active/hovered */}
                  {active && BRA_PARTS_DATA[cat].fills.map((d, oIdx) => (
                    <path
                      key={`contour-highlight-${cat}-${oIdx}`}
                      d={d}
                      fill="none"
                      stroke="#c9a236"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                    />
                  ))}
                </g>
              );
            })}

            {/* LAYER 3: Vector labels and pointers from arrows.svg */}
            {showLabels && (
              <g id="technical-annotations" style={{ pointerEvents: 'none', transition: 'all 0.3s' }}>
                {ARROWS_DATA.map((el, idx) => (
                  <path
                    key={`arrow-path-${idx}`}
                    d={el.d}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    transform={el.transform}
                    fillOpacity={el.fillOpacity}
                    strokeOpacity={el.strokeOpacity}
                  />
                ))}
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
