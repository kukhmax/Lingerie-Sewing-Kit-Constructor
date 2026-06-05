# Wymagania Techniczne i Plan Wdrożenia (PLAN.md)
## Interaktywny Konstruktor Zestawów Bielizny (subtelnedetale.pl)

Ten dokument zawiera specyfikację techniczną (TZO) oraz plan wdrożenia nowej koncepcji interaktywnego konstruktora kompletów bielizny.

---

## 1. Zmieniona Koncepcja Produktu (User Flow)

Zaimplementowany zostanie **sekwencyjny proces konfiguracji** z walidacją spójności kolorów i blokowaniem kolejnych kroków:

1. **Stan Początkowy**:
   * Użytkownik widzi rysunek wyrobu (przód i tył obok siebie).
   * Po lewej stronie wyświetla się lista wszystkich elementów (części składowych) potrzebnych do uszycia wyrobu. Części, które nie są wybrane, świecą się na **czerwono** (lub mają pusty checkbox).
   * Na starcie klikalne są **wyłącznie** pozycje główne (tkaniny/koronki): `Materiał`, `Koronka`, `Tiul elastyczny`, `Tiul stabilny`.
   * Wszystkie inne pozycje (gumy, regulatory, kółka, zapięcia) są **zablokowane (disabled)**.
2. **Krok 1: Wybór Głównego Materiału**:
   * Użytkownik klika na dowolny z aktywnych materiałów głównych (np. `Materiał`).
   * Pojawia się okno modalne z listą dostępnych tkanin z bazy sklepu (tylko z kategorii dedykowanej dla tego typu bielizny).
   * Po wybraniu tkaniny:
     * Odpowiednie sektory na wektorowym rysunku SVG (przód i tył) zostają wypełnione kolorem/teksturą wybranej tkaniny.
     * Wybrany materiał pojawia się po prawej stronie podsumowania wraz z jego kolorem (tekst + mały bloczek koloru).
     * Kolor wybranego materiału staje się **kolorem wiodącym (kolorem bazowym)** całego projektu.
     * **Wszystkie pozostałe pozycje na liście stają się aktywne (klickalne)**.
3. **Krok 2: Konfiguracja Elementów Wykończeniowych**:
   * Użytkownik klika na kolejną pozycję (np. `Guma ramiączkowa`).
   * Otwiera się okno modalne, które wyświetla **wyłącznie towary o kolorze pasującym (zharmonizowanym)** z wybranym kolorem wiodącym (np. do szmaragdowej tkaniny oferowane są szmaragdowe ramiączka, złote lub srebrne regulatory itp.).
   * Po wybraniu elementu:
     * Towar zostaje dodany po prawej stronie z możliwością wyboru ilości (metraż/sztuki).
     * Odpowiednia ścieżka na rysunku SVG (przód/tył) zmienia kolor na kolor wybranej części.
     * Pozycja na liście po lewej stronie zmienia stan na wybrany (kolor zmienia się z czerwonego na zielony, pojawia się zaznaczony checkbox).
4. **Krok 3: Zakończenie i Koszyk**:
   * Gdy wszystkie wymagane elementy zostaną wybrane, cały zestaw jest oznaczony jako gotowy.
   * Użytkownik jednym kliknięciem przesyła cały zestaw do koszyka sklepu `subtelnedetale.pl`.

---

## 2. Architektura Systemu (Docker & Python API)

Zgodnie z nowymi wytycznymi, backend zostaje przeniesiony z PHP/Laravel na **Python API**, a całość działa w kontenerach Docker.

```
                  ┌─────────────────────────────────────────┐
                  │          Przeglądarka Klienta           │
                  │   (React SPA, interaktywne SVG)         │
                  └────────────────────┬────────────────────┘
                                       │
                              Zapytania REST API
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │          Docker Container (API)         │
                  │       Python 3.13 (FastAPI / Uvicorn)    │
                  └────────────────────┬────────────────────┘
                                       │
                              Dostęp do Bazy Danych
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │             Baza Danych SQL             │
                  │  (SQLite w Dockerze / Zewnętrzny MySQL) │
                  └─────────────────────────────────────────┘
```

### Stos Technologiczny Backend (Python):
* **FastAPI**: Najnowocześniejszy, stabilny i najszybszy framework API w Pythonie (wersja Python 3.12/3.13). Generuje automatyczną dokumentację Swagger na `/docs`.
* **SQLAlchemy & Pydantic**: Mapowanie bazy danych (ORM) i walidacja typów danych.
* **Uvicorn**: Serwer ASGI do obsługi zapytań.
* **SQLite / MySQL**: Baza danych (domyślnie SQLite w kontenerze ułatwiająca testy, z możliwością przełączenia na produkcyjną bazę MySQL za pomocą zmiennych środowiskowych).

### Struktura Kontenerów (Docker Compose):
* Serwis `backend`: Kontener Pythona uruchamiający FastAPI na porcie `8000`.
* Serwis `frontend`: Kontener Node.js serwujący aplikację React na porcie `5173`.

---

## 3. Szczegółowa Lista Elementów Wyrobów (Sidebars)

Zaimplementujemy trzy modele na podstawie przesłanych schematów anatomii:

### 1. Biustonosz (Biustonosz klasyczny z fiszbinami)
Wektorowe rysunki SVG pokazujące **przód (Anatomy of the Bra)** oraz **tył (Hook & eye closure / Back bands)**.
* **Elementy konfiguracji (lewy panel)**:
  1. `Materiał` (Tkanina bazowa obwodu/miseczek - aktywne na starcie)
  2. `Koronka` (Wykończenie miseczek - aktywne na starcie)
  3. `Tiul elastyczny` (Podszewka pasa obwodu - aktywne na starcie)
  4. `Tiul stabilny` (Podszewka mostka/dolnej miseczki - aktywne na starcie)
  5. `Guma obszywkowa` (Dolna i górna krawędź obwodu)
  6. `Guma ramiączkowa` (Boczne ramiączka)
  7. `Kółka` (Łączenie ramiączka z miseczką)
  8. `Regulatory` (Długość ramiączka)
  9. `Haftka` (Zapięcie tylne)
  10. `Fiszbiny` (Usztywnienie miseczek - metalowe łuki)
  11. `Kokardka` (Zdobienie na mostku)
  12. `Tunel gorseciarski` (Osłona fiszbin pod miseczkami)
  13. `Miseczki` (Wkłady usztywniające)

### 2. Majtki (Klasyczne figi / bikini)
Wektorowe rysunki SVG pokazujące **przód** oraz **tył** (klasyczny krój bikini z tyłem i klinem).
* **Elementy konfiguracji (lewy panel)**:
  1. `Materiał 1` (Główna tkanina przodu/tyłu - aktywne na starcie)
  2. `Materiał 2` (Dodatkowa tkanina dekoracyjna - aktywne na starcie)
  3. `Bawełna na wstawkę higieniczną` (Klin wewnętrzny - aktywne na starcie)
  4. `Koronka` (Ozdobne wstawki po bokach - aktywne na starcie)
  5. `Guma ozdobna` (Pas biodrowy)
  6. `Nici` (Kolor nici do szwów płaskich)

### 3. Bralet (Miękki biustonosz koronkowy bez fiszbin)
Wektorowe rysunki SVG pokazujące **przód** (trójkątne miseczki) oraz **tył** (szeroki pas koronkowy).
* **Elementy konfiguracji (lewy panel)**:
  1. `Koronka` (Główny element miseczek i obwodu - aktywne na starcie)
  2. `Materiał` (Podszewka lub wstawki - aktywne na starcie)
  3. `Nici` (Szwy łączące)
  4. `Fiszbiny - 2 szt` (Fiszbiny boczne pionowe)
  5. `Guma obszywkowa` (Krawędzie pasa)
  6. `Haftka` (Zapięcie pleców)
  7. `Guma ramiączkowa` (Ramiączka)
  8. `Kółka` (Akcesoria metalowe)
  9. `Regulatory` (Regulatory ramiączek)
  10. `Tunel gorseciarski` (Tunele na fiszbiny boczne)

---

## 4. Zasady Harmonii Kolorów (Color Matching Rules)

Baza danych Pythona będzie grupować produkty według **palet kolorystycznych**. Kiedy użytkownik wybierze materiał główny o danym kolorze (np. `Szmaragdowy`), system filtruje kolejne zapytania API o materiały wykończeniowe (gumy, haftki, regulatory) według poniższej tabeli harmonii:

| Kolor Wiodący (Materiał Główny) | Pasujące Kolory Wykończeń (Gumy, Haftki) | Pasujące Metale (Regulatory, Kółka) |
|---|---|---|
| **Szmaragdowy (Emerald)** | Szmaragdowy, Cielisty (Nude) | Złoty, Srebrny |
| **Wino (Burgundy)** | Wino, Głęboka Czerwień, Czarny | Złoty |
| **Różowy Pudrowy (Blush)** | Różowy Pudrowy, Cielisty (Nude) | Różowe Złoto, Srebrny |
| **Klasyczna Czerń (Black)** | Czarny, Tiul czarny | Czarny Metalik, Srebrny, Złoty |
| **Cielisty (Nude / Beige)** | Cielisty, Różowy Pudrowy | Różowe Złoto, Złoty |

---

## 5. Pytania do Wyjaśnienia (100% Pewności)

### 1. Wybór fasonu majtek (Majtki)
Na przesłanym obrazku 2 znajduje się 12 różnych modeli majtek (Stringi, Bikini, Klasyczne, Szorty itd.).
* **Nasza rekomendacja**: Zaimplementujemy klasyczny krój **Bikini** lub **Klasyczne figi**, który ma wyraźnie widoczny przód (panel przedni), tył (panel tylny) oraz klin (gusset) dla bawełny higienicznej. Czy ten fason jest dla Ciebie odpowiedni?

### 2. Algorytm wyboru "Koronka" vs "Materiał" na starcie
Jeśli na starcie użytkownik wybierze najpierw `Koronka`, a potem `Materiał`, to:
* Czy kolor pierwszego wybranego elementu na stałe definiuje "Kolor Wiodący"?
* **Nasza propozycja**: Dowolny pierwszy zatwierdzony wybór spośród głównych pozycji (aktywnych na starcie) blokuje kolor wiodący i uaktywnia resztę listy. Jeśli użytkownik zmieni ten pierwszy materiał na inny kolor, kolor wiodący całego projektu aktualizuje się automatycznie.

### 3. Integracja z subtelnedetale.pl
Ponieważ sklep produkcyjny działa na PHP/Laravel:
* Czy Python API ma bezpośrednio czytać bazę danych MySQL sklepu?
* Czy też systemy będą rozdzielone i Python API będzie działał jako niezależny mikroserwis z własną bazą SQLite, do której administrator sklepu wysyła stany magazynowe za pomocą prostego eksportu/importu JSON/CSV?
* **Nasza rekomendacja**: Proponujemy niezależne Python API z bazą SQLite w kontenerze deweloperskim i prostym plikiem importu produktów. Pozwoli to na łatwe wdrożenie i przetestowanie modułu w Dockerze bez ryzyka uszkodzenia bazy produkcyjnej. Następnie w konfiguracji produkcyjnej dodamy obsługę połączenia z bazą MySQL sklepu poprzez zmienne środowiskowe (`DB_HOST`, `DB_USER` itp.).

### 4. Wizualizacja Przodu i Tyłu
Czy rysunek przodu i tyłu wyrobu ma być widoczny równocześnie na ekranie (np. lewa część podglądu to PRZÓD, prawa to TYŁ), czy też wolisz zakładki (toggles) "Przód / Tył"?
* **Nasza propozycja**: Wyświetlimy obie perspektywy (Przód i Tył) obok siebie na jednym płótnie SVG. Daje to najlepszy efekt wizualny.

---

## 6. Plan Działań Krok po Kroku (Roadmap)

* **Krok A**: Zmiana struktury projektu. Utworzenie folderu `/backend` na aplikację Python (FastAPI). Utworzenie pliku `PLAN.md` w głównym katalogu.
* **Krok B**: Stworzenie modelu bazy danych SQLite/MySQL i skryptu seederów w Pythonie na bazie asortymentu `subtelnedetale.pl`.
* **Krok C**: Napisanie kodu API w FastAPI: endpointy pobierania materiałów z uwzględnieniem filtrowania według "koloru wiodącego" i dodawania do koszyka.
* **Krok D**: Opracowanie trzech zestawów interaktywnych grafik SVG pokazujących przód i tył (Biustonosz, Majtki, Bralet) zgodnie z przesłanymi obrazkami anatomicznymi.
* **Krok E**: Implementacja reaktywnego interfejsu w React:
  * Lewa kolumna z pozycjami oznaczanymi kolorami (czerwony/zielony) i blokowaniem kroków.
  * Logika zapamiętywania głównego koloru.
  * Popupy z filtrowaniem pasujących kolorów gumek/akcesoriów.
* **Krok F**: Konfiguracja Docker Compose do spięcia kontenera FastAPI z kontenerem React.
* **Krok G**: Testy produkcyjne, kompilacja i finalny raport.
