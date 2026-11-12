import { useState } from 'react';

// Zdjęcie produktu ze sklepu; gdy go brak (lub nie wczytało się) — próbka materiału rysowana w SVG
export default function ProductSwatch({ product, size = 'md' }) {
  const [failed, setFailed] = useState(false);

  if (product.image && !failed) {
    return (
      <img
        className={`sdc-swatch sdc-swatch-${size}`}
        src={product.image}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  const c = product.colorHex;
  const light = 'rgba(255,255,255,0.45)';
  const dark = 'rgba(0,0,0,0.18)';
  const pid = `sw-${String(product.id).replace(/[^a-z0-9_-]/gi, '')}-${size}`;
  const kind = product.type || product.category;

  let body;
  if (product.category === 'fabric') {
    body = (
      <>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse">
            {kind === 'lace' && (
              <>
                <path d="M0 8 Q4 2 8 8 T16 8" fill="none" stroke={light} strokeWidth="1.2" />
                <path d="M0 0 Q4 6 8 0 T16 0" fill="none" stroke={dark} strokeWidth="0.9" />
                <circle cx="4" cy="12" r="1.2" fill={light} />
              </>
            )}
            {kind === 'mesh' && <path d="M0 0 L16 16 M16 0 L0 16" stroke={light} strokeWidth="0.8" />}
            {kind === 'cotton' && <path d="M0 4 H16 M0 12 H16" stroke={dark} strokeWidth="0.6" />}
          </pattern>
          <linearGradient id={`${pid}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={kind === 'satin' ? 0.55 : 0.2} />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" fill={c} />
        <rect width="80" height="80" fill={`url(#${pid})`} />
        <rect width="80" height="80" fill={`url(#${pid}-g)`} />
      </>
    );
  } else if (product.category === 'elastic' || kind === 'tunnel') {
    // rolka taśmy: trzy pasy, przy gumce z pikotką — ząbki
    body = (
      <>
        <rect width="80" height="80" fill="#f7f3ee" />
        {[14, 34, 54].map((y) => (
          <g key={y}>
            <rect x="-4" y={y} width="88" height="13" fill={c} transform={`rotate(-8 40 ${y})`} />
            <path d={`M-4 ${y + 6.5} H84`} stroke={dark} strokeWidth="0.8" strokeDasharray="3 3" transform={`rotate(-8 40 ${y})`} />
            {kind === 'band' && (
              <path d={`M-4 ${y} H84`} stroke={c} strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 6" transform={`rotate(-8 40 ${y})`} />
            )}
          </g>
        ))}
      </>
    );
  } else if (kind === 'wire') {
    body = (
      <>
        <rect width="80" height="80" fill="#f7f3ee" />
        <path d="M16 22 C16 62, 64 62, 64 22" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 18 C24 50, 56 50, 56 18" fill="none" stroke="#c4c8cf" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  } else if (product.category === 'hardware') {
    body = (
      <>
        <rect width="80" height="80" fill="#f7f3ee" />
        <rect x="14" y="16" width="34" height="18" rx="5" fill="none" stroke={c} strokeWidth="4" />
        <path d="M16 25 H46" stroke={c} strokeWidth="3" />
        <circle cx="54" cy="54" r="12" fill="none" stroke={c} strokeWidth="4" />
        <circle cx="26" cy="56" r="9" fill="none" stroke={c} strokeWidth="3.5" />
      </>
    );
  } else {
    // zapięcie: haftki
    body = (
      <>
        <rect width="80" height="80" fill="#f7f3ee" />
        <rect x="12" y="18" width="56" height="44" rx="4" fill={c} />
        <path d="M40 20 V60" stroke={dark} strokeWidth="1" />
        {[30, 50].map((y) => (
          <g key={y}>
            <circle cx="26" cy={y} r="3.5" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            <path d={`M50 ${y} h10`} stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
      </>
    );
  }

  return (
    <svg className={`sdc-swatch sdc-swatch-${size}`} viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {body}
    </svg>
  );
}
