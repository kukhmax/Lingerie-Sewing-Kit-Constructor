import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// SVG Bra Parts Configuration
// Maps SVG file names to constructor part IDs for interactive behavior
// ============================================================================
const BRA_SVG_PARTS = [
  {
    id: 'lace',
    file: 'part_lace.svg',
    label: 'Koronka',
    mainIds: ['lace_elastic', 'lace_stable'],
  },
  {
    id: 'fabric',
    file: 'part_fabric.svg',
    label: 'Tkanina',
    mainIds: ['fabric_elastic', 'fabric_stable'],
  },
  {
    id: 'tulle_elastic',
    file: 'part_tulle_elastic.svg',
    label: 'Tiul elastyczny',
    mainIds: ['tulle_elastic'],
  },
  {
    id: 'tulle_stable',
    file: 'part_tulle_stable.svg',
    label: 'Tiul stabilny',
    mainIds: ['tulle_stable'],
  },
  {
    id: 'elastic_trim',
    file: 'part_elastic_trim.svg',
    label: 'Guma obszywkowa (obwód)',
    mainIds: ['elastic_trim'],
  },
  {
    id: 'elastic_strap',
    file: 'part_elastic_strap.svg',
    label: 'Guma ramiączkowa',
    mainIds: ['elastic_strap'],
  },
  {
    id: 'ring',
    file: 'part_ring.svg',
    label: 'Kółka metalowe',
    mainIds: ['ring'],
  },
  {
    id: 'slider',
    file: 'part_slider.svg',
    label: 'Regulatory metalowe',
    mainIds: ['slider'],
  },
  {
    id: 'closure',
    file: 'part_closure.svg',
    label: 'Zapięcie haftkowe',
    mainIds: ['closure'],
  },
  {
    id: 'underwire',
    file: 'part_underwire.svg',
    label: 'Fiszbiny metalowe',
    mainIds: ['underwire'],
  },
  {
    id: 'tunnel',
    file: 'part_tunnel.svg',
    label: 'Tunel gorseciarski',
    mainIds: ['tunnel'],
  },
  {
    id: 'bow',
    file: 'part_bow.svg',
    label: 'Kokardka ozdobna',
    mainIds: ['bow'],
  },
];

// SVG content cache (module-level to persist across re-renders)
const svgCache = {};

// ============================================================================
// GarmentVisualizer Component
// ============================================================================
// Props:
// - garmentType: 'biustonosz', 'majtki', 'bralet'
// - selectedPartId: string (e.g. 'fabric_elastic', 'elastic_trim')
// - onPartClick: function(partId)
// - partColors: object mapping partId -> hex color string
// - showLabels: boolean (toggle arrows/labels layer)
export default function GarmentVisualizer({
  garmentType,
  selectedPartId,
  onPartClick,
  partColors = {},
  showLabels = true
}) {
  const [hoveredPartId, setHoveredPartId] = useState(null);
  const [svgContents, setSvgContents] = useState({});
  const [loading, setLoading] = useState(true);

  // ---- SVG Loader ----
  useEffect(() => {
    if (garmentType !== 'biustonosz') return;

    let cancelled = false;

    const fetchSvg = async (url) => {
      if (svgCache[url]) return svgCache[url];
      try {
        const response = await fetch(url);
        const text = await response.text();
        svgCache[url] = text;
        return text;
      } catch (err) {
        console.error(`Failed to load SVG: ${url}`, err);
        return null;
      }
    };

    const loadAll = async () => {
      setLoading(true);

      // Load part SVGs directly without regex extraction
      const partContents = {};
      for (const part of BRA_SVG_PARTS) {
        const text = await fetchSvg(`/bra/${part.file}`);
        if (!cancelled && text) {
          partContents[part.id] = text;
        }
      }
      if (!cancelled) {
        setSvgContents(partContents);
      }

      if (!cancelled) setLoading(false);
    };

    loadAll();
    return () => { cancelled = true; };
  }, [garmentType]);

  // ---- Helper Functions (shared) ----
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

  // ---- Bra Visualizer ----
  const renderBiustonosz = () => {
    // Check if a part's mainIds overlap with selectedPartId
    const isPartActive = (part) => {
      if (hoveredPartId === part.id) return true;
      return part.mainIds.includes(selectedPartId);
    };

    // Check if any mainId has a color assigned
    const hasPartColor = (part) => {
      return part.mainIds.some(id => !!partColors[id]);
    };

    // Get the first assigned color for a part
    const getAssignedColor = (part) => {
      for (const id of part.mainIds) {
        if (partColors[id]) return partColors[id];
      }
      return null;
    };

    // Get the primary mainId to pass to onPartClick
    const getPrimaryMainId = (part) => {
      // If selectedPartId matches one of this part's mainIds, use it
      if (part.mainIds.includes(selectedPartId)) return selectedPartId;
      // Otherwise use the first mainId
      return part.mainIds[0];
    };

    // Get hover label for the currently hovered part
    const getHoverLabel = () => {
      if (!hoveredPartId) return null;
      const part = BRA_SVG_PARTS.find(p => p.id === hoveredPartId);
      return part ? part.label : null;
    };

    if (loading) {
      return (
        <div className="garment-visualizer" style={{ flexDirection: 'column', padding: '1.5rem', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: '#94a3b8',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}>
            <span className="pulse-dot" style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ec4899',
              marginRight: '8px',
            }} />
            Ładowanie modelu wektorowego...
          </div>
        </div>
      );
    }

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
              ) : hoveredPartId ? (
                <span style={{ color: '#c9a236' }}>{getHoverLabel()}</span>
              ) : (
                <span>Najedź lub kliknij część, by wyodrębnić</span>
              )}
            </div>
          </div>

          {/* Interactive SVG Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            {/* LAYER 0: Base biustonosz.svg (always visible, non-interactive) */}
            <img 
              src="/bra/biustonosz.svg" 
              alt="Anatomia biustonosza" 
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

            {/* LAYER 1: Interactive Part Overlays */}
            {BRA_SVG_PARTS.map((part) => {
              const active = isPartActive(part);
              const colored = hasPartColor(part);
              const assignedColor = getAssignedColor(part);
              const isHovered = hoveredPartId === part.id;

              // Part is visible when hovered, active (selected), or has assigned color
              const isVisible = isHovered || active || colored;

              // Determine fill color for the paths of this SVG
              let pathFill = 'transparent';
              if (colored && assignedColor) {
                pathFill = assignedColor;
              } else if (active || isHovered) {
                pathFill = '#c9a236'; // Premium Gold highlight
              }

              // Determine mix blend mode and opacity for rendering
              let mixBlendMode = 'normal';
              let opacity = 0;

              if (isVisible) {
                if (colored && assignedColor) {
                  mixBlendMode = 'multiply';
                  opacity = isHovered ? 0.65 : active ? 0.6 : 0.45;
                } else {
                  // If just active/hovered (not colored), show gold overlay
                  mixBlendMode = 'multiply';
                  opacity = isHovered ? 0.45 : 0.35;
                }
              }

              const svgInnerHtml = svgContents[part.id];

              // Skip rendering if not loaded yet
              if (!svgInnerHtml) return null;

              return (
                <div key={part.id}>
                  <style dangerouslySetInnerHTML={{ __html: `
                    .part-svg-${part.id} path {
                      fill: ${pathFill} !important;
                      transition: fill 0.25s ease;
                    }
                  `}} />
                  <svg
                    viewBox="0 0 2048 1447"
                    className={`part-svg-${part.id}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none', // SVG container ignores clicks
                      zIndex: isHovered ? 10 : active ? 5 : 1,
                      opacity: opacity,
                      mixBlendMode: mixBlendMode,
                      transition: 'opacity 0.25s ease, filter 0.25s ease',
                      filter: active || isHovered 
                        ? 'drop-shadow(0 0 4px #c9a236) drop-shadow(0 0 8px rgba(201,162,54,0.4))'
                        : 'none',
                    }}
                  >
                    <g
                      style={{
                        pointerEvents: 'auto', // Paths catch mouse moves/clicks
                        cursor: 'pointer',
                      }}
                      onClick={() => onPartClick(getPrimaryMainId(part))}
                      onMouseEnter={() => setHoveredPartId(part.id)}
                      onMouseLeave={() => setHoveredPartId(null)}
                      dangerouslySetInnerHTML={{ __html: svgInnerHtml }}
                    />
                  </svg>
                </div>
              );
            })}

            {/* LAYER 2: Arrows / Labels */}
            <img
              src="/bra/arrows.svg"
              alt="Opisy części"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                userSelect: 'none',
                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                opacity: showLabels ? 1 : 0,
                visibility: showLabels ? 'visible' : 'hidden',
                zIndex: 20,
              }}
            />
          </div>
          
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
