import { useEffect, useRef } from 'react';
import ProductSwatch from './ProductSwatch.jsx';
import { formatPrice, formatQty } from '../lib/format.js';
import { ceilToStep, stepFor } from '../lib/kit.js';

// Okno wyboru materiału dla jednej części. Pokazuje wyłącznie zgodne produkty.
export default function ProductPicker({ garmentLabel, part, qty, size, products, selectedId, onSelect, onClear, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="sdc-dialog"
      aria-labelledby="sdc-picker-title"
      onClose={onClose}
      onClick={(e) => {
        // kliknięcie w tło (poza treścią) zamyka okno
        if (e.target === ref.current) ref.current.close();
      }}
    >
      <div className="sdc-dialog-body">
        <header className="sdc-dialog-head">
          <div>
            <div className="sdc-eyebrow">{garmentLabel} · rozmiar {size}</div>
            <h3 id="sdc-picker-title">{part.label}</h3>
            <p className="sdc-muted">{part.hint}</p>
          </div>
          <button type="button" className="sdc-icon-btn" aria-label="Zamknij" onClick={() => ref.current.close()}>
            ×
          </button>
        </header>

        {products.length === 0 ? (
          <p className="sdc-empty">Brak materiałów pasujących do tej części. Zajrzyj do nas wkrótce.</p>
        ) : (
          <ul className="sdc-product-grid">
            {products.map((product) => {
              const selected = String(selectedId) === product.id;
              const need = ceilToStep(qty, stepFor(product));
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    className={`sdc-product ${selected ? 'is-selected' : ''}`}
                    aria-pressed={selected}
                    disabled={!product.inStock}
                    onClick={() => onSelect(product)}
                  >
                    <ProductSwatch product={product} size="lg" />
                    <span className="sdc-product-name">{product.name}</span>
                    {product.colorName && (
                      <span className="sdc-product-color">
                        <i style={{ backgroundColor: product.colorHex }} /> {product.colorName}
                      </span>
                    )}
                    <span className="sdc-product-price">
                      {formatPrice(product.price)} / {product.unit}
                    </span>
                    <span className="sdc-muted sdc-product-need">
                      {product.inStock
                        ? `Na tę część: ${formatQty(need, product.unit)} ≈ ${formatPrice(need * product.price)}`
                        : 'Chwilowo niedostępny'}
                    </span>
                    {selected && <span className="sdc-product-check">Wybrano</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="sdc-dialog-foot">
          {selectedId != null && (
            <button type="button" className="sdc-btn sdc-btn-ghost" onClick={onClear}>
              Usuń wybór
            </button>
          )}
          <button type="button" className="sdc-btn" onClick={() => ref.current.close()}>
            Zamknij
          </button>
        </footer>
      </div>
    </dialog>
  );
}
