# Log Rozwoju Projektu (DEVELOP.md) - Konstruktor Zestawów do Szycia

Ten plik służy do śledzenia zmian wprowadzanych krok po kroku podczas realizacji funkcjonalności interaktywnego konstruktora dla sklepu **subtelnedetale.pl**.

---

## Krok 1: Inicjalizacja projektu i integracja z Laravel (Backend)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainicjalizowano repozytorium Git w katalogu głównym projektu (`/`).
2. Utworzono plik `DEVELOP.md` do śledzenia zmian.
3. Utworzono pliki szabлонów i integracji dla systemu Laravel (backend).

---

## Krok 2: Inicjalizacja React (Frontend), baza danych w języku polskim oraz Docker
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainstalowano Node.js LTS (wersja 24.16.0) za pomocą menedżera Scoop.
2. Zainicjalizowano strukturę aplikacji React w podkatalogu `/frontend` przy użyciu generatora `Vite`.
3. Stworzono lokalną bazę danych materiałów `frontend/public/materials.json` w **języku polskim**.
4. Skonfigurowano obsługę kontenerów Docker.

---

## Krok 3: Układ interfejsu (UI Layout) i Stylizacja Premium (CSS)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Przeanalizowano kod źródłowy strony głównej **subtelnedetale.pl** w celu dopasowania identyfikacji wizualnej.
2. Utworzono arkusz stylów `frontend/src/index.css`.
3. Opracowano główny komponent `frontend/src/App.jsx` w języku polskim.

---

## Krok 4: Interaktywne schematy SVG (Biustonosz, Majtki, Koszulka nocna)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Utworzono trzy wektorowe rysunki (SVG) dla bielizny (`BraSvg.jsx`, `PantiesSvg.jsx`, `NightgownSvg.jsx`).
2. Powiązano kształty z systemem stylów CSS.
3. Dodano obsługę kliknięć w celu wyboru części и фильтрации.
4. Zaimplementowano dynamiczny fill и наложение текстур.

---

## Krok 5: Logika kompletacji zestawu (Checklist) i wskaźnik postępu
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Wdrożono mechanizm walidacji kompletności wyrobu w panelu bocznym.
2. Dodano graficzny wskaźnik postępu (Progress Bar) u góry prawej kolumny.
3. Dodano plakietkę sukcesu "Zestaw kompletny i gotowy do szycia! 🎉".
4. Przetestowano aplikację pod kątem poprawnego sumowania cen oraz przeliczania standardowych norm zużycia.

---

## Krok 6: Wyszukiwanie i dobór materiałów przez Gemini AI
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Skonfigurowano model językowy Gemini AI do pracy jako interaktywny projektant bieliźniany w języku polskim.
2. Zaprojektowano zaawansowany prompt systemowy przekazujący pełny kontekst aktywnego katalogu produktów (ID, nazwa, kolor, kod Hex) oraz typ szytego wyrobu. Zmusza on model do zwracania wyłącznie rzeczywistych produktów i blokowania zmyślonych ID (hallucinations).
3. Dodano okno ustawień (⚙️ Gemini API Key), pozwalające na wprowadzenie klucza API dewelopera lub załadowanie go automatycznie z pliku środowiskowego (.env / Docker `VITE_GEMINI_API_KEY`).
4. Napisano parser wyrażeń regularnych wyodrębniający blok JSON z rekomendacjami ze strumienia tekstowego Gemini, co pozwala na automatyczne pokolorowanie i przypisanie dobranych przez sztuczną inteligencję materiałów do odpowiednich lekałów na rysunkach SVG.
5. Uruchomiono lokalny serwer deweloperski Vite w celu umożliwienia podglądu działania aplikacji w przeglądarce pod adresem `http://localhost:5173/`.
