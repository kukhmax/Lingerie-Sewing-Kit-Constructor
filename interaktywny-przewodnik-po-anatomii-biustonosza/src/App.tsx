import { useState, useMemo } from 'react';
import { braParts } from './data.ts';
import { BraPartId, BraPart } from './types.ts';
import { BraSvg } from './components/BraSvg.tsx';
import { 
  Sparkles, 
  HelpCircle, 
  Palette, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Ruler, 
  Layers, 
  BookOpen, 
  Award,
  ChevronRight,
  Info,
  Check,
  FlameKindling
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Preset color themes for the Bra Colorizer
const COLOR_PRESETS = [
  {
    name: 'Atelier Noir (Czerń)',
    colors: {
      miseczki: '#1e293b',
      material: '#0f172a',
      koronka: '#475569',
      tiul_elastyczny: '#334155',
      tiul_stabilny: '#1e293b',
      guma_obszywkowa: '#020617',
      guma_ramiackowa: '#020617',
      kolka: '#f59e0b', // Gold hardware
      regulatory: '#f59e0b',
      haftka: '#1e293b',
      fiszbiny: '#64748b',
      tunel_gorseciarski: '#0f172a',
      kokardka: '#be123c', // Red bow accent
    }
  },
  {
    name: 'Różany Kwarc (Pastel)',
    colors: {
      miseczki: '#fdf2f8',
      material: '#fce7f3',
      koronka: '#f472b6',
      tiul_elastyczny: '#fce7f3',
      tiul_stabilny: '#fbcfe8',
      guma_obszywkowa: '#ec4899',
      guma_ramiackowa: '#ec4899',
      kolka: '#e2e8f0', // Silver hardware
      regulatory: '#e2e8f0',
      haftka: '#fbcfe8',
      fiszbiny: '#f472b6',
      tunel_gorseciarski: '#fbcfe8',
      kokardka: '#db2777',
    }
  },
  {
    name: 'Klasyczny Nude (Cielisty)',
    colors: {
      miseczki: '#faf8f5',
      material: '#f1ebd9',
      koronka: '#dfcfb1',
      tiul_elastyczny: '#f2eae1',
      tiul_stabilny: '#ebdccb',
      guma_obszywkowa: '#cfbca2',
      guma_ramiackowa: '#cfbca2',
      kolka: '#f59e0b', // Gold
      regulatory: '#f59e0b',
      haftka: '#cfbca2',
      fiszbiny: '#dfcfb1',
      tunel_gorseciarski: '#cfbca2',
      kokardka: '#cfbca2',
    }
  }
];

export default function App() {
  // 1. Core Selection States
  const [selectedPartId, setSelectedPartId] = useState<BraPartId | null>('miseczki');
  const [hoveredPartId, setHoveredPartId] = useState<BraPartId | null>(null);
  
  // 2. Custom Coloring state
  const defaultColors = useMemo(() => {
    return braParts.reduce((acc, part) => {
      acc[part.id] = part.color;
      return acc;
    }, {} as Record<BraPartId, string>);
  }, []);

  const [partColors, setPartColors] = useState<Record<BraPartId, string>>(defaultColors);
  const [visibleLabels, setVisibleLabels] = useState<boolean>(true);

  // 3. Advisor and Calculator size states
  const [bandSize, setBandSize] = useState<number>(75);
  const [cupSize, setCupSize] = useState<string>('B');

  // 4. Active tab inside the info card
  const [activeTab, setActiveTab] = useState<'info' | 'sewing' | 'shopping'>('info');

  // 5. Quiz state
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizTarget, setQuizTarget] = useState<BraPart | null>(null);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizFeedback, setQuizFeedback] = useState<{ status: 'correct' | 'incorrect' | null; message: string }>({
    status: null,
    message: ''
  });

  // Calculate shopping lengths based on chosen size
  const calculatedSpecs = useMemo(() => {
    // Basic heuristics for strap widths and elastic lengths based on size
    const totalStrapLength = Math.round(bandSize * 0.6 + 5); // typical strap length in cm per side
    const bottomElasticLength = Math.round(bandSize * 0.85); // underband elastic with negative ease fold-over
    const underwireSize = (() => {
      // rough underwire sizing approximation
      const sizeIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].indexOf(cupSize);
      return 70 + (bandSize - 70) + (sizeIndex * 5); // e.g. 75B -> size 80/85
    })();

    const strapWidth = ['E', 'F', 'G', 'H'].includes(cupSize) ? '15 - 20 mm (Zalecane szerokie)' : '10 - 12 mm';
    const hookEyeHeight = ['E', 'F', 'G', 'H'].includes(cupSize) ? '3 rzędy (57 mm)' : '2 rzędy (38 mm)';
    const backPowernet = ['E', 'F', 'G', 'H'].includes(cupSize) ? 'Mocny powernet (min. 220g/m²)' : 'Standardowy Powernet (150-180g/m²)';

    return {
      totalStrapLength,
      bottomElasticLength,
      underwireSize,
      strapWidth,
      hookEyeHeight,
      backPowernet
    };
  }, [bandSize, cupSize]);

  // Selected object
  const currentPart = useMemo(() => {
    return braParts.find(p => p.id === (selectedPartId || hoveredPartId || 'miseczki'))!;
  }, [selectedPartId, hoveredPartId]);

  // Set color for a single part from the UI
  const handleColorChange = (id: BraPartId, colorHex: string) => {
    setPartColors(prev => ({
      ...prev,
      [id]: colorHex
    }));
  };

  // Reset colors
  const handleResetColors = () => {
    setPartColors(defaultColors);
  };

  // Apply a full preset theme
  const applyPresetTheme = (presetColors: Record<BraPartId, string>) => {
    setPartColors(presetColors);
  };

  // Quiz mechanics
  const startNewQuizRound = () => {
    const randomIndex = Math.floor(Math.random() * braParts.length);
    setQuizTarget(braParts[randomIndex]);
    setQuizFeedback({ status: null, message: '' });
  };

  const handleToggleQuizMode = () => {
    if (!quizMode) {
      setQuizMode(true);
      setQuizScore({ correct: 0, total: 0 });
      // Select random item
      const randomIndex = Math.floor(Math.random() * braParts.length);
      setQuizTarget(braParts[randomIndex]);
    } else {
      setQuizMode(false);
      setQuizTarget(null);
    }
  };

  const handleSvgPartSelect = (id: BraPartId) => {
    if (quizMode && quizTarget) {
      if (id === quizTarget.id) {
        setQuizScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback({
          status: 'correct',
          message: `Doskonale! To jest właśnie: "${quizTarget.name}".`
        });
        setTimeout(() => {
          startNewQuizRound();
        }, 1800);
      } else {
        setQuizScore(prev => ({ ...prev, total: prev.total + 1 }));
        const clickedPart = braParts.find(p => p.id === id);
        setQuizFeedback({
          status: 'incorrect',
          message: `To nie to. Kliknąłeś "${clickedPart?.name}". Spróbuj znaleźć: "${quizTarget.name}".`
        });
      }
    } else {
      setSelectedPartId(id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-slate-800 font-sans flex flex-col selection:bg-pink-100 selection:text-pink-900">
      {/* Header section styled like a premium atelier journal */}
      <header className="border-b border-stone-200 bg-white/85 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                Gorseciarstwo & Konstrukcje
              </span>
              <span className="text-[10px] text-slate-400 font-mono">v1.1</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Anatomia Biustonosza Szytego na Miarę
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-sans mt-0.5">
              Interaktywny wzorzec materiałowy i konstrukcyjny SVG dla kreatorów bielizny damskiej.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View controls */}
            <button
              onClick={() => setVisibleLabels(!visibleLabels)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition"
              title="Pokaż/ukryj linie pomocnicze"
            >
              {visibleLabels ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              {visibleLabels ? 'Ukryj opisy' : 'Pokaż opisy'}
            </button>

            <button
              onClick={handleToggleQuizMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                quizMode 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {quizMode ? 'Zakończ Quiz' : 'Tryb Quizu / Test'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: The Interactive SVG Canvas & Theme tools (lg:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          {/* Active Quiz Banner if playing */}
          {quizMode && quizTarget && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-lg animate-pulse">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Gra edukacyjna: Poziom Ściegu
                  </span>
                  <p className="text-sm text-slate-700">
                    Kliknij na rysunku biustonosza element: <strong className="text-indigo-950 font-semibold text-base">"{quizTarget.name}"</strong>
                  </p>
                </div>
              </div>

              {/* Quiz Stats */}
              <div className="flex items-center gap-4 bg-white/80 border border-slate-200 rounded-lg px-3 py-1.5 text-xs shrink-0 font-semibold">
                <span className="text-emerald-700">Dobrze: {quizScore.correct}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600">Suma prób: {quizScore.total}</span>
              </div>
            </motion.div>
          )}

          {/* Quick Quiz Feedback */}
          {quizFeedback.message && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3 rounded-lg text-xs font-medium text-center border ${
                quizFeedback.status === 'correct' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}
            >
              {quizFeedback.message}
            </motion.div>
          )}

          {/* The SVG Canvas Box */}
          <div className="flex flex-col bg-white border border-stone-200 rounded-3xl p-4 shadow-sm overflow-hidden relative">
            
            {/* SVG Interaction Guides */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2 px-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                <span>Interaktywny model wektorowy</span>
              </div>
              <div>
                {selectedPartId ? (
                  <span>Wybrano: <strong className="text-slate-600">{braParts.find(p => p.id === selectedPartId)?.name}</strong></span>
                ) : (
                  <span>Najedź lub kliknij część, by wyodrębnić</span>
                )}
              </div>
            </div>

            {/* Render the core Bra Svg component */}
            <BraSvg
              selectedPart={selectedPartId}
              hoveredPart={hoveredPartId}
              onPartSelect={handleSvgPartSelect}
              onPartHover={setHoveredPartId}
              partColors={partColors}
              visibleLabels={visibleLabels}
            />

            {/* Instruction footnote */}
            <div className="text-center mt-3 text-xs text-slate-400 italic">
              *Rysunek przedstawia model typu "Balconette / Full Band". Kliknij dowolny element biustonosza, aby wyświetlić jego parametry techniczne w panelu bocznym.
            </div>
          </div>

          {/* COLORING STUDI0 / CUSTOMIZATON SECTION */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Palette className="w-5 h-5 text-pink-600" />
                <h3 className="font-serif text-lg font-semibold text-slate-900">Atelier Projektowe (Kolorowanie Produktu)</h3>
              </div>
              <button
                onClick={handleResetColors}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded"
              >
                <RotateCcw className="w-3 h-3" /> Przywróć kolory fabryczne
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
              Zmień kolorystykę poszczególnych komponentów, aby zaprojektować własną kolekcję. Wypróbuj gotowe szablony kolorystyczne zgodne z najnowszymi trendami:
            </p>

            {/* Preset theme buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPresetTheme(preset.colors)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-left"
                >
                  <span>{preset.name}</span>
                  {/* Minidots previewing colors */}
                  <div className="flex gap-0.5">
                    <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: preset.colors.material }} />
                    <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: preset.colors.koronka }} />
                    <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: preset.colors.guma_obszywkowa }} />
                  </div>
                </button>
              ))}
            </div>

            {/* Manual Color Picker by Part */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                Ręczny dobór barw komponentów
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {braParts.map((part) => (
                  <div 
                    key={part.id}
                    className={`p-2 rounded-xl transition border text-left flex items-center justify-between ${
                      selectedPartId === part.id 
                        ? 'border-pink-500 bg-pink-50/20' 
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <button
                        onClick={() => setSelectedPartId(part.id)}
                        className="text-[11px] font-medium text-slate-700 block truncate hover:underline text-left w-full"
                      >
                        {part.name.split(' (')[0]}
                      </button>
                    </div>
                    
                    {/* color inputs */}
                    <input
                      type="color"
                      value={partColors[part.id]}
                      onChange={(e) => handleColorChange(part.id, e.target.value)}
                      className="w-5 h-5 rounded-full overflow-hidden cursor-pointer border border-slate-300 outline-none p-0 shrink-0"
                      title={`Zmień kolor dla: ${part.name}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Sidebar & Sizing Assistant (lg:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          
          {/* SIZNG ASSISTANT CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm self-start w-full border border-slate-800">
            <h3 className="font-serif text-lg font-semibold mb-1 flex items-center gap-2">
              <Ruler className="text-pink-400 w-5 h-5 shrink-0" />
              <span>Asystent Konstruktora Miarowego</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-4">
              Wybierz docelowy rozmiar biustonosza, aby zaktualizować sugerowane parametry techniczne materiałów i akcesoriów.
            </p>

            {/* Sizing Selectors */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">
                  Obwód pod biustem (Rozmiar)
                </label>
                <select
                  value={bandSize}
                  onChange={(e) => setBandSize(Number(e.target.value))}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/80 rounded-xl px-2.5 py-2 font-mono outline-none focus:border-pink-500"
                >
                  <option value={60}>60 cm</option>
                  <option value={65}>65 cm</option>
                  <option value={70}>70 cm</option>
                  <option value={75}>75 cm</option>
                  <option value={80}>80 cm</option>
                  <option value={85}>85 cm</option>
                  <option value={90}>90 cm</option>
                  <option value={95}>95 cm</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">
                  Wielkość miseczki
                </label>
                <select
                  value={cupSize}
                  onChange={(e) => setCupSize(e.target.value)}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/80 rounded-xl px-2.5 py-2 font-mono outline-none focus:border-pink-500"
                >
                  <option value="A">Cup A</option>
                  <option value="B">Cup B</option>
                  <option value="C">Cup C</option>
                  <option value="D">Cup D</option>
                  <option value="E">Cup E</option>
                  <option value="F">Cup F</option>
                  <option value="G">Cup G</option>
                  <option value="H">Cup H</option>
                </select>
              </div>
            </div>

            {/* Live Calculations Output inside Sizing Assistant */}
            <div className="space-y-2 text-xs border-t border-slate-700/60 pt-3.5">
              <div className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg">
                <span className="text-slate-400">Ramiączka (Szerokość):</span>
                <span className="font-semibold text-pink-300 font-mono">{calculatedSpecs.strapWidth}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg">
                <span className="text-slate-400">Długość ramiączek (zapas):</span>
                <span className="font-semibold text-slate-100 font-mono">2x {calculatedSpecs.totalStrapLength} cm</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg">
                <span className="text-slate-400">Rozmiar fiszbin (Regular):</span>
                <span className="font-semibold text-emerald-400 font-mono">Size {calculatedSpecs.underwireSize}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg">
                <span className="text-slate-400">Guma obwodu (Długość):</span>
                <span className="font-semibold text-slate-100 font-mono">~{calculatedSpecs.bottomElasticLength} cm</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg">
                <span className="text-slate-400">Zapięcie (Wysokość):</span>
                <span className="font-semibold text-slate-100 font-mono">{calculatedSpecs.hookEyeHeight}</span>
              </div>
              <div className="flex justify-between items-start bg-slate-800/45 p-2 rounded-lg">
                <span className="text-slate-400 shrink-0">Zalecana baza tyłu:</span>
                <span className="font-semibold text-[11px] text-pink-300 text-right">{calculatedSpecs.backPowernet}</span>
              </div>
            </div>
          </div>

          {/* ACTIVE BRA COMPONENT DETAILS WINDOW */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex-1 flex flex-col min-h-[380px]">
            
            {/* Header info about the current selected part */}
            <div className="mb-4">
              <span className="text-[9px] font-bold text-pink-600 bg-pink-50 rounded-full px-2.5 py-0.5 uppercase tracking-wider block w-max mb-1.5">
                {currentPart.categoryLabel}
              </span>
              <h2 className="font-serif text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ backgroundColor: partColors[currentPart.id] }} />
                {currentPart.name}
              </h2>
            </div>

            {/* TAB SELECTOR inside info card */}
            <div className="flex border-b border-stone-100 gap-1.5 mb-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2.5 px-1 relative transition shrink-0 ${
                  activeTab === 'info' 
                    ? 'text-pink-600 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Charakterystyka
                {activeTab === 'info' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />}
              </button>
              
              <button
                onClick={() => setActiveTab('sewing')}
                className={`pb-2.5 px-1 relative transition shrink-0 ${
                  activeTab === 'sewing' 
                    ? 'text-pink-600 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Technika szycia
                {activeTab === 'sewing' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />}
              </button>

              <button
                onClick={() => setActiveTab('shopping')}
                className={`pb-2.5 px-1 relative transition shrink-0 ${
                  activeTab === 'shopping' 
                    ? 'text-pink-600 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Zakupy & Zapotrzebowanie
                {activeTab === 'shopping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />}
              </button>
            </div>

            {/* TAB PANEL CONTENTS - Animated with standard transition */}
            <div className="flex-1 flex flex-col text-slate-700 text-xs sm:text-xs">
              
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Opis Elementu:</span>
                      <p className="leading-relaxed text-slate-600 font-sans">{currentPart.description}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">Rola w Biustonoszu:</span>
                        <p className="font-semibold text-slate-900">{currentPart.sewingRole}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">Parametry Typowe:</span>
                        <p className="font-sans text-slate-600">{currentPart.typicalProperties}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'sewing' && (
                  <motion.div
                    key="sewing"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3.5"
                  >
                    <div className="flex gap-2.5 bg-pink-50/40 p-3 rounded-xl border border-pink-100 text-slate-700 leading-relaxed font-sans">
                      <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-pink-900 block mb-0.5">Porada krawiecka dla: {currentPart.name}</span>
                        {currentPart.sewingTip}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 font-semibold block mb-1">Zalecane igły i naprężenia nici:</strong>
                      Dla elastycznych dzianin i gum używaj igieł typu <strong>Super Stretch</strong> lub <strong>Ball Point 75/11</strong>. W przypadku materiałów stabilnych (tiul stabilny, lny gorseciarskie) używaj igieł <strong>Microtex 70/10 lub 80/12</strong>, aby nie uszkodzić delikatnych włókien nylonu.
                    </div>
                  </motion.div>
                )}

                {activeTab === 'shopping' && (
                  <motion.div
                    key="shopping"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3.5"
                  >
                    <p className="text-slate-500 leading-relaxed">
                      Wskazanie ilościowe przeliczone na podstawie wybranego rozmiaru: <strong className="text-slate-800 font-semibold">{bandSize}{cupSize}</strong>:
                    </p>

                    <div className="space-y-2">
                      <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Podstawowy Koszyk Zakupów:</span>
                        <div className="space-y-1 mt-1 text-slate-700 font-mono text-[11px]">
                          {currentPart.id === 'guma_ramiackowa' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Taśma ramiączkowa ({calculatedSpecs.strapWidth}):</span>
                              <span className="font-bold">2 x {calculatedSpecs.totalStrapLength + 10} cm</span>
                            </div>
                          )}
                          {currentPart.id === 'guma_obszywkowa' && (
                            <div className="text-slate-700 space-y-1">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span>Guma pod biust (szeroka):</span>
                                <span className="font-bold">~{calculatedSpecs.bottomElasticLength + 10} cm</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span>Guma górna obwodu:</span>
                                <span className="font-bold">~{calculatedSpecs.bottomElasticLength} cm</span>
                              </div>
                            </div>
                          )}
                          {currentPart.id === 'fiszbiny' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Fiszbiny metalowe model regularny:</span>
                              <span className="font-bold text-emerald-700">Para - rozmiar {calculatedSpecs.underwireSize}</span>
                            </div>
                          )}
                          {currentPart.id === 'tunel_gorseciarski' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Pluszowy tunel gorseciarski (10mm):</span>
                              <span className="font-bold">~1.1 metra bieżącego</span>
                            </div>
                          )}
                          {currentPart.id === 'haftka' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Zapięcie (haftki+pętelki):</span>
                              <span className="font-bold">{calculatedSpecs.hookEyeHeight} x 1 szt.</span>
                            </div>
                          )}
                          {currentPart.id === 'tiul_elastyczny' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Tiul powernet (sugerowany):</span>
                              <span className="font-bold text-indigo-700">0.3 m bieżącego</span>
                            </div>
                          )}
                          {currentPart.id === 'tiul_stabilny' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Markizyeta / tiul stabilny:</span>
                              <span className="font-bold">0.2 m bieżącego</span>
                            </div>
                          )}
                          {currentPart.id === 'kolka' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Kółka metalowe powlekane:</span>
                              <span className="font-bold">2 szt. ({calculatedSpecs.strapWidth.split(' ')[0]}mm)</span>
                            </div>
                          )}
                          {currentPart.id === 'regulatory' && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span>Regulatory metalowe:</span>
                              <span className="font-bold">2 szt. ({calculatedSpecs.strapWidth.split(' ')[0]}mm)</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between py-1">
                            <span>Sugerowany zapas bezpieczeństwa:</span>
                            <span className="text-slate-400 font-bold">+10% wymiaru</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 italic">
                        *Zawsze mierz próbkę rozciągliwości gum przed zakupem. Elastyczność różnych marek gum obszywkowych może się różnić od 15% do 35%.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Quick materials list selector list explicitly requested in Russian prompt */}
            <div className="mt-6 border-t border-stone-200/60 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Szybki wybór komponentu z listy:
              </span>
              <div className="flex flex-wrap gap-1.5 h-36 overflow-y-auto pr-1">
                {braParts.map((part) => {
                  const active = selectedPartId === part.id;
                  return (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPartId(part.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl transition font-sans border ${
                        active
                          ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {part.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer detailing project credentials matching beautiful layout rules */}
      <footer className="border-t border-stone-200 bg-white/90 text-slate-400 py-6 text-center text-xs mt-12 font-sans px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            &copy; 2026 Interaktywny Model SVG Gorseciarstwa. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="text-slate-400">Atelier Projektowe Biustonoszy</span>
            <span className="text-stone-300">|</span>
            <span className="text-slate-500">Precyzyjne Rzemiosło Bielizny</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
