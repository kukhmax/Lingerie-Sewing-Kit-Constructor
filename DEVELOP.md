# Log Rozwoju Projektu (DEVELOP.md) - Konstruktor Zestawów do Szycia

Ten plik służy do śledzenia zmian wprowadzanych krok po kroku podczas realizacji funkcjonalności interaktywnego konstruktora dla sklepu **subtelnedetale.pl**.

---

## Krok 1: Inicjalizacja projektu i integracja z Laravel (Backend)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainicjalizowano repozytorium Git w katalogu głównym projektu (`/`).
2. Utworzono plik `DEVELOP.md` do śledzenia zmian.
3. Utworzono pliki szablonów i integracji dla systemu Laravel (backend):
   * `laravel-backend/Migration_add_constructor_fields.php` — migracja bazy данных.
   * `laravel-backend/api_routes.php` — definicje endpointów API.
   * `laravel-backend/ConstructorController.php` — kontroler Laravel.

---

## Krok 2: Inicjalizacja React (Frontend), baza danych w języku polskim oraz Docker
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Zainstalowano Node.js LTS (wersja 24.16.0) za pomocą menedżera Scoop w celu umożliwienia rozwoju i kompilacji frontendowej.
2. Zainicjalizowano strukturę aplikacji React w podkatalogu `/frontend` przy użyciu generatora `Vite` (szablon React JS).
3. Stworzono lokalną bazę danych materiałów `frontend/public/materials.json` w **języku polskim**. Zawiera ona materiały podzielone na kategorie (fabric, elastic, hardware, closure, underwire) o dopasowanej kolorystyce (szmaragdowy, wino, róż pudrowy, czarny).
4. Skonfigurowano obsługę kontenerów Docker w celu niezależnego uruchamiania i testowania aplikacji:
   * `frontend/Dockerfile` — definicja obrazu Node.js do uruchamiania serwera deweloperskiego Vite.
   * `docker-compose.yml` — konfiguracja orchestracji kontenera z podpięciem wolumenu (hot-reload) i przekierowaniem portu 5173 na system gospodarza.
