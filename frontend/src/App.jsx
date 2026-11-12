import { useCallback, useEffect, useMemo, useState } from 'react';
import BraSvg from './components/BraSvg.jsx';
import PantiesSvg from './components/PantiesSvg.jsx';
import NightgownSvg from './components/NightgownSvg.jsx';
import ProductPicker from './components/ProductPicker.jsx';
import KitList from './components/KitList.jsx';
import { GARMENTS, GARMENT_IDS, PALETTES, SIZES } from './config/garments.js';
import { buildKit, garmentProgress, getPart, kitTotal, partQty, pickForPalette, productsForPart } from './lib/kit.js';
import { addToCart, CartError, loadMaterials } from './api.js';

const GARMENT_SVG = { bra: BraSvg, panties: PantiesSvg, nightgown: NightgownSvg };

const emptySelections = () => Object.fromEntries(GARMENT_IDS.map((g) => [g, {}]));
const defaultSizes = () => Object.fromEntries(GARMENT_IDS.map((g) => [g, 'M']));

let toastSeq = 0;

export default function App({ config }) {
  const [materials, setMaterials] = useState(null); // null = ładowanie
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeGarment, setActiveGarment] = useState('bra');
  const [selections, setSelections] = useState(emptySelections); // { bra: { cups: productId } }
  const [sizes, setSizes] = useState(defaultSizes);
  const [overrides, setOverrides] = useState({}); // ręcznie zmienione ilości
  const [pickerPart, setPickerPart] = useState(null); // id części, dla której otwarto okno
  const [busyId, setBusyId] = useState(null);
  const [addedIds, setAddedIds] = useState(() => new Set());
  const [toasts, setToasts] = useState([]);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadMaterials(config)
      .then((list) => {
        if (!cancelled) setMaterials(list);
      })
      .catch(() => {
        if (cancelled) return;
        setMaterials([]);
        setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [config, reloadKey]);

  const retryLoad = () => {
    setLoadFailed(false);
    setMaterials(null);
    setReloadKey((k) => k + 1);
  };

  const productsById = useMemo(() => new Map((materials ?? []).map((p) => [p.id, p])), [materials]);

  const toast = useCallback((text, kind = 'info', link = null) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { id, text, kind, link }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000);
  }, []);

  const garment = GARMENTS[activeGarment];
  const GarmentSvg = GARMENT_SVG[activeGarment];
  const size = sizes[activeGarment];

  // Dla rysunku: { partId: produkt }
  const partProducts = useMemo(() => {
    const out = {};
    for (const part of garment.parts) {
      const product = productsById.get(String(selections[activeGarment][part.id]));
      if (product) out[part.id] = product;
    }
    return out;
  }, [garment, selections, activeGarment, productsById]);

  const lines = useMemo(() => buildKit(selections, sizes, productsById, overrides), [selections, sizes, productsById, overrides]);
  const total = kitTotal(lines);

  const setPart = (garmentId, partId, productId) => {
    setSelections((prev) => {
      const next = { ...prev[garmentId] };
      if (productId == null) delete next[partId];
      else next[partId] = productId;
      return { ...prev, [garmentId]: next };
    });
  };

  const applyPalette = (palette) => {
    let applied = 0;
    const next = { ...selections[activeGarment] };
    for (const part of garment.parts) {
      const match = pickForPalette(activeGarment, part, materials ?? [], palette.key);
      if (match) {
        next[part.id] = match.id;
        applied += 1;
      }
    }
    setSelections((prev) => ({ ...prev, [activeGarment]: next }));
    toast(
      applied === garment.parts.length
        ? `Paleta „${palette.name}” zastosowana do wszystkich części.`
        : `Paleta „${palette.name}”: dobrano ${applied} z ${garment.parts.length} części. Pozostałe wybierz samodzielnie.`,
    );
  };

  const changeQty = (productId, quantity, needed) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (quantity === needed) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  };

  const removeLine = (line) => {
    setSelections((prev) => {
      const next = { ...prev };
      for (const use of line.uses) {
        next[use.garmentId] = { ...next[use.garmentId] };
        delete next[use.garmentId][use.partId];
      }
      return next;
    });
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[line.product.id];
      return next;
    });
  };

  const sendToCart = async (targetLines, busyKey) => {
    setBusyId(busyKey);
    try {
      const result = await addToCart(
        config,
        targetLines.map((l) => ({ product_id: l.product.id, quantity: l.quantity })),
      );
      if (result.demo) {
        toast('Tryb demonstracyjny: koszyk sklepu nie jest podłączony, nic nie zostało dodane.', 'warn');
        return;
      }
      setAddedIds((prev) => new Set([...prev, ...targetLines.map((l) => l.product.id)]));
      toast(
        targetLines.length === 1 ? `Dodano do koszyka: ${targetLines[0].product.name}.` : `Dodano do koszyka ${targetLines.length} materiałów.`,
        'success',
        result.cartUrl ? { href: result.cartUrl, text: 'Przejdź do koszyka' } : null,
      );
    } catch (err) {
      toast(err instanceof CartError ? err.message : 'Nie udało się dodać do koszyka.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const pickerPartDef = pickerPart ? getPart(activeGarment, pickerPart) : null;

  return (
    <div className="sdc">
      <header className="sdc-header">
        <div>
          <h2 className="sdc-title">Konstruktor zestawów krawieckich</h2>
          <p className="sdc-muted">Kliknij część wyrobu, wybierz materiał — lista zakupów uzupełni się sama.</p>
        </div>
        <div className="sdc-tabs" role="tablist" aria-label="Wyrób">
          {GARMENT_IDS.map((id) => {
            const progress = garmentProgress(id, selections, productsById);
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeGarment === id}
                className={`sdc-tab ${activeGarment === id ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveGarment(id);
                  setPickerPart(null);
                }}
              >
                {GARMENTS[id].label}
                {progress.done > 0 && (
                  <span className="sdc-tab-count">
                    {progress.done}/{progress.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {loadFailed && (
        <div className="sdc-alert" role="alert">
          Nie udało się wczytać katalogu materiałów.
          <button type="button" className="sdc-link" onClick={retryLoad}>
            Spróbuj ponownie
          </button>
        </div>
      )}

      <div className="sdc-layout">
        <section className="sdc-card sdc-stage" aria-label={`Podgląd: ${garment.label}`}>
          <div className="sdc-toolbar">
            <div className="sdc-field">
              <span className="sdc-eyebrow">Rozmiar</span>
              <div className="sdc-segment" role="radiogroup" aria-label="Rozmiar">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    title={garment.sizeHint[s]}
                    className={size === s ? 'is-active' : ''}
                    onClick={() => setSizes((prev) => ({ ...prev, [activeGarment]: s }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span className="sdc-muted">{garment.sizeHint[size]}</span>
            </div>
            <div className="sdc-field">
              <span className="sdc-eyebrow">Gotowe palety</span>
              <div className="sdc-palettes">
                {PALETTES.map((p) => (
                  <button key={p.key} type="button" className="sdc-palette" disabled={!materials?.length} onClick={() => applyPalette(p)}>
                    <i style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sdc-canvas">
            {materials === null ? (
              <p className="sdc-muted">Ładowanie katalogu…</p>
            ) : (
              <GarmentSvg activePart={pickerPart} setActivePart={setPickerPart} selections={partProducts} />
            )}
          </div>

          {/* Lista części: alternatywa dla klikania w rysunek (m.in. części niewidoczne, jak fiszbiny) */}
          <ul className="sdc-parts">
            {garment.parts.map((part) => {
              const product = partProducts[part.id];
              return (
                <li key={part.id}>
                  <button type="button" className={`sdc-part ${product ? 'is-done' : ''}`} onClick={() => setPickerPart(part.id)}>
                    <i style={product ? { backgroundColor: product.colorHex } : undefined} />
                    <span>
                      <strong>{part.label}</strong>
                      <small>{product ? product.colorName || product.name : 'Wybierz materiał'}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="sdc-card sdc-side" aria-label="Twój zestaw">
          <h3 className="sdc-card-title">
            Twój zestaw
            {lines.length > 0 && (
              <button
                type="button"
                className="sdc-link sdc-link-danger"
                onClick={() => {
                  setSelections(emptySelections());
                  setOverrides({});
                  setAddedIds(new Set());
                }}
              >
                Wyczyść
              </button>
            )}
          </h3>
          <KitList
            lines={lines}
            total={total}
            busyId={busyId}
            addedIds={addedIds}
            onQty={changeQty}
            onRemove={removeLine}
            onAddOne={(line) => sendToCart([line], line.product.id)}
            onAddAll={() => sendToCart(lines, 'all')}
          />
        </aside>
      </div>

      {pickerPartDef && (
        <ProductPicker
          key={`${activeGarment}.${pickerPartDef.id}`}
          garmentLabel={garment.label}
          part={pickerPartDef}
          size={size}
          qty={partQty(pickerPartDef, size)}
          products={productsForPart(activeGarment, pickerPartDef, materials ?? [])}
          selectedId={selections[activeGarment][pickerPartDef.id]}
          onSelect={(product) => {
            setPart(activeGarment, pickerPartDef.id, product.id);
            setPickerPart(null);
          }}
          onClear={() => {
            setPart(activeGarment, pickerPartDef.id, null);
            setPickerPart(null);
          }}
          onClose={() => setPickerPart(null)}
        />
      )}

      <div className="sdc-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`sdc-toast sdc-toast-${t.kind}`}>
            {t.text}
            {t.link && <a href={t.link.href}>{t.link.text}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
