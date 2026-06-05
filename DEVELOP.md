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
