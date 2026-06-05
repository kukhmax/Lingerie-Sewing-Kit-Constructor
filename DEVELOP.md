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
1. Przeanalizowano kod źródłowy strony głównej **subtelnedetale.pl** w celu dopasowania identyfikacji wizualnej.
2. Utworzono arkusz stylów `frontend/src/index.css`.
3. Opracowano główny komponent `frontend/src/App.jsx` w języku polskim (panel wyboru wyrobów, boczny panel materiałów z filtrowaniem, lista zakupów, koszyk, panel Gemini).

---

## Krok 4: Interaktywne schematy SVG (Biustonosz, Majtki, Koszulka nocna)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Utworzono trzy osobne komponenty rysunków wektorowych (SVG):
   * `frontend/src/components/BraSvg.jsx` — szczegółowy wektorowy rysunek biustonosza zawierający miseczki, ramiączka, regulatory, zapięcie tyłu, gumki obszywkowe, tunele i mostek.
   * `frontend/src/components/PantiesSvg.jsx` — rysunek majtek z panelem przednim, panelem tylnym, klinem kroku, gumką w pasie i otworami na nogawki.
   * `frontend/src/components/NightgownSvg.jsx` — rysunek koszulki nocnej zawierający stanik/miseczki, dół koszulki (spódnicę), ramiączka, gumkę pod biustem i dolne wykończenie z koronki.
2. Powiązano ścieżki i kształty SVG z klasą `interactive-part` z pliku CSS w celu wywoływania animacji podświetlenia (efekt hover ze złotym cieniem i obramowaniem).
3. Dodano obsługę kliknięć na poszczególne elementy rysunku: kliknięcie podświetla element złotym konturem jako aktywny (`activePart`) i filtruje listę materiałów po lewej stronie, aby wyświetlić tylko te artykuły, które nadają się do uszycia wybranego elementu.
4. Zaimplementowano w strukturze SVG dynamiczne wiązanie kolorów (atrybut `fill` pobiera odcień Hex z wybranego produktu) oraz nałożono wzór tekstury koronki (`url(#lace-pattern)`) z płynnym mieszaniem warstw (`mixBlendMode: overlay`).
