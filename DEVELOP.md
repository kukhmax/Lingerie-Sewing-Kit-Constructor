# Log Rozwoju Projektu (DEVELOP.md) - Nowa Wersja Konstruktora

Ten plik służy do śledzenia zmian wprowadzanych krok po kroku w nowej wersji interaktywnego konstruktora z backendem Python oraz sekwencyjnym procesem wyboru kolorystyki.

---

## Krok 1: Inicjalizacja struktury backendu w języku Python i bazy danych
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Przełączono repozytorium na gałąź `new_version`.
2. Stworzono katalog `/backend` dla mikroserwisu Pythona.
3. Utworzono plik `backend/database.py` zawierający konfigurację SQLAlchemy (ORM) z obsługą baz SQLite (deweloperska/testowa w Dockerze) oraz MySQL (produkcyjna), wraz z modelem tabeli `products`.
4. Napisano skrypt crawlera `C:\Users\m-win\.gemini\antigravity\scratch\fetch_all_products.py`, który pobrał rzeczywiste produkty, zdjęcia i ceny bezpośrednio ze sklepu **subtelnedetale.pl** dla kategorii: koronki, gumy obszywkowe, gumy ramiączkowe, regulatory, kółka, zapięcia, fiszbiny i tunele, zapisując je do pliku JSON.
5. Utworzono plik `backend/seed.py` do automatycznego inicjowania bazy danych i ładowania pobranych produktów ze sklepu oraz dodawania brakujących materiałów wykończeniowych (nici, ozdobne kokardki, miseczki piankowe) o spójnych kolorach.
6. Utworzono pliki `backend/requirements.txt` oraz `backend/Dockerfile` do budowy obrazu i uruchomienia bazy w kontenerze Docker.

## Krok 2: Implementacja API REST w FastAPI i logika dopasowania kolorów
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Utworzono plik `backend/main.py` z główną aplikacją FastAPI, middleware CORS i walidacją Pydantic.
2. Dodano punkt końcowy `GET /api/materials`, obsługujący filtrowanie produktów po kategoriach oraz logikę dopasowania kolorów (**Color Harmony**) na podstawie wybranego głównego koloru materiału (`primary_color`).
3. Dodano punkt końcowy `POST /api/cart/add`, który weryfikuje istnienie produktów w bazie danych, oblicza sumaryczne ceny pozycji i zwraca link przekierowujący do rzeczywistego koszyka WooCommerce na stronie **subtelnedetale.pl**.
4. Naprawiono błąd importu `create_url` w pliku `backend/database.py`, usuwając nieużywany import biblioteki SQLAlchemy.
5. Zbudowano obraz Docker `constructor-backend` i pomyślnie zweryfikowano działanie API poprzez wykonanie zapytań testowych do kontenera.

## Krok 3: Inicjalizacja projektu frontendowego React i konfiguracja stylów
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zresetowano konfigurację Scoop dla Node.js, aby przywrócić poprawną ścieżkę do narzędzi npm/npx w powłoce systemowej.
2. Zainicjalizowano pusty projekt frontendowy React + Vite w katalogu `/frontend` za pomocą komendy `npx create-vite@latest ./ --template react --no-interactive`.
3. Zainstalowano zależności projektu za pomocą `npm install`.
4. Oczyszczono domyślny plik `App.css` i napisano autorski system stylów CSS w `frontend/src/index.css`, oparty na tożsamości wizualnej marki **subtelnedetale.pl** (kremowo-pudrowe tło `#faf7f2`, złote akcenty `#c9a236`, fonty *Playfair Display* i *Montserrat*, glassmorphism oraz animacje micro-interactions).
