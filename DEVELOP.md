# Log Rozwoju Projektu (DEVELOP.md) - Konstruktor Zestawów do Szycia

Ten plik służy do śledzenia zmian wprowadzanych krok po kroku podczas realizacji funkcjonalności interaktywnego konstruktora dla sklepu **subtelnedetale.pl**.

---

## Krok 1: Inicjalizacja projektu i integracja z Laravel (Backend)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainicjalizowano repozytorium Git w katalogu głównym projektu (`/`).
2. Utworzono plik `DEVELOP.md` do śledzenia zmian.
3. Utworzono pliki szablonów i integracji dla systemu Laravel (backend):
   * `laravel-backend/Migration_add_constructor_fields.php` — migracja bazy danych.
   * `laravel-backend/api_routes.php` — definicje endpointów API.
   * `laravel-backend/ConstructorController.php` — kontroler Laravel.

---

## Krok 2: Inicjalizacja React (Frontend), baza danych w języku polskim oraz Docker
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainstalowano Node.js LTS (wersja 24.16.0) za pomocą menedżera Scoop.
2. Zainicjalizowano strukturę aplikacji React w podkatalogu `/frontend` przy użyciu generatora `Vite`.
3. Stworzono lokalną bazę danych materiałów `frontend/public/materials.json` w **języku polskim**.
4. Skonfigurowano obsługę kontenerów Docker (`frontend/Dockerfile` i `docker-compose.yml`).

---

## Krok 3: Układ interfejsu (UI Layout) i Stylizacja Premium (CSS)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Przeanalizowano kod źródłowy strony głównej **subtelnedetale.pl** w celu dopasowania identyfikacji wizualnej (zbadano kolory, takie jak charakterystyczne złoto `#c9a236`, oraz czcionkę `Poppins`).
2. Utworzono arkusz stylów `frontend/src/index.css`, implementujący:
   * Czcionki *Playfair Display* (szeryfowa, dla nagłówków) oraz *Inter* (bezszeryfowa, dla tekstu i tabel).
   * Kolorystykę pasującą do butiku (tło mleczno-pudrowe `#fdfcf9`, złote akcenty `#c9a236`/`#cca374`, antracytowe teksty).
   * Efekty hover, zaokrąglenia kart premium, niestandardowy pasek przewijania (scrollbar) oraz style dla interaktywnych elementów SVG.
3. Opracowano główny komponent `frontend/src/App.jsx` w języku polskim:
   * Dodano przełączanie między 3 typami bielizny: Biustonosz (bra), Majtki (panties), Koszulka nocna (nightgown).
   * Wdrożono boczny panel katalogu materiałów z filtrowaniem kategorii (Tkaniny i Koronki, Taśmy i Gumy, Akcesoria, Zapięcia, Tunele/Fiszbiny).
   * Wdrożono boczny panel listy zakupów (Checklist) z podglądem wybranego koloru/rozmiaru i automatyczną kalkulacją sumy oraz norm zużycia.
   * Dodano integrację z koszykiem Laravel (`POST /api/constructor/cart/add`) oraz panel wirtualnego konsultanta AI z wejściem na klucz API Gemini.
