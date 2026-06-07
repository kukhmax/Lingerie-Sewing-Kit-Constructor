import React, { useState, useEffect } from 'react';
import './App.css';
import GarmentVisualizer from './components/GarmentVisualizer';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

// Part definitions for each garment
const GARMENT_PARTS = {
  biustonosz: [
    { id: 'lace_elastic', name: 'Koronka elastyczna', category: 'fabric', required: false, isMain: true, qty: 1.0 },
    { id: 'lace_stable', name: 'Koronka stabilna', category: 'fabric', required: false, isMain: true, qty: 1.0 },
    { id: 'fabric_elastic', name: 'Tkanina elastyczna', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'fabric_stable', name: 'Tkanina stabilna', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'tulle_elastic', name: 'Tiul elastyczny', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'tulle_stable', name: 'Tiul stabilny', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'elastic_trim', name: 'Guma obszywkowa (obwód)', category: 'elastic_trim', required: true, isMain: false, qty: 1.5 },
    { id: 'elastic_strap', name: 'Guma ramiączkowa', category: 'elastic_strap', required: true, isMain: false, qty: 1.2 },
    { id: 'ring', name: 'Kółka metalowe', category: 'ring', required: true, isMain: false, qty: 2.0 },
    { id: 'slider', name: 'Regulatory metalowe', category: 'slider', required: true, isMain: false, qty: 2.0 },
    { id: 'closure', name: 'Zapięcie haftkowe', category: 'closure', required: true, isMain: false, qty: 1.0 },
    { id: 'underwire', name: 'Fiszbiny metalowe', category: 'underwire', required: true, isMain: false, qty: 1.0 },
    { id: 'bow', name: 'Kokardka ozdobna', category: 'bow', required: false, isMain: false, qty: 1.0 },
    { id: 'tunnel', name: 'Tunel gorseciarski', category: 'tunnel', required: true, isMain: false, qty: 1.5 },
    { id: 'threads', name: 'Nici Ariadna Talia 120', category: 'threads', required: true, isMain: false, qty: 1.0 }
  ],
  majtki: [
    { id: 'lace_elastic', name: 'Koronka elastyczna', category: 'fabric', required: false, isMain: true, qty: 1.5 },
    { id: 'lace_stable', name: 'Koronka stabilna', category: 'fabric', required: false, isMain: true, qty: 1.5 },
    { id: 'fabric_elastic', name: 'Tkanina elastyczna', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'tulle_elastic', name: 'Tiul elastyczny', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'gusset', name: 'Bawełna na klin', category: 'fabric', required: true, isMain: false, qty: 0.2 },
    { id: 'elastic_trim', name: 'Guma ozdobna (pas)', category: 'elastic_trim', required: true, isMain: false, qty: 2.0 },
    { id: 'threads', name: 'Nici do szwów płaskich', category: 'threads', required: true, isMain: false, qty: 1.0 }
  ],
  bralet: [
    { id: 'lace_elastic', name: 'Koronka elastyczna', category: 'fabric', required: false, isMain: true, qty: 1.5 },
    { id: 'lace_stable', name: 'Koronka stabilna', category: 'fabric', required: false, isMain: true, qty: 1.5 },
    { id: 'fabric_elastic', name: 'Tkanina elastyczna', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'fabric_stable', name: 'Tkanina stabilna', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'tulle_elastic', name: 'Tiul elastyczny', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'tulle_stable', name: 'Tiul stabilny', category: 'fabric', required: false, isMain: true, qty: 0.5 },
    { id: 'elastic_trim', name: 'Guma pod biust', category: 'elastic_trim', required: true, isMain: false, qty: 1.5 },
    { id: 'elastic_strap', name: 'Guma ramiączkowa', category: 'elastic_strap', required: true, isMain: false, qty: 1.2 },
    { id: 'ring', name: 'Kółka metalowe', category: 'ring', required: true, isMain: false, qty: 2.0 },
    { id: 'slider', name: 'Regulatory metalowe', category: 'slider', required: true, isMain: false, qty: 2.0 },
    { id: 'closure', name: 'Zapięcie haftkowe', category: 'closure', required: true, isMain: false, qty: 1.0 },
    { id: 'underwire', name: 'Fiszbiny boczne pionowe', category: 'underwire', required: false, isMain: false, qty: 2.0 },
    { id: 'tunnel', name: 'Tunel na fiszbiny boczne', category: 'tunnel', required: false, isMain: false, qty: 1.0 },
    { id: 'threads', name: 'Nici Ariadna Talia 120', category: 'threads', required: true, isMain: false, qty: 1.0 }
  ]
};

export default function App() {
  const [garment, setGarment] = useState('biustonosz');
  const [selectedPartId, setSelectedPartId] = useState('lace_elastic');
  const [selections, setSelections] = useState({});
  const [quantities, setQuantities] = useState({});
  const [primaryColor, setPrimaryColor] = useState(null);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Cart submission state
  const [submitting, setSubmitting] = useState(false);
  const [cartResult, setCartResult] = useState(null);
  
  // Show/Hide labels state for Bra Anatomy
  const [showLabels, setShowLabels] = useState(true);

  const activeParts = GARMENT_PARTS[garment];

  // Reset states when garment type changes
  useEffect(() => {
    setSelections({});
    setQuantities({});
    setPrimaryColor(null);
    // Select the first main part of the new garment
    const firstMain = GARMENT_PARTS[garment].find(p => p.isMain);
    setSelectedPartId(firstMain ? firstMain.id : 'fabric');
  }, [garment]);

  // Determine if a part is locked (disabled)
  const isPartLocked = (part) => {
    // If it's a main part, it's never locked at startup
    if (part.isMain) return false;
    // If primary color is selected (which means at least one main part is set), unlock everything
    return !primaryColor;
  };

  // Open modal and load products
  const handlePartClick = async (partId) => {
    const part = activeParts.find(p => p.id === partId);
    if (!part || isPartLocked(part)) return;

    setSelectedPartId(partId);
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);

    try {
      // Determine query params
      let url = `${API_BASE_URL}/api/materials?category=${part.category}`;
      if (primaryColor && !part.isMain) {
        url += `&primary_color=${encodeURIComponent(primaryColor)}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Nie udało się pobrać produktów.');
      const data = await res.json();
      
      // Special client-side filtering for gusset in panties (gusset is fabric category, but we only want cotton fabrics)
      let filteredData = data;
      if (garment === 'majtki' && partId === 'gusset') {
        filteredData = data.filter(p => p.id.includes('bawelna') || p.name.toLowerCase().includes('bawełna'));
      } else {
        if (partId === 'lace_elastic') {
          filteredData = data.filter(p => p.name.toLowerCase().includes('koronka') && !p.name.toLowerCase().includes('stabiln'));
        } else if (partId === 'lace_stable') {
          filteredData = data.filter(p => p.name.toLowerCase().includes('koronka') && p.name.toLowerCase().includes('stabiln'));
        } else if (partId === 'fabric_elastic') {
          filteredData = data.filter(p => (p.name.toLowerCase().includes('tkanina') || p.name.toLowerCase().includes('satyna')) && p.name.toLowerCase().includes('elastyczn') && !p.name.toLowerCase().includes('bawelna'));
        } else if (partId === 'fabric_stable') {
          filteredData = data.filter(p => p.name.toLowerCase().includes('tkanina') && p.name.toLowerCase().includes('stabiln'));
        } else if (partId === 'tulle_elastic') {
          filteredData = data.filter(p => p.name.toLowerCase().includes('tiul') && (p.name.toLowerCase().includes('elastyczn') || p.name.toLowerCase().includes('siatka')));
        } else if (partId === 'tulle_stable') {
          filteredData = data.filter(p => p.name.toLowerCase().includes('tiul') && p.name.toLowerCase().includes('stabiln'));
        }
      }

      setModalProducts(filteredData);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // User selects a product in the modal
  const handleSelectProduct = (product) => {
    const part = activeParts.find(p => p.id === selectedPartId);
    if (!part) return;

    const updatedSelections = { ...selections, [selectedPartId]: product };
    setSelections(updatedSelections);

    // If no quantity set yet, set the standard quantity from part definition
    if (!quantities[selectedPartId]) {
      setQuantities({ ...quantities, [selectedPartId]: product.standard_qty || part.qty });
    }

    // Handle primary color locking logic
    if (part.isMain) {
      // Check if this sets or changes the primary color
      setPrimaryColor(product.colorName);
    }

    setModalOpen(false);
  };

  // Remove selection for a part
  const handleRemoveSelection = (partId, e) => {
    e.stopPropagation();
    const updatedSelections = { ...selections };
    delete updatedSelections[partId];
    setSelections(updatedSelections);

    const updatedQuantities = { ...quantities };
    delete updatedQuantities[partId];
    setQuantities(updatedQuantities);

    // If no main parts are selected anymore, reset primary color
    const remainingMainSelections = activeParts
      .filter(p => p.isMain && p.id !== partId)
      .map(p => updatedSelections[p.id])
      .filter(Boolean);

    if (remainingMainSelections.length === 0) {
      setPrimaryColor(null);
    } else {
      setPrimaryColor(remainingMainSelections[0].colorName);
    }
  };

  // Adjust quantity
  const handleQtyChange = (partId, change) => {
    const currentQty = quantities[partId] || 1.0;
    const step = selectedPartId === 'hardware' || selectedPartId === 'closure' || selectedPartId === 'bow' || selectedPartId === 'underwire' || selectedPartId === 'cup_insert' ? 1.0 : 0.1;
    const newQty = Math.max(step, currentQty + (change * step));
    setQuantities({ ...quantities, [partId]: parseFloat(newQty.toFixed(1)) });
  };

  // Calculate stats
  const selectedCount = activeParts.filter(p => selections[p.id]).length;
  const requiredParts = activeParts.filter(p => p.required);
  
  const hasMainMaterial = activeParts.some(p => p.isMain && selections[p.id]);
  const requiredCompleted = hasMainMaterial && requiredParts.every(p => selections[p.id]);
    
  const progressPercent = Math.round((selectedCount / activeParts.length) * 100);

  const selectedMainPart = activeParts.find(p => p.isMain && selections[p.id]);
  const primaryColorHex = selectedMainPart ? selections[selectedMainPart.id].colorHex : null;

  const totalPrice = Object.entries(selections).reduce((sum, [partId, product]) => {
    const qty = quantities[partId] || product.standard_qty || 1.0;
    return sum + (product.price * qty);
  }, 0);

  // Submit kit to cart
  const handleAddToCart = async () => {
    if (selectedCount === 0) return;

    setSubmitting(true);
    setCartResult(null);

    try {
      const items = Object.entries(selections).map(([partId, product]) => ({
        product_id: product.id,
        quantity: quantities[partId] || product.standard_qty || 1.0
      }));

      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Wystąpił błąd przy dodawaniu do koszyka.');
      }

      const data = await res.json();
      setCartResult(data);
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper mapping colors to HTML hex for the canvas visualizer
  const partColorsForVisualizer = {};
  activeParts.forEach(p => {
    if (selections[p.id]) {
      partColorsForVisualizer[p.id] = selections[p.id].colorHex;
    }
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo-container">
          <h1 className="brand-title">Subtelne Detale</h1>
          <span className="brand-subtitle">Konstruktor Zestawów Szyciowych</span>
        </div>
        <div className="header-actions">
          {primaryColor && (
            <div className="color-harmony-indicator">
              <span>Kolor wiodący:</span>
              <span className="color-harmony-tag">{primaryColor}</span>
            </div>
          )}
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="main-workspace">
        {/* LEFT SIDEBAR: PARTS LIST */}
        <section className="sidebar left-sidebar">
          <div className="card-panel">
            <div className="garment-select-group">
              <span className="garment-select-label">Wybierz model</span>
              <select 
                className="garment-select" 
                value={garment} 
                onChange={(e) => setGarment(e.target.value)}
              >
                <option value="biustonosz">Biustonosz (Klasyczny klasyk)</option>
                <option value="majtki">Majtki (Klasyczne figi)</option>
                <option value="bralet">Bralet (Trójkątny bralet)</option>
              </select>
            </div>
          </div>

          <div className="card-panel">
            <div className="panel-header">
              <h3 className="panel-title">Elementy zestawu</h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedCount}/{activeParts.length}</span>
            </div>

            <div className="selection-progress-bar">
              <div 
                className="selection-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="parts-list">
              {/* Sektor Materiał główny */}
              <div className="main-materials-group">
                <div className="main-materials-group-header">
                  <div className="main-materials-title-row">
                    <span className="main-materials-group-title">Materiał główny</span>
                    {primaryColor && (
                      <div className="primary-color-badge">
                        <span className="primary-color-name">{primaryColor}</span>
                        <span 
                          className="color-indicator-dot" 
                          style={{ 
                            backgroundColor: primaryColorHex || '#ccc' 
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="main-materials-group-desc">
                    Wybierz materiał z proponowanych dla wyboru głównego koloru produktu.
                  </p>
                </div>

                <div className="main-materials-items">
                  {activeParts.filter(p => p.isMain).map((part) => {
                    const isLocked = isPartLocked(part);
                    const isSelected = !!selections[part.id];
                    const activeClass = selectedPartId === part.id ? 'active' : '';
                    const lockedClass = isLocked ? 'disabled' : '';

                    return (
                      <div 
                        key={part.id}
                        className={`part-item ${activeClass} ${lockedClass}`}
                        onClick={() => handlePartClick(part.id)}
                      >
                        <div className="part-item-info">
                          <span className="part-name">
                            {part.name} {part.required && <span style={{ color: 'var(--color-error)' }}>*</span>}
                          </span>
                          {isSelected && (
                            <span className="part-color-selected">
                              {selections[part.id].colorName} • {(quantities[part.id] || part.qty)}{selections[part.id].unit}
                            </span>
                          )}
                        </div>
                        <div className="display-flex align-items-center gap-2">
                          {isSelected && (
                            <span 
                              className="modal-close-btn" 
                              style={{ fontSize: '1rem', marginRight: '8px' }}
                              onClick={(e) => handleRemoveSelection(part.id, e)}
                            >
                              ✕
                            </span>
                          )}
                          <span className={`part-status-badge ${isSelected ? 'completed' : 'pending'}`}></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pozostałe akcesoria */}
              {activeParts.filter(p => !p.isMain).map((part) => {
                const isLocked = isPartLocked(part);
                const isSelected = !!selections[part.id];
                const activeClass = selectedPartId === part.id ? 'active' : '';
                const lockedClass = isLocked ? 'disabled' : '';

                return (
                  <div 
                    key={part.id}
                    className={`part-item ${activeClass} ${lockedClass}`}
                    onClick={() => handlePartClick(part.id)}
                  >
                    <div className="part-item-info">
                      <span className="part-name">
                        {part.name} {part.required && <span style={{ color: 'var(--color-error)' }}>*</span>}
                      </span>
                      {isSelected ? (
                        <span className="part-color-selected">
                          {selections[part.id].colorName} • {(quantities[part.id] || part.qty)}{selections[part.id].unit}
                        </span>
                      ) : isLocked ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          🔒 Zablokowane (wybierz materiał)
                        </span>
                      ) : null}
                    </div>
                    <div className="display-flex align-items-center gap-2">
                      {isSelected && (
                        <span 
                          className="modal-close-btn" 
                          style={{ fontSize: '1rem', marginRight: '8px' }}
                          onClick={(e) => handleRemoveSelection(part.id, e)}
                        >
                          ✕
                        </span>
                      )}
                      <span className={`part-status-badge ${isSelected ? 'completed' : 'pending'}`}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MIDDLE: VISUALIZER CANVAS */}
        <section className="canvas-area">
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              {garment === 'biustonosz' ? 'Biustonosz' : garment === 'majtki' ? 'Majtki Figi' : 'Bralet Trójkątny'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '450px' }}>
              Wybierz główny materiał szyciowy, aby dopasować resztę elementów w harmonijnych kolorach. Klikaj na części rysunku lub listę z lewej.
            </p>
          </div>

          {garment === 'biustonosz' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setShowLabels(!showLabels)}
                className="btn-toggle-labels"
                style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '25px',
                  border: '1px solid #c9a236',
                  background: 'rgba(250, 247, 242, 0.9)',
                  cursor: 'pointer',
                  color: '#222',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Montserrat, sans-serif'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#c9a236';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(201, 162, 54, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(250, 247, 242, 0.9)';
                  e.currentTarget.style.color = '#222';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
              >
                <span>{showLabels ? '👁️ Ukryj opisy części' : '👁️ Pokaż opisy części'}</span>
              </button>
            </div>
          )}

          <GarmentVisualizer 
            garmentType={garment}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
            partColors={partColorsForVisualizer}
            showLabels={showLabels}
          />
        </section>

        {/* RIGHT SIDEBAR: SHOPPING CART */}
        <section className="sidebar cart-sidebar">
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header">
              <h3 className="panel-title">Twój Zestaw Szyciowy</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {selectedCount === 0 ? (
                <div className="empty-cart-message">
                  Rozpocznij kompletowanie zestawu wybierając tkaninę lub koronkę.
                </div>
              ) : (
                <div className="cart-items-list">
                  {activeParts.map((part) => {
                    const product = selections[part.id];
                    if (!product) return null;
                    const qty = quantities[part.id] || product.standard_qty || part.qty;

                    return (
                      <div key={part.id} className="cart-item-row">
                        <img 
                          className="cart-item-img" 
                          src={product.image || 'https://subtelnedetale.pl/wp-content/uploads/81.jpg'} 
                          alt={product.name} 
                        />
                        <div className="cart-item-details">
                          <span className="cart-item-name" title={product.name}>
                            {product.name}
                          </span>
                          <div className="cart-item-qty-price">
                            {/* Quantity controller */}
                            <div className="qty-controller">
                              <button className="qty-btn" onClick={() => handleQtyChange(part.id, -1)}>-</button>
                              <span className="qty-val">{qty}{product.unit}</span>
                              <button className="qty-btn" onClick={() => handleQtyChange(part.id, 1)}>+</button>
                            </div>
                            <span className="cart-item-price-sum">
                              {(product.price * qty).toFixed(2)} zł
                            </span>
                          </div>
                        </div>
                        <button 
                          className="cart-item-remove-btn" 
                          onClick={(e) => handleRemoveSelection(part.id, e)}
                          title="Usuń z zestawu"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="cart-total-section">
              <div className="cart-total-row">
                <span>Łącznie (szacunkowo):</span>
                <span className="cart-total-price">{totalPrice.toFixed(2)} zł</span>
              </div>

              <button 
                className="btn-gold"
                disabled={selectedCount === 0 || submitting}
                onClick={handleAddToCart}
              >
                {submitting ? 'Dodawanie...' : 'Dodaj zestaw do koszyka'}
              </button>

              {selectedCount > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                  * Możesz zamówić kompletny zestaw lub pojedyncze elementy.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* POPUP MODAL FOR SELECTING PRODUCT */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="material-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Wybierz: {activeParts.find(p => p.id === selectedPartId)?.name}
              </h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              {primaryColor && !activeParts.find(p => p.id === selectedPartId)?.isMain && (
                <div className="compatibility-notice">
                  ✨ Filtrujemy produkty kompatybilne z kolorem: <strong>{primaryColor}</strong> (Zasada harmonii barw)
                </div>
              )}

              {modalLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Wyszukiwanie produktów z subtelnedetale.pl...
                </div>
              ) : modalError ? (
                <div style={{ color: 'var(--color-error)', padding: '1rem', textAlign: 'center' }}>
                  Błąd: {modalError}
                </div>
              ) : modalProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Brak kompatybilnych produktów w magazynie.
                </div>
              ) : (
                <div className="materials-grid">
                  {modalProducts.map((product) => {
                    const isSelected = selections[selectedPartId]?.id === product.id;
                    return (
                      <div 
                        key={product.id}
                        className={`material-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <img 
                          className="material-thumbnail"
                          src={product.image || 'https://subtelnedetale.pl/wp-content/uploads/81.jpg'}
                          alt={product.name}
                        />
                        <div className="material-details">
                          <span className="material-name" title={product.name}>
                            {product.name}
                          </span>
                          <div className="material-meta">
                            <span className="material-price">
                              {product.price.toFixed(2)} zł / {product.unit}
                            </span>
                            <span 
                              className="color-indicator-dot"
                              style={{ backgroundColor: product.colorHex }}
                              title={product.colorName}
                            ></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY FOR CART SUBMISSION */}
      {cartResult && (
        <div className="modal-overlay">
          <div className="material-modal" style={{ maxWidth: '480px', textAlign: 'center', padding: '2rem' }}>
            <span style={{ fontSize: '3rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-success)', margin: '1rem 0' }}>
              Zestaw skompletowany!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {cartResult.message} Wszystkie elementy zostały pomyślnie dodane. Możesz teraz sfinalizować transakcję w sklepie.
            </p>
            <div className="card-panel" style={{ textAlign: 'left', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Dodane pozycje:</h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                {cartResult.added_items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>
                    {item.name} - {item.quantity} x {item.price.toFixed(2)} zł (<strong>{item.total_price.toFixed(2)} zł</strong>)
                  </li>
                ))}
              </ul>
            </div>
            <a 
              href={cartResult.redirect_url} 
              className="btn-gold" 
              style={{ width: '100%', display: 'inline-flex' }}
            >
              Przejdź do kasy sklepu
            </a>
            <button 
              className="qty-btn" 
              style={{ width: '100%', marginTop: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', height: '36px' }}
              onClick={() => setCartResult(null)}
            >
              Wróć do konstruktora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
