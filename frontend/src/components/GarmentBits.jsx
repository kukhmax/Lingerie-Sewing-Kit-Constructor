// Rysuje dzieci dwa razy: oryginał + lustrzane odbicie względem pionowej osi x = axis
export function Mirror({ children, axis = 300 }) {
  return (
    <>
      {children}
      <g transform={`translate(${axis * 2} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

// Rysunek wyrobu z podpisem części pod spodem
export function GarmentFigure({ viewBox, label, caption, children }) {
  return (
    <figure className="sdc-figure">
      <svg viewBox={viewBox} className="sdc-garment" xmlns="http://www.w3.org/2000/svg" role="group" aria-label={label}>
        {children}
      </svg>
      <figcaption aria-hidden="true">{caption}</figcaption>
    </figure>
  );
}

// Wzór koronki i cieniowania — wspólne definicje, id z prefiksem wyrobu
export function FabricDefs({ prefix }) {
  return (
    <defs>
      <pattern id={`${prefix}-lace`} width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M 0 11 Q 5.5 4 11 11 T 22 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <path d="M 0 0 Q 5.5 7 11 0 T 22 0" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
        <circle cx="5.5" cy="16" r="1.3" fill="rgba(255,255,255,0.35)" />
        <circle cx="16.5" cy="5" r="1.3" fill="rgba(0,0,0,0.1)" />
      </pattern>
      <radialGradient id={`${prefix}-volume`} cx="0.55" cy="0.5" r="0.65">
        <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.22" />
      </radialGradient>
      <linearGradient id={`${prefix}-shade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#000" stopOpacity="0.14" />
      </linearGradient>
      <linearGradient id={`${prefix}-folds`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.16" />
        <stop offset="0.18" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="0.36" stopColor="#000" stopOpacity="0.1" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.14" />
        <stop offset="0.64" stopColor="#000" stopOpacity="0.1" />
        <stop offset="0.82" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#000" stopOpacity="0.16" />
      </linearGradient>
    </defs>
  );
}
