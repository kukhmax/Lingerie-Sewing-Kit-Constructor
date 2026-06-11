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
    id: 'edge_elastic',
    file: 'guma_stabilizujaca_krawedz.svg',
    label: 'Guma stabilizująca krawędź',
    mainIds: ['edge_elastic'],
  },
  {
    id: 'elastic_strap',
    file: 'guma_ramiackowa.svg',
    label: 'Guma ramiączkowa',
    mainIds: ['elastic_strap'],
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
    id: 'elastic_trim',
    file: 'gumy.svg',
    label: 'Guma obszywkowa (obwód)',
    mainIds: ['elastic_trim'],
  },
];

// ============================================================================
// SVG Bralet Parts Configuration (Hit-test priority and rendering order)
// ============================================================================
const BRALET_SVG_PARTS = [
  {
    id: 'band',
    file: 'pas_obwodu.svg',
    label: 'Pas obwodu',
    mainIds: ['fabric_elastic', 'fabric_stable', 'tulle_elastic', 'tulle_stable'],
  },
  {
    id: 'cups',
    file: 'miseczki.svg',
    label: 'Miseczki',
    mainIds: ['lace_elastic', 'lace_stable'],
  },
  {
    id: 'elastic_trim',
    file: 'guma_pod_biustem.svg',
    label: 'Guma pod biust',
    mainIds: ['elastic_trim'],
    isVector: true,
  },
  {
    id: 'elastic_strap',
    file: 'guma_ramiackowa.svg',
    label: 'Guma ramiączkowa',
    mainIds: ['elastic_strap'],
  },
  {
    id: 'closure',
    file: 'haftki.svg',
    label: 'Zapięcie haftkowe',
    mainIds: ['closure'],
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
];

// Global cache for preprocessed pixel hit-test grids per garment type
const hitTestCache = {
  biustonosz: null,
  bralet: null,
};

// Cache version string for SVG resources to prevent browser caching old outline/contour files
const CACHE_VERSION = '20260611_v9';

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
    if (garmentType !== 'biustonosz' && garmentType !== 'bralet') return;

    if (hitTestCache[garmentType]) {
      hitTestGridsRef.current = hitTestCache[garmentType];
      setLoadingHitTest(false);
      return;
    }

    let active = true;
    setLoadingHitTest(true);

    const loadGrids = async () => {
      const grids = {};
      const isBralet = garmentType === 'bralet';
      const width = isBralet ? 480 : 512;
      const height = isBralet ? 320 : 362;
      const parts = isBralet ? BRALET_SVG_PARTS : BRA_SVG_PARTS;
      const subDir = isBralet ? 'bralet' : 'bra';

      for (const part of parts) {
        if (!active) return;
        try {
          const img = new Image();
          img.src = `/${subDir}/${part.file}?v=${CACHE_VERSION}`;
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

          // 1. Thresholding: non-white pixels (luminance < 250) that are also not transparent (alpha > 10) are part of the detail.
          // Skip outer boundary pixels to prevent border highlighting.
          const borderMargin = 8;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              if (x < borderMargin || x >= width - borderMargin || y < borderMargin || y >= height - borderMargin) {
                continue;
              }
              const idx = (y * width + x) * 4;
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];
              const a = pixels[idx + 3];
              if (a > 10 && (r < 250 || g < 250 || b < 250)) {
                grid[y * width + x] = 1;
              }
            }
          }

          // 2. 2D Dilation with dynamic radius to expand clickable bounds.
          // Thin/small elements get radius = 4 for easier hover/click triggering.
          // Large filled elements get radius = 1 to avoid excessive bleed.
          const dilatedGrid = new Uint8Array(width * height);
          let radius = 1;
          if ([
            'edge_elastic',
            'elastic_trim',
            'elastic_strap',
            'ring',
            'slider',
            'closure',
            'underwire',
            'tunnel',
            'bow'
          ].includes(part.id)) {
            radius = 4;
          }

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
        hitTestCache[garmentType] = grids;
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
    const part = garmentType === 'bralet'
      ? BRALET_SVG_PARTS.find(p => p.id === partId)
      : BRA_SVG_PARTS.find(p => p.id === partId);
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
      case 'guma_stabilizujaca_krawedz':
        return 'edge_elastic';
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
      case 'edge_elastic': return 'Guma stabilizująca krawędź';
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
    const part = garmentType === 'bralet'
      ? BRALET_SVG_PARTS.find(p => p.id === hoveredPartId)
      : BRA_SVG_PARTS.find(p => p.id === hoveredPartId);
    return part ? part.label : null;
  };

  // ---- Pixel Hit Testing ----
  const handleHitTest = useCallback((clientX, clientY) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const isBralet = garmentType === 'bralet';
    const gridWidth = isBralet ? 480 : 512;
    const gridHeight = isBralet ? 320 : 362;

    // Map local coordinates to grid space
    const gridX = Math.round((localX / rect.width) * gridWidth);
    const gridY = Math.round((localY / rect.height) * gridHeight);

    if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) {
      return null;
    }

    const index = gridY * gridWidth + gridX;

    if (isBralet) {
      // Prioritize accessories, then cups, then back/wings band
      const BRALET_HIT_TEST_PRIORITY = [
        'ring',
        'slider',
        'closure',
        'elastic_strap',
        'elastic_trim',
        'cups',
        'band'
      ];
      for (const partId of BRALET_HIT_TEST_PRIORITY) {
        const grid = hitTestGridsRef.current[partId];
        if (grid && grid[index] === 1) {
          return partId;
        }
      }
    } else {
      // Check grids in hit-test priority order (narrow details first, then background/fabrics)
      const HIT_TEST_PRIORITY = [
        'bow',
        'ring',
        'slider',
        'closure',
        'edge_elastic',
        'elastic_strap',
        'underwire',
        'tunnel',
        'elastic_trim',
        'tulle_stable',
        'tulle_elastic',
        'fabric',
        'lace'
      ];

      for (const partId of HIT_TEST_PRIORITY) {
        const grid = hitTestGridsRef.current[partId];
        if (grid && grid[index] === 1) {
          return partId;
        }
      }
    }
    return null;
  }, [garmentType]);

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
      const part = garmentType === 'bralet'
        ? BRALET_SVG_PARTS.find(p => p.id === clickedPartId)
        : BRA_SVG_PARTS.find(p => p.id === clickedPartId);
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
            {/* SVG: Drawings & Colors */}
            <svg
              viewBox="0 0 1536 1085.25"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              <defs>
                {/* Clip path to ignore any vignettes or scanner shadows near JPEG borders */}
                <clipPath id="ignore-borders">
                  <rect x="25" y="25" width="1486" height="1035.25" />
                </clipPath>
                
                {/* Dynamically generated colorization filters for each part */}
                {BRA_SVG_PARTS.map(part => {
                  const assignedColor = getAssignedColor(part.id);
                  const isHovered = hoveredPartId === part.id;
                  const useOriginalColor = !isHovered && !assignedColor;
                  const floodColor = isHovered ? '#c9a236' : (assignedColor || '#ffffff');
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
                      <feFlood flood-color={floodColor} flood-opacity="1" result="floodColor"/>

                      {/* Step 4: Composite color or source graphic based on useOriginalColor */}
                      <feComposite in={useOriginalColor ? "SourceGraphic" : "floodColor"} in2="alpha-mask" operator="in" result="colored-graphic"/>

                      {/* Step 5: GPU-accelerated glow shadow on the masked graphics (ignores borders!) */}
                      {isHovered ? (
                        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#c9a236" flood-opacity="1" />
                      ) : (
                        <feOffset in="colored-graphic" />
                      )}
                    </filter>
                  );
                })}
              </defs>

              {/* LAYER 1: Colorized/Hovered Active Parts (except edge_elastic) */}
              {BRA_SVG_PARTS.filter(p => p.id !== 'edge_elastic').map(part => {
                const hasColor = hasPartColor(part);
                const isHovered = hoveredPartId === part.id;
                const isVisible = isHovered || hasColor;

                if (!isVisible) return null;

                return (
                  <image
                    key={part.id}
                    href={`/bra/${part.file}?v=${CACHE_VERSION}`}
                    x="0"
                    y="0"
                    width="1536"
                    height="1085.25"
                    clipPath="url(#ignore-borders)"
                    style={{
                      opacity: 1.0,
                      filter: `url(#colorize-${part.id})`,
                      transition: 'filter 0.25s ease'
                    }}
                  />
                );
              })}

              {/* LAYER 2: Special placement for edge_elastic on top of other parts, but under outline */}
              {BRA_SVG_PARTS.filter(p => p.id === 'edge_elastic').map(part => {
                const hasColor = hasPartColor(part);
                const isHovered = hoveredPartId === part.id;
                const isVisible = isHovered || hasColor;

                if (!isVisible) return null;

                return (
                  <image
                    key={part.id}
                    href={`/bra/${part.file}?v=${CACHE_VERSION}`}
                    x="0"
                    y="0"
                    width="1536"
                    height="1085.25"
                    clipPath="url(#ignore-borders)"
                    style={{
                      opacity: 1.0,
                      filter: `url(#colorize-${part.id})`,
                      transition: 'filter 0.25s ease'
                    }}
                  />
                );
              })}

              {/* LAYER 3: Contour Reference Outline (mixBlendMode: multiply makes white background transparent) */}
              <image 
                href={`/bra/biustonosz_caly.svg?v=${CACHE_VERSION}`} 
                x="0" 
                y="0" 
                width="1536" 
                height="1085.25" 
                clipPath="url(#ignore-borders)"
                style={{
                  mixBlendMode: 'multiply'
                }}
              />
            </svg>

            {/* SVG 2: Labels and Arrows (On top of outline) */}
            <svg
              viewBox="0 0 1536 1085.25"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 3,
                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                opacity: showLabels ? 1 : 0,
                visibility: showLabels ? 'visible' : 'hidden'
              }}
            >
              <defs>
                {/* Filter to make white JPEG background transparent, keeping only labels/arrows */}
                <filter id="labels-transparent-bg" colorInterpolationFilters="sRGB">
                  {/* Step 1: Alpha = 3 - R - G - B (white becomes transparent) */}
                  <feColorMatrix type="matrix" values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -1 -1 -1 0 3
                  " result="transmask"/>
                  {/* Step 2: Steep threshold to keep text/arrows solid */}
                  <feComponentTransfer in="transmask" result="alpha-mask">
                    <feFuncA type="linear" slope="20" intercept="-1"/>
                  </feComponentTransfer>
                  {/* Step 3: Composite source graphic with alpha mask */}
                  <feComposite in="SourceGraphic" in2="alpha-mask" operator="in"/>
                </filter>
              </defs>
              <image
                href={`/bra/nazwy.svg?v=${CACHE_VERSION}`}
                x="0"
                y="0"
                width="1536"
                height="1085.25"
                style={{ filter: 'url(#labels-transparent-bg)' }}
              />
            </svg>

            {/* LAYER 4: Invisible Hit Test Capture Overlay */}
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
                <span>Najedź lub kliknij часть, by wyodrębnić</span>
              )}
            </div>
          </div>

          {/* Interactive SVG Stacking Container */}
          <div 
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1440 / 960',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {/* SVG 1: Drawings & Colors */}
            <svg
              viewBox="0 0 1440 960"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              <defs>
                {/* Clip path to ignore any vignettes or scanner shadows near JPEG borders */}
                <clipPath id="ignore-borders-bralet">
                  <rect x="24" y="24" width="1392" height="912" />
                </clipPath>
                
                {/* Dynamically generated colorization filters for each part */}
                {BRALET_SVG_PARTS.map(part => {
                  const assignedColor = getAssignedColor(part.id);
                  const isHovered = hoveredPartId === part.id;
                  const useOriginalColor = !isHovered && !assignedColor;
                  const floodColor = isHovered ? '#c9a236' : (assignedColor || '#ffffff');
                  
                  if (part.isVector) {
                    // Vector parts do not have white background and are already transparent
                    return (
                      <filter key={part.id} id={`colorize-${part.id}`} colorInterpolationFilters="sRGB">
                        <feFlood flood-color={floodColor} flood-opacity="1" result="floodColor"/>
                        <feComposite in={useOriginalColor ? "SourceGraphic" : "floodColor"} in2="SourceGraphic" operator="in" result="colored-graphic"/>
                        {isHovered ? (
                          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#c9a236" flood-opacity="1" />
                        ) : (
                          <feOffset in="colored-graphic" />
                        )}
                      </filter>
                    );
                  }

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
                      <feFlood flood-color={floodColor} flood-opacity="1" result="floodColor"/>

                      {/* Step 4: Composite color or source graphic based on useOriginalColor */}
                      <feComposite in={useOriginalColor ? "SourceGraphic" : "floodColor"} in2="alpha-mask" operator="in" result="colored-graphic"/>

                      {/* Step 5: GPU-accelerated glow shadow on the masked graphics */}
                      {isHovered ? (
                        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#c9a236" flood-opacity="1" />
                      ) : (
                        <feOffset in="colored-graphic" />
                      )}
                    </filter>
                  );
                })}
              </defs>

              {/* LAYER 1: Colorized/Hovered Active Parts */}
              {BRALET_SVG_PARTS.map(part => {
                const hasColor = hasPartColor(part);
                const isHovered = hoveredPartId === part.id;
                const isVisible = isHovered || hasColor;

                if (!isVisible) return null;

                return (
                  <image
                    key={part.id}
                    href={`/bralet/${part.file}?v=${CACHE_VERSION}`}
                    x="0"
                    y="0"
                    width="1440"
                    height="960"
                    clipPath="url(#ignore-borders-bralet)"
                    style={{
                      opacity: 1.0,
                      filter: `url(#colorize-${part.id})`,
                      transition: 'filter 0.25s ease'
                    }}
                  />
                );
              })}

              {/* LAYER 2: Contour Reference Outline (mixBlendMode: multiply makes white background transparent) */}
              <image 
                href={`/bralet/caly.svg?v=${CACHE_VERSION}`} 
                x="0" 
                y="0" 
                width="1440" 
                height="960" 
                clipPath="url(#ignore-borders-bralet)"
                style={{
                  mixBlendMode: 'multiply'
                }}
              />
            </svg>

            {/* SVG 2: Labels and Arrows (On top of outline) */}
            <svg
              viewBox="0 0 1440 960"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 3,
                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                opacity: showLabels ? 1 : 0,
                visibility: showLabels ? 'visible' : 'hidden'
              }}
            >
              <defs>
                {/* Filter to make white JPEG background transparent, keeping only labels/arrows */}
                <filter id="labels-transparent-bg-bralet" colorInterpolationFilters="sRGB">
                  <feColorMatrix type="matrix" values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -1 -1 -1 0 3
                  " result="transmask"/>
                  <feComponentTransfer in="transmask" result="alpha-mask">
                    <feFuncA type="linear" slope="20" intercept="-1"/>
                  </feComponentTransfer>
                  <feComposite in="SourceGraphic" in2="alpha-mask" operator="in"/>
                </filter>
              </defs>
              <image
                href={`/bralet/nazwy.svg?v=${CACHE_VERSION}`}
                x="0"
                y="0"
                width="1440"
                height="960"
                style={{
                  filter: 'url(#labels-transparent-bg-bralet)'
                }}
              />
            </svg>

            {/* LAYER 3: Invisible Hit-Test & Click Overlay */}
            <div
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onClick={onOverlayClick}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 4,
                cursor: hoveredPartId ? 'pointer' : 'default'
              }}
            />
          </div>
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
