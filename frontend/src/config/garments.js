// Opis wyrobów: części, dozwolone materiały i normy zużycia wg rozmiaru.
// accepts.category / accepts.types — tabela zgodności "część → materiał".
// qty — ilość w jednostce sprzedaży materiału (m / szt / kpl / para) dla rozmiarów S, M, L, XL.

export const SIZES = ['S', 'M', 'L', 'XL'];

const bySize = (S, M, L, XL) => ({ S, M, L, XL });
const flat = (q) => bySize(q, q, q, q);

export const GARMENTS = {
  bra: {
    label: 'Biustonosz',
    sizeHint: { S: '65–70 A–B', M: '75–80 B–C', L: '85–90 C–D', XL: '95+ D–F' },
    parts: [
      { id: 'cups', label: 'Miseczki', hint: 'Koronka elastyczna lub mikrofibra', accepts: { category: 'fabric', types: ['lace', 'microfiber'] }, qty: bySize(0.4, 0.5, 0.6, 0.7) },
      { id: 'gore', label: 'Mostek', hint: 'Stabilna siatka', accepts: { category: 'fabric', types: ['mesh'] }, qty: flat(0.1) },
      { id: 'wings', label: 'Obwód biustonosza', hint: 'Mikrofibra lub gęsta siatka', accepts: { category: 'fabric', types: ['microfiber', 'mesh'] }, qty: bySize(0.3, 0.3, 0.4, 0.5) },
      { id: 'straps', label: 'Ramiączka', hint: 'Taśma ramiączkowa', accepts: { category: 'elastic', types: ['strap'] }, qty: bySize(0.8, 0.9, 1.0, 1.1) },
      { id: 'elastics', label: 'Gumki wykończeniowe', hint: 'Gumka z pikotką: dekolt, pacha, dół', accepts: { category: 'elastic', types: ['band'] }, qty: bySize(1.8, 2.0, 2.3, 2.6) },
      { id: 'underwires', label: 'Tunele na fiszbiny', hint: 'Taśma tunelowa', accepts: { category: 'underwire', types: ['tunnel'] }, qty: bySize(0.5, 0.6, 0.7, 0.8) },
      { id: 'wires', label: 'Fiszbiny', hint: 'Para fiszbin w Twoim rozmiarze', accepts: { category: 'underwire', types: ['wire'] }, qty: flat(1), visual: false },
      { id: 'hardware', label: 'Regulatory i kółka', hint: 'Komplet: 2 regulatory + 2 kółka', accepts: { category: 'hardware' }, qty: flat(1) },
      { id: 'closure', label: 'Zapięcie tyłu', hint: 'Haftki', accepts: { category: 'closure' }, qty: flat(1) },
    ],
  },
  panties: {
    label: 'Majtki',
    sizeHint: { S: '34–36', M: '38–40', L: '42–44', XL: '46+' },
    parts: [
      { id: 'front', label: 'Panel przedni', hint: 'Koronka lub mikrofibra', accepts: { category: 'fabric', types: ['lace', 'microfiber'] }, qty: bySize(0.3, 0.3, 0.4, 0.4) },
      { id: 'back', label: 'Panel tylny', hint: 'Mikrofibra, siatka lub koronka', accepts: { category: 'fabric', types: ['microfiber', 'mesh', 'lace'] }, qty: bySize(0.3, 0.4, 0.4, 0.5) },
      { id: 'gusset', label: 'Klin (krok)', hint: 'Bawełna lub miękka siatka', accepts: { category: 'fabric', types: ['cotton', 'mesh'] }, qty: flat(0.1) },
      { id: 'waist', label: 'Gumka w pasie', hint: 'Gumka z pikotką', accepts: { category: 'elastic', types: ['band'] }, qty: bySize(0.7, 0.8, 0.9, 1.0) },
      { id: 'legs', label: 'Wykończenie nogawek', hint: 'Gumka obszywkowa', accepts: { category: 'elastic', types: ['band'] }, qty: bySize(1.1, 1.2, 1.3, 1.5) },
    ],
  },
  nightgown: {
    label: 'Koszulka nocna',
    sizeHint: { S: '34–36', M: '38–40', L: '42–44', XL: '46+' },
    parts: [
      { id: 'bodice', label: 'Góra (stanik)', hint: 'Koronka', accepts: { category: 'fabric', types: ['lace'] }, qty: bySize(0.5, 0.6, 0.7, 0.8) },
      { id: 'skirt', label: 'Dół koszulki', hint: 'Satyna, mikrofibra lub koronka', accepts: { category: 'fabric', types: ['satin', 'microfiber', 'lace'] }, qty: bySize(1.0, 1.1, 1.3, 1.4) },
      { id: 'straps', label: 'Ramiączka', hint: 'Taśma ramiączkowa', accepts: { category: 'elastic', types: ['strap'] }, qty: bySize(0.7, 0.8, 0.8, 0.9) },
      { id: 'underbust', label: 'Gumka pod biustem', hint: 'Gumka z pikotką', accepts: { category: 'elastic', types: ['band'] }, qty: bySize(0.7, 0.8, 0.9, 1.0) },
      { id: 'trim', label: 'Koronka na dole', hint: 'Koronka wykończeniowa', accepts: { category: 'fabric', types: ['lace'] }, qty: bySize(1.4, 1.6, 1.8, 2.0) },
    ],
  },
};

export const GARMENT_IDS = Object.keys(GARMENTS);

// Gotowe palety: dla każdej części wybierany jest pierwszy zgodny materiał z daną paletą
export const PALETTES = [
  { key: 'emerald', name: 'Szmaragdowy Szyk', color: '#047857' },
  { key: 'wine', name: 'Wytworne Wino', color: '#881337' },
  { key: 'blush', name: 'Pudrowy Róż', color: '#fda4af' },
  { key: 'black', name: 'Klasyczna Czerń', color: '#111827' },
];
