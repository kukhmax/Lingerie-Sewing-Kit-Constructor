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
