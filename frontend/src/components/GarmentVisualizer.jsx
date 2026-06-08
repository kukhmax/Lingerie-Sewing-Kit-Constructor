import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// SVG Bra Parts Configuration (Hit-test priority from top to bottom)
// ============================================================================
const BRA_SVG_PARTS = [
  {
    id: 'bow',
    file: 'kokardka.svg',
    label: 'Kokardka ozdobna',
    mainIds: ['bow'],
  },
  {
    id: 'ring',
    file: 'kolka.svg',
    label: 'Kółka metalowe',
    mainIds: ['ring'],
  },
  {
    id: 'slider',
    file: 'regulatory.svg',
    label: 'Regulatory metalowe',
    mainIds: ['slider'],
  },
  {
    id: 'closure',
    file: 'haftki.svg',
    label: 'Zapięcie haftkowe',
    mainIds: ['closure'],
  },
  {
    id: 'underwire',
    file: 'fiszbiny.svg',
    label: 'Fiszbiny metalowe',
    mainIds: ['underwire'],
  },
  {
    id: 'tunnel',
    file: 'tunel_gorseciarski.svg',
    label: 'Tunel gorseciarski',
    mainIds: ['tunnel'],
  },
  {
    id: 'elastic_strap',
    file: 'guma_ramiackowa.svg',
    label: 'Guma ramiączkowa',
    mainIds: ['elastic_strap'],
  },
  {
    id: 'elastic_trim',
    file: 'gumy.svg',
    label: 'Guma obszywkowa (obwód)',
    mainIds: ['elastic_trim'],
  },
  {
    id: 'tulle_stable',
    file: 'material_glowny_2.svg',
    label: 'Tiul stabilny',
    mainIds: ['tulle_stable'],
  },
  {
    id: 'tulle_elastic',
    file: 'material_glowny_1.svg',
    label: 'Tiul elastyczny',
    mainIds: ['tulle_elastic'],
  },
  {
    id: 'fabric',
    file: 'material_glowny_3.svg',
    label: 'Tkanina',
    mainIds: ['fabric_elastic', 'fabric_stable'],
  },
  {
    id: 'lace',
    file: 'material_glowny_4.svg',
    label: 'Koronka',
    mainIds: ['lace_elastic', 'lace_stable'],
  },
];

// Global cache for preprocessed pixel hit-test grids
const hitTestCache = {};

// ============================================================================
// GarmentVisualizer Component
// ============================================================================
export default function GarmentVisualizer({
  garmentType,
  selectedPartId,
  onPartClick,
  partColors = {},
  showLabels = true
}) {
  const [hoveredPartId, setHoveredPartId] = useState(null);
  const [loadingHitTest, setLoadingHitTest] = useState(false);
  const hitTestGridsRef = useRef({});
  const containerRef = useRef(null);

  // ---- Hit Test Grid Preprocessing ----
  useEffect(() => {
    if (garmentType !== 'biustonosz') return;

    if (Object.keys(hitTestCache).length > 0) {
      hitTestGridsRef.current = hitTestCache;
      return;
    }

    let active = true;
    setLoadingHitTest(true);

    const loadGrids = async () => {
      const grids = {};
      const width = 512;
      const height = 362; // 1/4 of 2048x1447

      for (const part of BRA_SVG_PARTS) {
        if (!active) return;
        try {
          const img = new Image();
          img.src = `/bra/${part.file}`;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load ${part.file}`));
          });

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const imgData = ctx.getImageData(0, 0, width, height);
          const pixels = imgData.data;
          const grid = new Uint8Array(width * height);

          // 1. Thresholding: non-white pixels (luminance < 250) are part of the detail
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            if (r < 250 || g < 250 || b < 250) {
              grid[i / 4] = 1;
            }
          }

          // 2. 2D Dilation with radius 2 to expand clickable bounds and close gaps
          const dilatedGrid = new Uint8Array(width * height);
          const radius = 2;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              if (grid[y * width + x] === 1) {
                for (let dy = -radius; dy <= radius; dy++) {
                  for (let dx = -radius; dx <= radius; dx++) {
                    const ny = y + dy;
                    const nx = x + dx;
                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                      dilatedGrid[ny * width + nx] = 1;
                    }
                  }
                }
              }
            }
          }

          grids[part.id] = dilatedGrid;
        } catch (e) {
          console.error(`Error loading hit-test grid for ${part.id}:`, e);
        }
      }

      if (active) {
        Object.assign(hitTestCache, grids);
        hitTestGridsRef.current = grids;
        setLoadingHitTest(false);
      }
    };

    loadGrids();

    return () => {
      active = false;
    };
  }, [garmentType]);

  // ---- Helper Functions ----
  const getAssignedColor = (partId) => {
    const part = BRA_SVG_PARTS.find(p => p.id === partId);
    if (!part) return null;
    for (const id of part.mainIds) {
      if (partColors[id]) return partColors[id];
    }
    return null;
  };

  const getPartColor = (partId, defaultColor = '#ffffff') => {
    // 1. Hover has the absolute highest priority for highlighting
    if (hoveredPartId === partId) {
      return '#c9a236'; // Gold highlight
    }

    // 2. Otherwise return selected product color if assigned
    if (partId === 'fabric') {
      return partColors.fabric_elastic || partColors.fabric_stable || partColors.fabric || defaultColor;
    }
    if (partId === 'lace') {
      return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultColor;
    }
    const assigned = getAssignedColor(partId);
    if (assigned) return assigned;

    return defaultColor;
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

  const isPartActive = (part) => {
    return part.mainIds.includes(selectedPartId);
  };

  const hasPartColor = (part) => {
    return part.mainIds.some(id => !!partColors[id]);
  };

  const getPrimaryMainId = (part) => {
    if (part.mainIds.includes(selectedPartId)) return selectedPartId;
    return part.mainIds[0];
  };

  const getHoverLabel = () => {
    if (!hoveredPartId) return null;
    const part = BRA_SVG_PARTS.find(p => p.id === hoveredPartId);
    return part ? part.label : null;
  };

  // ---- Pixel Hit Testing ----
  const handleHitTest = useCallback((clientX, clientY) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    // Map local coordinates to 512x362 grid space
    const gridX = Math.round((localX / rect.width) * 512);
    const gridY = Math.round((localY / rect.height) * 362);

    if (gridX < 0 || gridX >= 512 || gridY < 0 || gridY >= 362) {
      return null;
    }

    const index = gridY * 512 + gridX;

    // Check grids in priority order (front/topmost first)
    for (const part of BRA_SVG_PARTS) {
      const grid = hitTestGridsRef.current[part.id];
      if (grid && grid[index] === 1) {
        return part.id;
      }
    }
    return null;
  }, []);

  const onMouseMove = (e) => {
    const hoveredPart = handleHitTest(e.clientX, e.clientY);
    setHoveredPartId(hoveredPart);
    if (hoveredPart) {
      e.currentTarget.style.cursor = 'pointer';
    } else {
      e.currentTarget.style.cursor = 'default';
    }
  };

  const onMouseLeave = () => {
    setHoveredPartId(null);
  };

  const onOverlayClick = (e) => {
    const clickedPartId = handleHitTest(e.clientX, e.clientY);
    if (clickedPartId) {
      const part = BRA_SVG_PARTS.find(p => p.id === clickedPartId);
      if (part) {
        onPartClick(getPrimaryMainId(part));
      }
    }
  };

  // ---- Bra Visualizer Rendering ----
  const renderBiustonosz = () => {
    if (loadingHitTest) {
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
            Wczytywanie makiety interaktywnej...
          </div>
        </div>
      );
    }

    return (
      <div className="garment-visualizer" style={{ flexDirection: 'column', padding: '1.5rem', alignItems: 'center' }}>
        <div className="view-section" style={{ width: '100%', maxWidth: '950px' }}>
          
          {/* Header Info Panel */}
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

          {/* Interactive SVG Stacking Container */}
          <div 
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1536 / 1085.25',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <svg
              viewBox="0 0 1536 1085.25"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              <defs>
                {/* Dynamically generated colorization filters for each part */}
                {BRA_SVG_PARTS.map(part => {
                  const color = getPartColor(part.id);
                  return (
                    <filter key={part.id} id={`colorize-${part.id}`} colorInterpolationFilters="sRGB">
                      {/* Step 1: Make white background transparent.
                           Alpha = 3 - R - G - B
                      */}
                      <feColorMatrix type="matrix" values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        -1 -1 -1 0 3
                      " result="transmask"/>

                      {/* Step 2: Steep threshold to keep lines solid and remove background noise */}
                      <feComponentTransfer in="transmask" result="alpha-mask">
                        <feFuncA type="linear" slope="20" intercept="-1"/>
                      </feComponentTransfer>

                      {/* Step 3: Flood with selected color */}
                      <feFlood flood-color={color} flood-opacity="1" result="floodColor"/>

                      {/* Step 4: Multiply color over grayscale texture (preserves lines/shading) */}
                      <feBlend mode="multiply" in="SourceGraphic" in2="floodColor" result="multiplied"/>

                      {/* Step 5: Composite back onto transparent alpha mask */}
                      <feComposite in="multiplied" in2="alpha-mask" operator="in"/>
                    </filter>
                  );
                })}
              </defs>

              {/* LAYER 0: Reference Base Outline */}
              <image href="/bra/biustonosz_caly.svg" x="0" y="0" width="1536" height="1085.25" />

              {/* LAYER 1: Colorized/Hovered Active Parts */}
              {BRA_SVG_PARTS.map(part => {
                const colored = hasPartColor(part);
                const isHovered = hoveredPartId === part.id;
                const isVisible = isHovered || colored;

                if (!isVisible) return null;

                let filterEffect = `url(#colorize-${part.id})`;

                // Add gold glow outline ONLY on hover
                if (isHovered) {
                  filterEffect += ' drop-shadow(0 0 4px #c9a236) drop-shadow(0 0 8px rgba(201,162,54,0.4))';
                }

                return (
                  <image
                    key={part.id}
                    href={`/bra/${part.file}`}
                    x="0"
                    y="0"
                    width="1536"
                    height="1085.25"
                    style={{
                      opacity: 1.0,
                      filter: filterEffect,
                      transition: 'filter 0.25s ease'
                    }}
                  />
                );
              })}

              {/* LAYER 2: Arrows / Labels (Dynamic Toggle) */}
              <image
                href="/bra/nazwy.svg"
                x="0"
                y="0"
                width="1536"
                height="1085.25"
                style={{
                  transition: 'opacity 0.3s ease, visibility 0.3s ease',
                  opacity: showLabels ? 1 : 0,
                  visibility: showLabels ? 'visible' : 'hidden'
                }}
              />
            </svg>

            {/* LAYER 3: Invisible Hit Test Capture Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 100,
                cursor: 'default'
              }}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onClick={onOverlayClick}
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
