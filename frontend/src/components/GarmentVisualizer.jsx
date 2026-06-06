import React from 'react';

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
  const getPartColor = (partId, defaultColor = '#e2ded5') => {
    return partColors[partId] || defaultColor;
  };

  const getPartStroke = (partId) => {
    return selectedPartId === partId ? '#c9a236' : '#a49e95';
  };

  const getPartStrokeWidth = (partId) => {
    return selectedPartId === partId ? '2.5' : '1.2';
  };

  // Render Bra SVGs (Flat layout projection matching media__1780697054315.png, no separate front/back)
  const renderBiustonosz = () => {
    const cupColor = getPartColor('fabric');
    const laceColor = getPartColor('lace');
    const tulleElasticColor = getPartColor('tulle_elastic');
    const tulleStableColor = getPartColor('tulle_stable');
    const elasticColor = getPartColor('elastic_trim');
    const strapColor = getPartColor('elastic_strap');
    const ringColor = getPartColor('ring', '#d1d5db');
    const sliderColor = getPartColor('slider', '#d1d5db');
    const closureColor = getPartColor('closure');
    const tunnelColor = getPartColor('tunnel');
    const bowColor = getPartColor('bow');
    const threadColor = getPartColor('threads', '#888');
    const underwireColor = getPartColor('underwire', '#bfb5a8');

    return (
      <div className="garment-visualizer" style={{ flexDirection: 'column', padding: '1.5rem', alignItems: 'center' }}>
        <div className="view-section" style={{ width: '100%', maxWidth: '950px' }}>
          <svg width="100%" height="450" viewBox="0 0 1000 480" className="garment-svg" style={{ overflow: 'visible' }}>
            <defs>
              <marker 
                id="arrow" 
                viewBox="0 0 10 10" 
                refX="6" 
                refY="5" 
                markerWidth="5" 
                markerHeight="5" 
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
              </marker>
            </defs>

            <g transform="translate(0, 10)">
              {/* Left Closure Hook Panel */}
              <rect
                x="185"
                y="300"
                width="15"
                height="40"
                rx="2"
                fill={closureColor}
                stroke={getPartStroke('closure')}
                strokeWidth={getPartStrokeWidth('closure')}
                className="interactive-part"
                onClick={() => onPartClick('closure')}
                style={{ cursor: 'pointer' }}
              />
              <line x1="185" y1="310" x2="180" y2="310" stroke="#444" strokeWidth="1.2" />
              <line x1="185" y1="320" x2="180" y2="320" stroke="#444" strokeWidth="1.2" />
              <line x1="185" y1="330" x2="180" y2="330" stroke="#444" strokeWidth="1.2" />

              {/* Right Closure Eye Panel */}
              <rect
                x="800"
                y="300"
                width="15"
                height="40"
                rx="2"
                fill={closureColor}
                stroke={getPartStroke('closure')}
                strokeWidth={getPartStrokeWidth('closure')}
                className="interactive-part"
                onClick={() => onPartClick('closure')}
                style={{ cursor: 'pointer' }}
              />
              <circle cx="808" cy="310" r="1.5" fill="#444" />
              <circle cx="808" cy="320" r="1.5" fill="#444" />
              <circle cx="808" cy="330" r="1.5" fill="#444" />

              {/* Left Band Wing (tulle_elastic) */}
              <path
                d="M 320,250 C 280,260 240,280 200,300 L 200,340 C 240,342 280,342 320,340 Z"
                fill={tulleElasticColor}
                stroke={getPartStroke('tulle_elastic')}
                strokeWidth={getPartStrokeWidth('tulle_elastic')}
                className="interactive-part"
                onClick={() => onPartClick('tulle_elastic')}
                style={{ cursor: 'pointer' }}
              />
              {/* Internal vertical seam on left wing */}
              <line 
                x1="250" 
                y1="275" 
                x2="250" 
                y2="341" 
                stroke={threadColor} 
                strokeWidth="0.8" 
                strokeDasharray="2,2" 
              />

              {/* Right Band Wing (tulle_elastic) */}
              <path
                d="M 680,250 C 720,260 760,280 800,300 L 800,340 C 760,342 720,342 680,340 Z"
                fill={tulleElasticColor}
                stroke={getPartStroke('tulle_elastic')}
                strokeWidth={getPartStrokeWidth('tulle_elastic')}
                className="interactive-part"
                onClick={() => onPartClick('tulle_elastic')}
                style={{ cursor: 'pointer' }}
              />
              {/* Internal vertical seam on right wing */}
              <line 
                x1="750" 
                y1="275" 
                x2="750" 
                y2="341" 
                stroke={threadColor} 
                strokeWidth="0.8" 
                strokeDasharray="2,2" 
              />

              {/* Top and Bottom Elastic Trims (elastic_trim) on Wings */}
              <path
                d="M 320,250 C 280,260 240,280 200,300"
                fill="none"
                stroke={elasticColor}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
                style={{ cursor: 'pointer' }}
              />
              <path
                d="M 320,340 C 280,342 240,342 200,340"
                fill="none"
                stroke={elasticColor}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
                style={{ cursor: 'pointer' }}
              />
              <path
                d="M 680,250 C 720,260 760,280 800,300"
                fill="none"
                stroke={elasticColor}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
                style={{ cursor: 'pointer' }}
              />
              <path
                d="M 680,340 C 720,342 760,342 800,340"
                fill="none"
                stroke={elasticColor}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
                style={{ cursor: 'pointer' }}
              />

              {/* Cradle/Bridge (tulle_stable) */}
              <path
                d="M 475,240 L 525,240 C 520,270 520,300 525,340 C 510,320 490,320 475,340 C 480,300 480,270 475,240 Z"
                fill={tulleStableColor}
                stroke={getPartStroke('tulle_stable')}
                strokeWidth={getPartStrokeWidth('tulle_stable')}
                className="interactive-part"
                onClick={() => onPartClick('tulle_stable')}
                style={{ cursor: 'pointer' }}
              />
              {/* Vertical center stitch on bridge */}
              <line 
                x1="500" 
                y1="240" 
                x2="500" 
                y2="328" 
                stroke={threadColor} 
                strokeWidth="1" 
                strokeDasharray="2,2" 
              />

              {/* Left Cup Lower Cup (fabric) */}
              <path
                d="M 320,250 C 342,342 453,342 475,240 C 450,250 420,260 397,260 C 370,260 340,250 320,250 Z"
                fill={cupColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick('fabric')}
                style={{ cursor: 'pointer' }}
              />

              {/* Left Cup Lace Panel */}
              <path
                d="M 320,250 C 340,210 370,180 397,150 C 425,180 455,210 475,240 C 450,250 420,260 397,260 C 370,260 340,250 320,250 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick('lace')}
                style={{ cursor: 'pointer' }}
              />

              {/* Right Cup Lower Cup (fabric) */}
              <path
                d="M 680,250 C 658,342 547,342 525,240 C 550,250 580,260 603,260 C 630,260 660,250 680,250 Z"
                fill={cupColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick('fabric')}
                style={{ cursor: 'pointer' }}
              />

              {/* Right Cup Lace Panel */}
              <path
                d="M 680,250 C 660,210 630,180 603,150 C 575,180 545,210 525,240 C 550,250 580,260 603,260 C 630,260 660,250 680,250 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick('lace')}
                style={{ cursor: 'pointer' }}
              />

              {/* Dashed guidelines inside cups representing anatomy mapping */}
              {/* Left vertical breast curve */}
              <path
                d="M 397,150 L 397,338"
                fill="none"
                stroke={threadColor}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              {/* Left apex cross marker */}
              <line x1="392" y1="255" x2="402" y2="265" stroke="#444" strokeWidth="1.5" />
              <line x1="402" y1="255" x2="392" y2="265" stroke="#444" strokeWidth="1.5" />

              {/* Right vertical breast curve */}
              <path
                d="M 603,150 L 603,338"
                fill="none"
                stroke={threadColor}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              {/* Right apex cross marker */}
              <line x1="598" y1="255" x2="608" y2="265" stroke="#444" strokeWidth="1.5" />
              <line x1="608" y1="255" x2="598" y2="265" stroke="#444" strokeWidth="1.5" />

              {/* Neckline double stitch detail lines */}
              <path
                d="M 397,150 C 425,180 455,210 475,240"
                fill="none"
                stroke={threadColor}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              <path
                d="M 603,150 C 575,180 545,210 525,240"
                fill="none"
                stroke={threadColor}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />

              {/* Left Underwire Channel (tunnel) */}
              <path
                d="M 473,242 C 453,342 342,342 322,252"
                fill="none"
                stroke={tunnelColor}
                strokeWidth={selectedPartId === 'tunnel' ? '8' : '5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
                style={{ cursor: 'pointer' }}
              />

              {/* Left Underwire (underwire) */}
              <path
                d="M 471,245 C 451,337 344,337 324,255"
                fill="none"
                stroke={underwireColor}
                strokeWidth={selectedPartId === 'underwire' ? '3' : '1.8'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
                style={{ cursor: 'pointer' }}
              />

              {/* Right Underwire Channel (tunnel) */}
              <path
                d="M 527,242 C 547,342 658,342 678,252"
                fill="none"
                stroke={tunnelColor}
                strokeWidth={selectedPartId === 'tunnel' ? '8' : '5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
                style={{ cursor: 'pointer' }}
              />

              {/* Right Underwire (underwire) */}
              <path
                d="M 529,245 C 549,337 656,337 676,255"
                fill="none"
                stroke={underwireColor}
                strokeWidth={selectedPartId === 'underwire' ? '3' : '1.8'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
                style={{ cursor: 'pointer' }}
              />

              {/* Side seam / bones (szew boczny / fiszbiny krótkie) */}
              {/* Left side seam */}
              <rect
                x="317"
                y="250"
                width="6"
                height="90"
                fill={tunnelColor}
                stroke={getPartStroke('tunnel')}
                strokeWidth={getPartStrokeWidth('tunnel')}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
                style={{ cursor: 'pointer' }}
              />
              <line x1="320" y1="250" x2="320" y2="340" stroke={threadColor} strokeWidth="1" strokeDasharray="3,3" />

              {/* Right side seam */}
              <rect
                x="677"
                y="250"
                width="6"
                height="90"
                fill={tunnelColor}
                stroke={getPartStroke('tunnel')}
                strokeWidth={getPartStrokeWidth('tunnel')}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
                style={{ cursor: 'pointer' }}
              />
              <line x1="680" y1="250" x2="680" y2="340" stroke={threadColor} strokeWidth="1" strokeDasharray="3,3" />

              {/* Left Strap (elastic_strap) */}
              <path
                d="M 230,288 C 210,130 310,35 397,150"
                fill="none"
                stroke={strapColor}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
                style={{ cursor: 'pointer', strokeWidth: '6px' }}
              />

              {/* Right Strap (elastic_strap) */}
              {/* Connected to ring at right apex */}
              <path
                d="M 770,288 C 790,130 690,35 603,143"
                fill="none"
                stroke={strapColor}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
                style={{ cursor: 'pointer', strokeWidth: '6px' }}
              />

              {/* Left Apex Attachment Seam (represented as small band) */}
              <rect
                x="389"
                y="147"
                width="16"
                height="5"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth="1"
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
                style={{ cursor: 'pointer' }}
              />

              {/* Right Apex Ring (ring) */}
              <circle
                cx="603"
                cy="150"
                r="7"
                fill="none"
                stroke={ringColor}
                strokeWidth={selectedPartId === 'ring' ? '3.5' : '2'}
                className="interactive-part"
                onClick={() => onPartClick('ring')}
                style={{ cursor: 'pointer' }}
              />
              {/* Loop of lace holding the ring */}
              <path
                d="M 603,157 L 603,161"
                stroke={threadColor}
                strokeWidth="1.5"
              />

              {/* Sliders (slider) */}
              {/* Left Slider */}
              <rect
                x="270"
                y="58"
                width="14"
                height="8"
                rx="1"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
                style={{ cursor: 'pointer' }}
              />
              <line x1="277" y1="58" x2="277" y2="66" stroke="#444" strokeWidth="1" />

              {/* Right Slider */}
              <rect
                x="716"
                y="58"
                width="14"
                height="8"
                rx="1"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
                style={{ cursor: 'pointer' }}
              />
              <line x1="723" y1="58" x2="723" y2="66" stroke="#444" strokeWidth="1" />

              {/* Decorative Bow (bow) on Center Bridge */}
              <g 
                className="interactive-part" 
                onClick={() => onPartClick('bow')}
                style={{ cursor: 'pointer' }}
              >
                {/* Left bow loop */}
                <path
                  d="M 500,245 C 490,235 480,245 500,245 Z"
                  fill={bowColor}
                  stroke={getPartStroke('bow')}
                  strokeWidth={getPartStrokeWidth('bow')}
                />
                {/* Right bow loop */}
                <path
                  d="M 500,245 C 510,235 520,245 500,245 Z"
                  fill={bowColor}
                  stroke={getPartStroke('bow')}
                  strokeWidth={getPartStrokeWidth('bow')}
                />
                {/* Bow center knot */}
                <circle cx="500" cy="245" r="2.5" fill={bowColor} stroke={getPartStroke('bow')} strokeWidth="0.8" />
                {/* Bow tails */}
                <path d="M 500,245 L 493,258" stroke={getPartStroke('bow')} strokeWidth="1.2" />
                <path d="M 500,245 L 507,258" stroke={getPartStroke('bow')} strokeWidth="1.2" />
              </g>

              {/* Interactive Labels & Arrows Layer */}
              <g 
                className="labels-layer" 
                style={{ 
                  display: showLabels ? 'inline' : 'none', 
                  pointerEvents: 'none',
                  transition: 'opacity 0.3s ease'
                }}
              >
                {/* 1. Left regulatory */}
                <text x="140" y="54" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">regulatory</text>
                <line x1="205" y1="50" x2="265" y2="58" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 2. Left guma ramiączkowa */}
                <text x="240" y="114" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">guma ramiączkowa</text>
                <line x1="290" y1="100" x2="260" y2="85" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 3. Left zapięcie (haftki) */}
                <text x="80" y="325" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">zapięcie (haftki)</text>
                <line x1="172" y1="321" x2="182" y2="321" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 4. Left guma obszywkowa (dół) */}
                <text x="80" y="420" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">guma obszywkowa (dół)</text>
                <line x1="120" y1="405" x2="230" y2="338" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 5. Left szew boczny / fiszbiny krótkie */}
                <text x="180" y="240" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold">szew boczny</text>
                <text x="180" y="253" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">fiszbiny krótkie</text>
                <line x1="260" y1="248" x2="313" y2="272" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 6. Left skrzydełko obwodu */}
                <text x="180" y="355" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">skrzydełko obwodu</text>
                <line x1="230" y1="340" x2="255" y2="320" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 7. Left tunel gorseciarski */}
                <text x="200" y="450" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold">tunel gorseciarski</text>
                <line x1="280" y1="438" x2="348" y2="328" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 8. Left fiszbiny */}
                <text x="380" y="450" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">fiszbiny</text>
                <line x1="380" y1="435" x2="385" y2="330" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* Right Side Etykiety */}
                {/* 9. Right regulatory */}
                <text x="860" y="54" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">regulatory</text>
                <line x1="795" y1="50" x2="735" y2="58" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 10. Right guma ramiączkowa */}
                <text x="760" y="114" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">guma ramiączkowa</text>
                <line x1="710" y1="100" x2="740" y2="85" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 11. Right kółko (łącznik) */}
                <text x="750" y="154" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">kółko (łącznik)</text>
                <line x1="745" y1="150" x2="612" y2="150" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 12. Right szczyt piersi (apex) */}
                <text x="800" y="215" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">szczyt piersi (apex)</text>
                <line x1="795" y1="218" x2="612" y2="258" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 13. Right szew boczny / fiszbiny krótkie */}
                <text x="820" y="240" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold">szew boczny</text>
                <text x="820" y="253" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">fiszbiny krótkie</text>
                <line x1="740" y1="248" x2="687" y2="272" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 14. Right skrzydełko obwodu */}
                <text x="820" y="355" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">skrzydełko obwodu</text>
                <line x1="770" y1="340" x2="745" y2="320" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 15. Right haftki */}
                <text x="920" y="325" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">haftki</text>
                <line x1="828" y1="321" x2="818" y2="321" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 16. Right guma obszywkowa */}
                <text x="920" y="420" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">guma obszywkowa</text>
                <line x1="880" y1="405" x2="770" y2="338" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 17. Right tunel gorseciarski */}
                <text x="800" y="450" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold">tunel gorseciarski</text>
                <line x1="720" y1="438" x2="652" y2="328" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 18. Right fiszbiny */}
                <text x="620" y="450" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">fiszbiny</text>
                <line x1="620" y1="435" x2="615" y2="330" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* Center / Common Etykiety */}
                {/* 19. Center guma obszywkowa */}
                <text x="500" y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">guma obszywkowa</text>
                <line x1="450" y1="150" x2="408" y2="150" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 20. Center guma obszywkowa (dekolt) */}
                <text x="500" y="185" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold">guma obszywkowa (dekolt)</text>
                <line x1="450" y1="185" x2="415" y2="195" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />
                <line x1="550" y1="185" x2="585" y2="195" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 21. Left/Right tkanina lub koronka */}
                <text x="320" y="195" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">tkanina lub koronka</text>
                <line x1="320" y1="185" x2="355" y2="175" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />
                <text x="680" y="195" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">tkanina lub koronka</text>
                <line x1="680" y1="185" x2="645" y2="175" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 22. Left/Right dolna część miseczki */}
                <text x="310" y="295" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">dolna część miseczki</text>
                <line x1="330" y1="280" x2="360" y2="275" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />
                <text x="690" y="295" textAnchor="end" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">dolna część miseczki</text>
                <line x1="670" y1="280" x2="640" y2="275" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />

                {/* 23. mostek do miseczki */}
                <text x="500" y="420" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#4b5563">mostek do miseczki</text>
                <line x1="500" y1="405" x2="500" y2="330" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrow)" />
              </g>

              {/* 24. mostek text - always visible inside the bridge */}
              <text x="500" y="290" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="11" fill="#1f2937" fontWeight="bold" style={{ pointerEvents: 'none' }}>mostek</text>
            </g>
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
                onClick={() => onPartClick('fabric')}
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
                onClick={() => onPartClick('lace')}
              />
              <path
                d="M 220,60 C 212,72 202,88 192,102 C 200,95 210,80 220,60 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick('lace')}
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
                onClick={() => onPartClick('fabric')}
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
                onClick={() => onPartClick('lace')}
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
                onClick={() => onPartClick('lace')}
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
                onClick={() => onPartClick('fabric')}
              />
              <path
                d="M 230,139 C 205,143 165,145 140,145 L 140,154 C 165,154 205,150 230,144 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick('fabric')}
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
