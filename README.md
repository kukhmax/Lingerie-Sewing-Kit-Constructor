# Konstruktor Zestawów Szyciowych Bielizny (Lingerie Sewing Kit Constructor)
### Dedykowana integracja dla butiku internetowego **[subtelnedetale.pl](https://subtelnedetale.pl/)**

Interaktywna aplikacja webowa umożliwiająca spersonalizowany, krok po kroku dobór wszystkich materiałów i akcesoriów potrzebnych do uszycia wybranego modelu bielizny (Biustonosz, Majtki Figi, Bralet) z automatyczną walidacją kompatybilności kolorystycznej (zasada harmonii barw) i integracją z koszykiem sklepu WooCommerce.

---

## 🚀 Główne Funkcje

1. **Wizualizacja SVG (Przód i Tył jednocześnie)**:
   - Rysunki techniczne bielizny z aktywnymi elementami.
   - Kolory poszczególnych części na rysunku zmieniają się dynamicznie w czasie rzeczywistym na podstawie wybranego produktu z katalogu.
   - Możliwość klikania bezpośrednio w części rysunku w celu dokonania wyboru.

2. **Sekwencyjna Logika Blokowania**:
   - Na początku odblokowane są wyłącznie materiały główne (tkanina lub koronka).
   - Wybranie pierwszego materiału definiuje **Kolor Wiodący** (np. *Szmaragdowy*) i automatycznie odblokowuje pozostałe akcesoria.

3. **Zasada Harmonii Barw (Color Harmony)**:
   - Dodatki (regulatory, zapięcia, gumy obszykowe/ramiączkowe, nici itp.) są automatycznie filtrowane przez backend i wyświetlają wyłącznie warianty kolorystycznie pasujące do wybranego koloru wiodącego.

4. **Kalkulator Zestawu (Koszyk)**:
   - Automatyczny dobór standardowych ilości (np. 1.5m gumy, 1.2m ramiączka, 1 opakowanie fiszbin).
   - Możliwość precyzyjnej zmiany ilości (mnożnika) dla każdej pozycji przez użytkownika.
   - Automatyczne wyliczanie sumarycznej ceny zestawu.
   - Dodawanie całego zestawu do koszyka jednym kliknięciem.

---

## 🛠️ Stack Technologiczny

* **Frontend**: React (SPA) + Vite.
  * *Stylizacja*: Czysty, dedykowany CSS inspirowany estetyką marki (tło warm cream `#faf7f2`, złote akcenty `#c9a236`, fonty *Playfair Display* oraz *Montserrat*).
  * *Wizualizacja*: Interaktywny Inline SVG z dwukierunkową komunikacją (kliknięcia na rysunku przenoszą do wyboru materiału).
* **Backend**: Python 3.13 + FastAPI + SQLAlchemy.
  * *Baza Danych*: SQLite (domyślnie w kontenerze) lub MySQL (produkcja, konfigurowana przez zmienną środowiskową).
  * *Seeding*: Automatyczne pobieranie rzeczywistych produktów (cen, nazw, zdjęć) ze sklepu `subtelnedetale.pl`.
* **Orkiestracja**: Docker & Docker Compose.

---

## 📁 Struktura Projektu

```text
├── backend/
│   ├── database.py                   # Model bazy SQLAlchemy (tabela products)
│   ├── main.py                       # FastAPI REST API (GET /api/materials, POST /api/cart/add)
│   ├── seed.py                       # Skrypt inicjalizacji bazy i dodawania produktów
│   ├── requirements.txt              # Biblioteki Pythona
│   ├── Dockerfile                    # Budowa obrazu backendu
│   └── all_extracted_products.json   # Plik ze skanowanymi rzeczywistymi produktami ze sklepu
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── GarmentVisualizer.jsx # Rysunki techniczne SVG (front/tył) i ich stany
│   │   ├── App.jsx                   # Główny stan aplikacji i logika wyboru
│   │   ├── App.css                   # Pomocnicze style
│   │   ├── index.css                 # System designu CSS i animacje
│   │   └── main.jsx                  # Inicjalizacja Reacta
│   ├── Dockerfile                    # Budowa obrazu frontendu (Vite + Nginx)
│   ├── package.json                  # Zależności npm
│   └── index.html                    # SEO i metadane strony
│
├── docker-compose.yml                # Uruchomienie całości w kontenerach
└── DEVELOP.md                        # Dziennik zmian krok po kroku
```

---

## 📦 Instrukcja Uruchomienia i Instalacji

Upewnij się, że masz zainstalowany program [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Klonowanie i przygotowanie
Przełącz się na odpowiednią gałąź:
```bash
git checkout new_version
```

### 2. Uruchomienie za pomocą Docker Compose
W katalogu głównym projektu uruchom:
```bash
docker compose up --build -d
```
Polecenie to:
1. Zbuduje i zainstaluje zależności kontenera Pythona.
2. Zainicjuje bazę danych SQLite w kontenerze i zasili ją (`seed.py`) rzeczywistymi danymi z WooCommerce.
3. Skompiluje produkcyjną wersję aplikacji React i wystawi ją za pomocą lekkiego serwera Nginx.

### 3. Dostęp do aplikacji w przeglądarce
* **Konstruktor (Frontend)**: **`http://localhost:5173/`**
* **REST API (Backend)**: **`http://localhost:8000/`**
* **Dokumentacja API Swagger**: **`http://localhost:8000/docs`**

---

## 🔌 Jak podłączyć konstruktor do subtelnedetale.pl?

Konstruktor został zaprojektowany w taki sposób, aby po skompletowaniu zestawu przez klienta, wszystkie pozycje zostały automatycznie przesłane do koszyka w sklepie WooCommerce na domenie **subtelnedetale.pl**.

### Sposób A: Przekierowanie przez parametry URL koszyka (Najprostsza integracja)
Gdy klient klika "Dodaj zestaw do koszyka", aplikacja wysyła dane do API, które weryfikuje stany, a następnie zwraca link URL przekierowania. WooCommerce wspiera natywne dodawanie wielu produktów do koszyka bezpośrednio przez adres URL:
* Format adresu URL: `https://subtelnedetale.pl/koszyk/?add-to-cart=ID1,ID2,ID3&quantity=QTY1,QTY2,QTY3`
* Przykładowe przekierowanie wygenerowane przez konstruktor:
  `https://subtelnedetale.pl/koszyk/?add-to-cart=koronka-szmaragd-123,guma-obszywkowa-456&quantity=1,1.5`

### Sposób B: WooCommerce REST API i wtyczka Custom Cart
W przypadku chęci dodawania produktów bezpośrednio do sesji koszyka użytkownika bez przeładowania strony:
1. W kodzie backendu [backend/main.py](file:///c:/Users/m-win/Projects/konstructor/backend/main.py#L95-L118) w punkcie `/api/cart/add` można zintegrować wywołanie API WooCommerce przy użyciu kluczy Consumer Key i Consumer Secret.
2. Wykorzystuje się pakiet `wc-api` lub bezpośrednie zapytania HTTP do punktu `/wp-json/wc/store/v1/cart/add-item` w celu dodania produktów bezpośrednio do aktywnej sesji użytkownika WordPress/WooCommerce.

### Sposób C: Osadzenie konstruktora na stronie (iFrame / Custom Element)
Aby osadzić konstruktor bezpośrednio w podstronie WordPressa:
1. Wklej kod iFrame w edytorze podstrony WordPress:
   ```html
   <iframe src="http://localhost:5173" width="100%" height="750px" style="border:none;"></iframe>
   ```
2. Lub skompiluj aplikację React do jednego pliku JS (Web Component) i załaduj go w motywie WordPressa w pliku `functions.php`.

---

## 🧹 Przydatne polecenia Docker

* **Zatrzymanie aplikacji**:
  ```bash
  docker compose down
  ```
* **Podgląd logów w czasie rzeczywistym**:
  ```bash
  docker compose logs -f
  ```
* **Ponowne zasilenie (seedowanie) bazy danych**:
  ```bash
  docker compose exec backend python seed.py
  ```
* **Sprawdzenie bazy danych SQLite w kontenerze**:
  ```bash
  docker compose exec backend sqlite3 constructor.db "SELECT * FROM products LIMIT 5;"
  ```
