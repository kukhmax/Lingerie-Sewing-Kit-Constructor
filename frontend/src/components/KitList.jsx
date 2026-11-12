import ProductSwatch from './ProductSwatch.jsx';
import { formatPrice, formatQty } from '../lib/format.js';

// Lista zakupów: wszystkie wybrane materiały ze wszystkich wyrobów
export default function KitList({ lines, total, busyId, addedIds, onQty, onRemove, onAddOne, onAddAll }) {
  if (lines.length === 0) {
    return (
      <p className="sdc-empty">
        Lista jest pusta. Kliknij część wyrobu na rysunku i wybierz materiał — pojawi się tutaj.
      </p>
    );
  }

  const round2 = (n) => Math.round(n * 100) / 100;

  return (
    <>
      <ul className="sdc-kit">
        {lines.map((line) => {
          const { product, quantity, needed, step } = line;
          const id = product.id;
          const added = addedIds.has(id);
          return (
            <li key={id} className="sdc-kit-line">
              <ProductSwatch product={product} size="sm" />
              <div className="sdc-kit-main">
                <div className="sdc-kit-name">{product.name}</div>
                <div className="sdc-muted">{line.uses.map((u) => `${u.label} (${u.garmentLabel})`).join(', ')}</div>
                <div className="sdc-kit-controls">
                  <div className="sdc-stepper" role="group" aria-label={`Ilość: ${product.name}`}>
                    <button type="button" aria-label="Mniej" disabled={quantity <= step} onClick={() => onQty(id, round2(quantity - step), needed)}>
                      −
                    </button>
                    <span aria-live="polite">{formatQty(quantity, product.unit)}</span>
                    <button type="button" aria-label="Więcej" onClick={() => onQty(id, round2(quantity + step), needed)}>
                      +
                    </button>
                  </div>
                  <strong>{formatPrice(line.total)}</strong>
                </div>
                {quantity < needed && (
                  <div className="sdc-warn">Mniej niż potrzeba na ten wyrób ({formatQty(needed, product.unit)})</div>
                )}
                <div className="sdc-kit-actions">
                  <button type="button" className="sdc-link" disabled={busyId != null} onClick={() => onAddOne(line)}>
                    {busyId === id ? 'Dodaję…' : added ? '✓ W koszyku — dodaj ponownie' : 'Do koszyka'}
                  </button>
                  <button type="button" className="sdc-link sdc-link-danger" onClick={() => onRemove(line)}>
                    Usuń
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sdc-total">
        <span>Razem</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <button type="button" className="sdc-btn sdc-btn-primary sdc-btn-block" disabled={busyId != null} onClick={onAddAll}>
        {busyId === 'all' ? 'Dodaję…' : `Dodaj cały zestaw do koszyka (${lines.length})`}
      </button>
    </>
  );
}
