import React, { useState, useEffect } from 'react';
import BraSvg from './components/BraSvg';
import PantiesSvg from './components/PantiesSvg';
import NightgownSvg from './components/NightgownSvg';

// Default presets for the garments
const COLOR_PRESETS = [
  { name: 'Szmaragdowy Szyk', colors: { fabric: 'fab-lace-emerald', elastic: 'elas-strap-emerald', hardware: 'hard-gold-15', closure: 'clos-emerald-2', underwire: 'wire-tunnel-emerald' }, bg: '#047857' },
  { name: 'Wytworne Wino', colors: { fabric: 'fab-lace-wine', elastic: 'elas-strap-wine', hardware: 'hard-gold-15', closure: 'clos-wine-2', underwire: 'wire-tunnel-wine' }, bg: '#881337' },
  { name: 'Pudrowy Róż', colors: { fabric: 'fab-lace-blush', elastic: 'elas-strap-blush', hardware: 'hard-rose-12', closure: 'clos-blush-2', underwire: 'wire-tunnel-blush' }, bg: '#fda4af' },
  { name: 'Klasyczna Czerń', colors: { fabric: 'fab-micro-black', elastic: 'elas-strap-black', hardware: 'hard-black-15', closure: 'clos-black-2', underwire: 'wire-tunnel-black' }, bg: '#111827' }
];

export default function App() {
  const [activeGarment, setActiveGarment] = useState('bra'); // bra, panties, nightgown
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePart, setActivePart] = useState('cups'); // Current active part user clicked
  
  // Selection state for each garment and its parts
  const [selections, setSelections] = useState({
    bra: {
      cups: null,
      gore: null,
      wings: null,
      straps: null,
      elastics: null,
      underwires: null,
      hardware: null,
      closure: null
    },
    panties: {
      front: null,
      back: null,
      gusset: null,
      waist: null,
      legs: null
    },
    nightgown: {
      bodice: null,
      skirt: null,
      straps: null,
      underbust: null,
      trim: null
    }
  });

  // Load materials on mount
  useEffect(() => {
    fetch('/materials.json')
      .then(res => res.json())
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading materials:", err);
        setLoading(false);
      });
  }, []);

  // Update default active part based on chosen garment
  useEffect(() => {
    if (activeGarment === 'bra') setActivePart('cups');
    else if (activeGarment === 'panties') setActivePart('front');
    else if (activeGarment === 'nightgown') setActivePart('bodice');
  }, [activeGarment]);

  // Handle product selection for active part
  const selectProduct = (product) => {
    setSelections(prev => ({
      ...prev,
      [activeGarment]: {
        ...prev[activeGarment],
        [activePart]: product
      }
    }));
  };

  // Preset palette applicator
  const applyPreset = (preset) => {
    const matchedColors = preset.colors;
    const updatedGarment = { ...selections[activeGarment] };

    Object.keys(updatedGarment).forEach(partKey => {
      // Find a matching product in database by category and preset definition
      let cat = 'fabric';
      if (['straps', 'elastics', 'waist', 'legs', 'underbust'].includes(partKey)) cat = 'elastic';
      else if (['hardware'].includes(partKey)) cat = 'hardware';
      else if (['closure'].includes(partKey)) cat = 'closure';
      else if (['underwires'].includes(partKey)) cat = 'underwire';

      const presetProductId = matchedColors[cat];
      const product = materials.find(m => m.id === presetProductId);
      if (product) {
        updatedGarment[partKey] = product;
      }
    });

    setSelections(prev => ({
      ...prev,
      [activeGarment]: updatedGarment
    }));
  };

  // Get specs details of parts per garment
  const getGarmentPartsList = () => {
    switch (activeGarment) {
      case 'bra':
        return [
          { id: 'cups', label: 'Miseczki', req: 'fabric', desc: 'Główna koronka elastyczna lub stabilna' },
          { id: 'gore', label: 'Mostek', req: 'fabric', desc: 'Siatka stabilizująca' },
          { id: 'wings', label: 'Obwód biustonosza', req: 'fabric', desc: 'Mikrofibra lub gęsta siatka' },
          { id: 'straps', label: 'Ramiączka', req: 'elastic', desc: 'Taśma ramiączkowa elastyczna' },
          { id: 'elastics', label: 'Gumki wykończeniowe', req: 'elastic', desc: 'Gumka z pikotką/fetoonem' },
          { id: 'underwires', label: 'Fiszbiny i Tunele', req: 'underwire', desc: 'Taśma tunelowa + para fiszbin' },
          { id: 'hardware', label: 'Metalowe regulatory', req: 'hardware', desc: 'Komplet kółek i regulatorów' },
          { id: 'closure', label: 'Zapięcie tyłu', req: 'closure', desc: 'Haftki dwu- lub trzyrzędowe' }
        ];
      case 'panties':
        return [
          { id: 'front', label: 'Panel przedni', req: 'fabric', desc: 'Koronka lub miękka dzianina' },
          { id: 'back', label: 'Panel tylny', req: 'fabric', desc: 'Mikrofibra lub tiul elastyczny' },
          { id: 'gusset', label: 'Klin (Krok)', req: 'fabric', desc: 'Dzianina bawełniana/siatka' },
          { id: 'waist', label: 'Gumka w pasie', req: 'elastic', desc: 'Guma ozdobna' },
          { id: 'legs', label: 'Wykończenie nogawek', req: 'elastic', desc: 'Cienka gumka obszywkowa' }
        ];
      case 'nightgown':
        return [
          { id: 'bodice', label: 'Góra (Lifting/Lace)', req: 'fabric', desc: 'Główna koronka korpusu' },
          { id: 'skirt', label: 'Dół koszulki', req: 'fabric', desc: 'Lekka wiskoza lub satyna' },
          { id: 'straps', label: 'Ramiączka', req: 'elastic', desc: 'Taśma ramiączkowa' },
          { id: 'underbust', label: 'Gumka pod biustem', req: 'elastic', desc: 'Stabilizująca gumka' },
          { id: 'trim', label: 'Ozdobna falbanka', req: 'fabric', desc: 'Wąska koroneczka wykończeniowa' }
        ];
      default:
        return [];
    }
  };

  const currentParts = getGarmentPartsList();

  // Shopping list calculation
  const getSelectedItemsSummary = () => {
    const activeSelections = selections[activeGarment];
    const itemsMap = {};

    Object.keys(activeSelections).forEach(partKey => {
      const product = activeSelections[partKey];
      if (product) {
        if (!itemsMap[product.id]) {
          itemsMap[product.id] = {
            product,
            quantity: 0
          };
        }
        // Accumulate quantity based on standard consumption of the garment part
        const defaultQty = product.standard_qty || 1.0;
        itemsMap[product.id].quantity += defaultQty;
      }
    });

    return Object.values(itemsMap);
  };

  const shoppingList = getSelectedItemsSummary();
  const totalPrice = shoppingList.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Send selections to Laravel Cart API
  const handleAddToCart = () => {
    const payload = {
      items: shoppingList.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };

    fetch('/api/constructor/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Zestaw został pomyślnie dodany do koszyka!');
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
          }
        } else {
          alert('Błąd: ' + (data.error || 'Nie udało się dodać do koszyka.'));
        }
      })
      .catch(err => {
        console.error("Cart addition failed:", err);
        alert('Zestaw został dodany (Mock API: Dodano do koszyka ' + payload.items.length + ' produktów)');
      });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div>
          <a href="#" className="header-logo">
            Subtelne<span>Detale</span>
          </a>
          <div className="header-tagline">Konstruktor Zestawów Krawieckich</div>
        </div>

        {/* Garment Selector Tabs */}
        <div className="garment-selector">
          <button 
            className={`garment-btn ${activeGarment === 'bra' ? 'active' : ''}`}
            onClick={() => setActiveGarment('bra')}
          >
            Biustonosz
          </button>
          <button 
            className={`garment-btn ${activeGarment === 'panties' ? 'active' : ''}`}
            onClick={() => setActiveGarment('panties')}
          >
            Majtki
          </button>
          <button 
            className={`garment-btn ${activeGarment === 'nightgown' ? 'active' : ''}`}
            onClick={() => setActiveGarment('nightgown')}
          >
            Koszulka nocna
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="constructor-grid">
        
        {/* LEFT COLUMN: Product Catalog / Selection */}
        <section className="card">
          <h3 className="card-title">
            Materiały
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'normal' }}>
              Dla elementu: <strong>{currentParts.find(p => p.id === activePart)?.label}</strong>
            </span>
          </h3>

          {/* Filter badges */}
          <div className="category-filters">
            <button 
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Wszystko
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'fabric' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('fabric')}
            >
              Tkaniny i Koronki
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'elastic' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('elastic')}
            >
              Taśmy i Gumy
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'hardware' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('hardware')}
            >
              Akcesoria
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'closure' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('closure')}
            >
              Zapięcia
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'underwire' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('underwire')}
            >
              Tunele/Fiszbiny
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Ładowanie katalogu...</div>
          ) : (
            <div className="catalog-list">
              {materials
                .filter(m => selectedCategory === 'all' || m.category === selectedCategory)
                .map(product => {
                  const isSelected = selections[activeGarment][activePart]?.id === product.id;
                  return (
                    <div 
                      key={product.id}
                      className={`product-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectProduct(product)}
                    >
                      <div 
                        className="product-color-badge"
                        style={{ backgroundColor: product.colorHex }}
                      />
                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-meta">
                          <span>{product.description}</span>
                          <span className="product-price">{product.price.toFixed(2)} zł / {product.unit}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* MIDDLE COLUMN: Interactive Canvas */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 className="card-title" style={{ width: '100%' }}>Podgląd Projektu</h3>
          
          {/* Preset Palettes */}
          <div style={{ width: '100%', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
              Szybkie dopasowanie (Palety kolorystyczne):
            </div>
            <div className="presets-grid">
              {COLOR_PRESETS.map((preset, idx) => (
                <button 
                  key={idx} 
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="preset-swatch" style={{ backgroundColor: preset.bg }} />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="canvas-wrapper" style={{ width: '100%' }}>
            {activeGarment === 'bra' && (
              <BraSvg 
                activePart={activePart} 
                setActivePart={setActivePart} 
                selections={selections.bra} 
              />
            )}
            {activeGarment === 'panties' && (
              <PantiesSvg 
                activePart={activePart} 
                setActivePart={setActivePart} 
                selections={selections.panties} 
              />
            )}
            {activeGarment === 'nightgown' && (
              <NightgownSvg 
                activePart={activePart} 
                setActivePart={setActivePart} 
                selections={selections.nightgown} 
              />
            )}
          </div>

          {/* Active Part Info Bar */}
          <div style={{
            width: '100%', 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: 'var(--color-accent-light)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}>
            Kliknij na listę elementów po prawej, aby wybrać, co chcesz edytować, lub wybierz z katalogu materiał.
          </div>
        </section>

        {/* RIGHT COLUMN: Checklist / Order Summary */}
        <section className="card">
          <h3 className="card-title">
            Twoja kreacja
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
              {currentParts.filter(part => selections[activeGarment][part.id] !== null).length}/{currentParts.length}
            </span>
          </h3>

          {/* Progress Bar & Status */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              height: '6px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                height: '100%',
                width: `${(currentParts.filter(part => selections[activeGarment][part.id] !== null).length / currentParts.length) * 100}%`,
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            {currentParts.filter(part => selections[activeGarment][part.id] !== null).length === currentParts.length && (
              <div className="success-badge" style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.4rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem'
              }}>
                Zestaw kompletny i gotowy do szycia! 🎉
              </div>
            )}
          </div>
          
          <div className="summary-list">
            {currentParts.map(part => {
              const selectedItem = selections[activeGarment][part.id];
              const isSelected = activePart === part.id;
              
              return (
                <div 
                  key={part.id} 
                  className="summary-item"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent-light)' : 'transparent',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent'
                  }}
                  onClick={() => {
                    setActivePart(part.id);
                    // Automatically switch category filter if product type matches
                    if (part.req) setSelectedCategory(part.req);
                  }}
                >
                  <div className="summary-item-label">
                    <span style={{ fontSize: '1rem' }}>
                      {selectedItem ? '✅' : '🔴'}
                    </span>
                    <div>
                      <strong>{part.label}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{part.desc}</div>
                    </div>
                  </div>
                  <div className="summary-item-action" style={{ textAlign: 'right' }}>
                    {selectedItem ? (
                      <div>
                        <div style={{ fontSize: '0.85rem' }}>{selectedItem.colorName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                          {(selectedItem.standard_qty || 1.0)} {selectedItem.unit}
                        </div>
                      </div>
                    ) : (
                      <span className="warning-badge">Wybierz</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shopping Checklist & Total */}
          <div className="total-box">
            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Materiały do koszyka:
            </div>
            
            {shoppingList.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Brak wybranych materiałów. Wybierz kolory na schemacie lub liście.
              </p>
            ) : (
              <div style={{ maxHeight: '110px', overflowY: 'auto', marginBottom: '1rem', fontSize: '0.8rem' }}>
                {shoppingList.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{item.product.name} ({item.quantity.toFixed(2)} {item.product.unit})</span>
                    <span>{(item.product.price * item.quantity).toFixed(2)} zł</span>
                  </div>
                ))}
              </div>
            )}

            <div className="total-row">
              <span>Suma Zestawu:</span>
              <span className="total-price">{totalPrice.toFixed(2)} zł</span>
            </div>

            <button 
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={shoppingList.length === 0}
            >
              Dodaj zestaw do koszyka
            </button>
          </div>
        </section>

      </div>

    </div>
  );
}
