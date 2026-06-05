# Interaktywny Konstruktor Zestawów Krawieckich (subtelnedetale.pl)

Ten projekt to interaktywny moduł e-commerce pozwalający klientkom butiku **subtelnedetale.pl** na samodzielne kompletowanie materiałów (koronek, dzianin, gumek, fiszbin i akcesoriów) niezbędnych do uszycia wybranego wyrobu (Biustonosz, Majtki, Koszulka nocna).

---

## 🚀 Stos Technologiczny (Tech Stack)

Konstruktor został zaprojektowany w architekturze **decentralnej (klient-serwer)**, co pozwala na bezproblemową integrację z dowolnym systemem e-commerce (w tym przypadku z Waszym monolitem **Laravel**):

1. **Frontend (Konstruktor Visualizer)**:
   * **Vite + React.js**: Zapewnia błyskawiczne renderowanie i doskonały stan reaktywny.
   * **Custom HTML5/Vanilla CSS**: Elastyczna, luksusowa stylistyka dopasowana do marki (złote akcenty `#c9a236`, mleczne tło `#fdfcf9`, kroje pism *Playfair Display* i *Inter*).
   * **Interaktywne wektory (SVG)**: Trzy dedykowane, klikalne schematy wyrobów (Biustonosz, Majtki, Koszulka nocna) z dynamicznym wypełnianiem kolorem i przezroczystym nakładaniem tekstury koronki (`mixBlendMode: overlay`).
   * **Gemini AI API**: Integracja z modelem `gemini-2.5-flash` jako wirtualny doradca krawiecki (wyszukiwanie kontekstowe w bazie danych w języku polskim i automatyczna konfiguracja zestawu).
2. **Backend (Baza i Koszyk - Laravel)**:
   * **Laravel Eloquent API**: Endpointy do pobierania bazy aktywnych surowców i dodawania kompletnego zestawu do koszyka sesji sklepu.
3. **Konteneryzacja**:
   * **Docker & Docker Compose**: Pełna izolacja środowiska deweloperskiego i testowego.

---

## 🛠️ Instrukcja Instalacji i Uruchomienia (Local Development)

### Opcja A: Uruchomienie lokalne (wymagany Node.js)

1. Przejdź do folderu frontendowego:
   ```bash
   cd frontend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom serwer deweloperski (z hot-reload):
   ```bash
   npm run dev
   ```
   *Aplikacja będzie dostępna pod adresem:* [http://localhost:5173/](http://localhost:5173/)

4. Skompiluj wersję produkcyjną (dla Laravel):
   ```bash
   npm run build
   ```
   *Wynik znajdzie się w katalogu `frontend/dist/`.*

### Opcja B: Uruchomienie przez Docker (Zalecane dla czystego środowiska)

Docker automatycznie zainstaluje Node, pobierze pakiety i wystawi serwer deweloperski z podmapowanym folderem (zmiany w kodzie na Twoim komputerze od razu odświeżą się w kontenerze).

1. Uruchomienie kontenera w tle:
   ```bash
   docker compose up --build -d
   ```
2. Uruchomienie z kluczem API Gemini (dla testów sztucznej inteligencji):
   ```bash
   $env:VITE_GEMINI_API_KEY="Twój_Klucz_Gemini"; docker compose up --build -d
   ```
3. Zatrzymanie kontenerów:
   ```bash
   docker compose down
   ```
   *Aplikacja będzie dostępna pod adresem:* [http://localhost:5173/](http://localhost:5173/)

---

## 🔌 Jak podłączyć konstruktor do sklepu subtelnedetale.pl (Laravel)

Aby w pełni wdrożyć funkcjonalność na produkcyjnej stronie, należy przenieść przygotowane pliki z katalogu `laravel-backend/` oraz podpiąć skompilowany front.

### Krok 1: Aktualizacja Bazy Danych (MySQL via Laravel Migration)
Skopiuj plik [Migration_add_constructor_fields.php](file:///c:/Users/m-win/Projects/konstructor/laravel-backend/Migration_add_constructor_fields.php) do folderu `database/migrations/` w swoim projekcie Laravel i uruchom:
```bash
php artisan migrate
```
Ta migracja doda do tabeli `products` kolumny:
* `is_constructor_compatible` (boolean) — decyduje, czy towar wyświetla się w konstruktorze.
* `category_constructor_assigned` (fabric/elastic/hardware/closure/underwire) — przypisuje rolę towaru.
* `color_hex` — dokładny kod koloru do wypełnienia schematu SVG.
* `standard_consumption_qty` — domyślna ilość przypisywana przy wyborze (np. 1.50 metra gumki).

### Krok 2: Rejestracja API w Laravel (`routes/api.php`)
Dołącz definicje tras z pliku [api_routes.php](file:///c:/Users/m-win/Projects/konstructor/laravel-backend/api_routes.php):
```php
use App\Http\Controllers\ConstructorController;

Route::prefix('constructor')->group(function () {
    Route::get('/materials', [ConstructorController::class, 'getMaterials']);
    Route::post('/cart/add', [ConstructorController::class, 'addToCart']);
});
```

### Krok 3: Implementacja Kontrolera (`ConstructorController.php`)
Skopiuj [ConstructorController.php](file:///c:/Users/m-win/Projects/konstructor/laravel-backend/ConstructorController.php) do katalogu `app/Http/Controllers/`. Kontroler ten:
1. Pobiera produkty kompatybilne z konstruktorem i zwraca je w formacie JSON (`/api/constructor/materials`).
2. Przyjmuje tablicę wybranych towarów (`product_id` i `quantity`), waliduje stany magazynowe i dodaje je bezpośrednio do koszyka e-commerce (`Cart::add`).

### Krok 4: Wdrożenie Skompilowanego Frontendu (Assets Deployment)
1. W folderze `frontend/` uruchom komendę budującą:
   ```bash
   npm run build
   ```
2. Skopiuj wygenerowane pliki z folderu `frontend/dist/assets/` do katalogu publicznego Laravel:
   * Plik `index-[hash].js` skopiuj jako `public/constructor/assets/index.js`
   * Plik `index-[hash].css` skopiuj jako `public/constructor/assets/index.css`
3. Skopiuj plik `frontend/public/materials.json` (lub zmodyfikuj kod tak, by odpytywał rzeczywiste API) jako `public/materials.json`.

### Krok 5: Utworzenie szablonu Blade (`resources/views/constructor.blade.php`)
Utwórz trasę w `routes/web.php` wskazującą na widok konstruktora:
```php
Route::view('/constructor', 'constructor');
```
Następnie w pliku Blade wklej strukturę integrującą:
```html
@extends('layouts.app')

@section('content')
<!-- Główny element montażowy aplikacji React -->
<div id="constructor-root"></div>

<!-- Podłączenie stylów i skryptów frontu -->
<link rel="stylesheet" href="{{ asset('constructor/assets/index.css') }}">
<script type="module" src="{{ asset('constructor/assets/index.js') }}"></script>
@endsection
```

---

## 🤖 Konfiguracja Projektanta Gemini AI

Konstruktor posiada zintegrowany panel czatu z modelem sztucznej inteligencji. 
* **Bez Klucza API**: Czat działa w trybie uproszczonym (Mock Mode), analizując słowa kluczowe (np. "szmaragdowy", "wino") i stosując odpowiednie gotowe palety kolorystyczne.
* **Z Kluczem API**: Po wprowadzeniu klucza w ikonie ustawień (lub przekazaniu zmiennej `VITE_GEMINI_API_KEY`), model pobiera aktualną bazę towarów, analizuje preferencje użytkownika na żywo, a następnie zwraca spersonalizowany zestaw, automatycznie kolorując model w czasie rzeczywistym.
