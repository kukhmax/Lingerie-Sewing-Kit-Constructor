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

## Krok 4: Wdrożenie interaktywnych rysunków SVG (Przód i Tył)
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Utworzono komponent `frontend/src/components/GarmentVisualizer.jsx` wyświetlający rysunki techniczne konstrukcji dla 3 typów bielizny:
   - **Biustonosz** (miseczki, koronka, tunel, ramiączka, guma obszykowa, zapięcie haftkowe, kokardka, szwy).
   - **Majtki Figi** (panel przedni, klin bawełniany, wstawki koronkowe, gumy obszykowe pasa i nóg).
   - **Bralet** (miseczki trójkątne z koronki, tiul obwodu, gumy pod biustem i ramiączkowe, kółka/regulatory, piankowe wkładki).
2. Każda sekcja rysunku posiada unikalny identyfikator, dynamiczne bindowanie koloru wypełnienia (`fill`) pobieranego z wybranego produktu oraz podświetlenie konturu przy najechaniu i wyborze części.
3. Rysunki pokazują jednocześnie widok z przodu (**Przód**) oraz z tyłu (**Tył**).

## Krok 5: Implementacja logiki sekwencyjnego wyboru i panelu zamówień
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaprogramowano w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) logikę blokowania elementów: na starcie odblokowane są tylko materiały główne (tkanina/koronka). Wybór pierwszego materiału określa **kolor wiodący** zestawu i odblokowuje pozostałe akcesoria.
2. Zintegrowano filtrowanie kompatybilności kolorystycznej z API: popupy wyświetlają wyłącznie produkty harmonizujące z wybranym kolorem wiodącym.
3. Dodano panel koszyka po prawej stronie z listą wybranych elementów, kontrolerem mnożników ilości (np. 1.5m gumy, 2szt kółek) i automatycznym przeliczaniem ceny łącznej w PLN.
4. Zaimplementowano wysyłkę zamówienia przez żądanie POST do `/api/cart/add`, weryfikację pozycji w bazie danych oraz okno dialogowe sukcesu z przekierowaniem do koszyka **subtelnedetale.pl**.
5. Zaktualizowano [index.html](file:///c:/Users/m-win/Projects/konstructor/frontend/index.html) (ustawienie języka polskiego `pl`, optymalizacja tagów SEO oraz tytułu strony).

## Krok 6: Integracja za pomocą Docker Compose
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Utworzono plik `frontend/Dockerfile` dla etapu budowania produkcyjnego React (SPA) za pomocą Node.js oraz serwowania plików statycznych za pomocą Nginx Alpine na porcie 80.
2. Utworzono główny plik `docker-compose.yml` w katalogu głównym projektu, łączący usługi:
   - `backend` (FastAPI z wystawionym portem 8000:8000)
   - `frontend` (Nginx Alpine z wystawionym portem 5173:80)
3. Uruchomiono i zweryfikowano pełny zestaw kontenerów za pomocą polecenia `docker compose up --build -d`. Aplikacja frontendowa zintegrowana z backendowym API jest w pełni dostępna i sprawna pod adresem `http://localhost:5173/`.

## Krok 7: Dopasowanie listy części i podział akcesoriów (Zgodnie z PLAN.md)
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaktualizowano definicję części `GARMENT_PARTS` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) zgodnie ze szczegółowymi specyfikacjami z `PLAN.md`:
   - Rozdzielono akcesoria metalowe na oddzielne kroki: **Kółka metalowe** (kategoria `ring`) i **Regulatory metalowe** (kategoria `slider`).
   - Dodano **Tiul stabilny** i **Tiul elastyczny** jako osobne elementy dla biustonosza.
   - Dodano ozdobne wstawki (`fabric_extra`) dla majtek.
   - Dodano fiszbiny boczne oraz dedykowany tunel dla braletu.
2. Zaktualizowano komponent wizualizacji [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) w celu obsługi nowej struktury części (osobne bindowanie kolorów i kliknięć dla kółek, regulatorów, tiuli itp.).
3. Ponownie zbudowano aplikację w kontenerach Docker za pomocą `docker compose up --build -d` i zweryfikowano pomyślną kompilację frontendu przez Vite.

## Krok 8: Aktualizacja rysunku biustonosza na płaską projekcję anatomiczną
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zastąpiono podwójny widok (Przód i Tył) dla biustonosza pojedynczym rysunkiem technicznym w rzucie płaskim, wzorowanym na układzie anatomicznym z [media__1780697054315.png](file:///C:/Users/m-win/.gemini/antigravity/brain/8ec9039b-2c4d-4688-b99b-f5a11ebe8de4/media__1780697054315.png).
2. Nowy rysunek SVG w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) łączy w jeden schemat:
   - Części lewej i prawej miseczki (dolna miseczka `fabric`, górna koronka `lace`),
   - Środkowy mostek (`tulle_stable`) oraz kokardkę ozdobną (`bow`),
   - Obustronne pasy obwodu (`tulle_elastic`) zakończone panelami zapięć haftkowych (`closure`),
   - Tunele (`tunnel`) z osadzonymi fiszbinami metalowymi (`underwire`),
   - Ramiączka (`elastic_strap`) połączone z miseczkami i pasami za pomocą 4 kółek (`ring`) i 2 regulatorów (`slider`).
3. Ponownie skompilowano projekt w kontenerach Docker i przetestowano poprawne dynamiczne kolorowanie wszystkich 13 elementów na jednym zunifikowanym rysunku.

## Krok 9: Szczegółowy rysunek anatomii biustonosza z przełączanymi etykietami
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaimplementowano precyzyjny wektorowy rysunek płaski biustonosza w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) (viewBox `0 0 1000 480`), dokładnie odwzorowujący dostarczony schemat z aplikacji AI Studio.
2. Dodano warstwę 17 etykiet tekstowych w języku polskim z liniami wskazującymi i strzałkami (np. *regulatory*, *guma ramiączkowa*, *mostek*, *tunel gorseciarski*, *fiszbiny*, *szew boczny / fiszbiny krótkie*, *szczyt piersi (apex)*, *dolna część miseczki*, *skrzydełko obwodu*, *haftki*, *guma obszywkowa*).
3. Dodano stan `showLabels` oraz elegancki, interaktywny przycisk-przełącznik w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) (stylowany z efektem glassmorphism i złotym obramowaniem), który umożliwia użytkownikowi dynamiczne ukrywanie i pokazywanie podpisów części na rysunku.
4. Powiązano wszystkie ścieżki i kształty rysunku z interaktywnymi zdarzeniami wyboru części (`onPartClick`) oraz dynamicznym bindowaniem kolorów wyrobów ze sklepu.
5. Zbudowano i uruchomiono aplikację za pomocą `docker compose up --build -d` i zweryfikowano poprawność kompilacji kodu React przez Vite.

## Krok 10: Pełna integracja i dopasowanie modelu wektorowego BraSvg.tsx
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zintegrowano lokalny stan podświetlenia `hoveredPartId` w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) za pomocą hooka `useState` z React.
2. Dodano tabele kolorów wiodących oraz mapowanie identyfikatorów z pomocniczego projektu (`miseczki`/`material` -> `fabric`, `tiul_elastyczny` -> `tulle_elastic`, etc.), aby poprawnie łączyć zachowanie i bindować dane z głównym koszykiem i krokami konstruktora.
3. Przepisano funkcję `renderBiustonosz()` w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx), przenosząc 1:1 oryginalne ścieżki SVG, koordinaty, siatkę pomocniczą, asymetryczne kółka i regulatory oraz 16 precyzyjnych etykiet tekstowych.
4. Przekonwertowano klasy narzędziowe TailwindCSS wewnątrz SVG na czyste, standardowe atrybuty SVG (`fontFamily`, `fontSize`, `fontWeight`, `fill`), gwarantując poprawne renderowanie czcionek Montserrat/Playfair i kolorów Slate bez konieczności ładowania frameworka Tailwind w głównym projekcie.
5. Uzupełniono style w [index.css](file:///c:/Users/m-win/Projects/konstructor/frontend/src/index.css) o klatki kluczowe `@keyframes pulse` oraz klasę `.pulse-dot` dla migającej różowej kropki w nagłówku interaktywnego obszaru roboczego (identycznie jak na screenie).
6. Uruchomiono i przetestowano poprawność budowania obrazu Docker.
## Krok 11: Restrukturyzacja sekcji materiałów w konstruktorze biustonosza
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaktualizowano definicję części `GARMENT_PARTS.biustonosz` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx), zastępując stare materiały główne listą 6 specyficznych opcji: **Koronka elastyczna** (`lace_elastic`), **Koronka stabilna** (`lace_stable`), **Tkanina elastyczna** (`fabric_elastic`), **Tkanina stabilna** (`fabric_stable`), **Tiul elastyczny** (`tulle_elastic`) i **Tiul stabilny** (`tulle_stable`). Wszystkie 6 pozycji zostały oznaczone jako `isMain: true` oraz `required: false`.
2. Dodano nowe pomocnicze produkty w skrypcie bazy danych [seed.py](file:///c:/Users/m-win/Projects/konstructor/backend/seed.py) dla brakujących kategorii materiałów (Koronka stabilna, Tkanina elastyczna, Tkanina stabilna) i uruchomiono skrypt w kontenerze backendu w celu aktualizacji bazy danych SQLite.
3. Dostosowano logikę walidacji (`requiredCompleted`) w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx): teraz dla biustonosza wymagane jest wybranie przynajmniej jednego z 6 materiałów głównych (`hasMainMaterial`) oraz wszystkich obowiązkowych akcesoriów.
4. Zaimplementowano w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) precyzyjną filtrację produktów po stronie klienta w `handlePartClick` na podstawie nazwy produktu i wybranego kroku (np. filtrowanie koronek elastycznych vs stabilnych, tiuli elastycznych vs stabilnych, tkanin elastycznych vs stabilnych).
5. Przebudowano układ panelu bocznego "Elementy zestawu": dla modelu `biustonosz` 6 materiałów głównych jest renderowanych wewnątrz nowej, dedykowanej sekcji wizualnej **Materiał główny** z opisem *"Wybierz materiał z proponowanych dla wyboru głównego koloru produktu."*.
6. Dodano dynamiczne wyświetlanie wiodącego koloru na górze sekcji **Materiał główny**: po wybraniu dowolnego materiału pojawia się tam nazwa wybranego koloru oraz kolorowe kółko z podglądem (`colorHex`).
7. Akcesoria pozostają poza grupą materiałów głównych, są domyślnie zablokowane i stają się klikalne (aktywne) dopiero po określeniu koloru wiodącego.
8. Zoptymalizowano komponent [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx), dostosowując funkcje mapowania (`mapGuidePartIdToMainId`, `getGuidePartColor`, `isPartActive`, `getPartName`) do obsługi nowych 6 identyfikatorów, zachowując pełną kompatybilność wsteczną dla majtek i braletu.
9. Dodano style CSS w [index.css](file:///c:/Users/m-win/Projects/konstructor/frontend/src/index.css) dla kontenera `.main-materials-group`, jego nagłówka, opisu, odznaki koloru oraz listy elementów.
10. Przebudowano aplikację w kontenerach Docker za pomocą `docker compose up --build -d` i zweryfikowano poprawność kompilacji kodu React przez Vite w trybie produkcyjnym.
## Krok 12: Restrukturyzacja sekcji materiałów w konstruktorze majtek (Majtki)
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaktualizowano definicję części `GARMENT_PARTS.majtki` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx), zastępując stare materiały główne listą 4 opcji: **Koronka elastyczna** (`lace_elastic`), **Koronka stabilna** (`lace_stable`), **Tkanina elastyczna** (`fabric_elastic`) oraz **Tiul elastyczny** (`tulle_elastic`). Wszystkie 4 pozycje zostały oznaczone jako `isMain: true` oraz `required: false`.
2. Zaktualizowano warunek sprawdzania poprawności zestawu (`requiredCompleted`) w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) – dla modeli `biustonosz` oraz `majtki` wymagane jest teraz wybranie chociaż jednego materiału głównego (`hasMainMaterial`) oraz wszystkich obowiązkowych akcesoriów.
3. Rozszerzono logikę filtrowania materiałów po stronie klienta w `handlePartClick` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) na model `majtki`, co pozwala poprawnie filtrować koronki (elastyczne i stabilne), tkaniny oraz tiule elastyczne dla трусиков.
4. Zintegrowano grupowanie "Materiał główny" w panelu bocznym w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) dla modeli `biustonosz` i `majtki`, dzięki czemu główne materiały są spójnie renderowane pod tym samym nagłówkiem i z tym samym opisem, pokazując wybrany kolor i kolorową kropkę.
5. Dostosowano funkcje w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) (`getPartColor`, `getPartStroke`, `getPartStrokeWidth`, `mapGuidePartIdToMainId`) tak, aby poprawnie kolorować i wyróżniać elementy `majtki` w zależności od aktywnych nowych ID, z zachowaniem pełnej kompatybilności wstecznej dla `bralet` (gdzie nadal używane są `'fabric'` i `'lace'`).
6. Zaktualizowano zdarzenia kliknięcia (`onClick`) na ścieżkach SVG wewnątrz `renderMajtki` w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx), przełączając je na wywołanie `mapGuidePartIdToMainId('fabric')` oraz `mapGuidePartIdToMainId('lace')`.
7. Przebudowano aplikację w kontenerach Docker za pomocą `docker compose up --build -d` and zweryfikowano poprawność kompilacji kodu React przez Vite.

## Krok 13: Restrukturyzacja sekcji materiałów w konstruktorze braletu (Bralet) oraz pełna unifikacja kodu
**Data:** 2026-06-06

W tym kroku wykonaliśmy:
1. Zaktualizowano definicję części `GARMENT_PARTS.bralet` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx), zastępując stare materiały główne listą 6 specyficznych opcji: **Koronka elastyczna** (`lace_elastic`), **Koronka stabilna** (`lace_stable`), **Tkanina elastyczna** (`fabric_elastic`), **Tkanina stabilna** (`fabric_stable`), **Tiul elastyczny** (`tulle_elastic`) i **Tiul stabilny** (`tulle_stable`). Wszystkie 6 pozycji zostało oznaczonych jako `isMain: true` oraz `required: false`.
2. Zunifikowano logikę walidacji (`requiredCompleted`) w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) dla wszystkich typów odzieży – obecnie każdy model wymaga wybrania przynajmniej jednego materiału głównego (`hasMainMaterial`) oraz wszystkich obowiązkowych akcesoriów.
3. Zunifikowano filtrowanie po stronie klienta w `handlePartClick` w [App.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/App.jsx) oraz uproszczono renderowanie paska bocznego "Elementy zestawu", eliminując warunkowe bloki i renderując sekcję "Materiał główny" domyślnie dla każdego modelu.
4. Zaktualizowano pomocnicze mapowania w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) (`getPartColor`, `getPartStroke`, `getPartStrokeWidth`, `getGuidePartColor`, `isPartActive`), dodając pełne wsparcie dla `tulle_stable` oraz upraszczając warunki dotyczące typu bielizny.
5. Przypisano zdarzenia kliknięcia (`onClick`) wewnątrz `renderBralet()` w [GarmentVisualizer.jsx](file:///c:/Users/m-win/Projects/konstructor/frontend/src/components/GarmentVisualizer.jsx) do dynamicznego mapowania za pomocą `mapGuidePartIdToMainId` dla `'lace'` i `'fabric'`.
6. Przebudowano aplikację w kontenerach Docker za pomocą `docker compose up --build -d` i zweryfikowano poprawność kompilacji kodu React przez Vite.

## Krok 14: Dodanie możliwości usuwania z koszyka, elastyczna walidacja zamówień i oczyszczenie interfejsu
**Data:** 2026-06-07

W tym kroku wykonaliśmy:
1. Zaimplementowano przycisk usuwania pozycji (symbol "✕") bezpośrednio w wierszach koszyka (`cart-item-row`) w prawym panelu podsumowania, powiązany z funkcją `handleRemoveSelection`.
2. Dodano dedykowane style w [index.css](file:///c:/Users/m-win/Projects/konstructor/frontend/src/index.css) dla klasy `.cart-item-remove-btn` z subtelną animacją powiększenia (hover scale) i podświetleniem kolorem błędu (`--color-error`).
3. Zmodyfikowano warunek blokady przycisku "Dodaj zestaw do koszyka" (`btn-gold`): przycisk staje się aktywny natychmiast po wybraniu chociaż jednego produktu (`selectedCount > 0`), co umożliwia użytkownikom elastyczne dokupywanie pojedynczych akcesoriów.
4. Zaktualizowano powiadomienie pod przyciskiem dodawania do koszyka: zastąpiono czerwoną etykietę błędu pomocniczą szarą informacją o możliwości zamawiania pojedynczych elementów.
5. Usunięto tekst podpowiedzi *"✍️ Kliknij, aby wybrać"* dla niewybranych i odblokowanych elementów na liście wyboru, co optycznie wyszczupliło karty kroków konstrukcyjnych i uczyniło interfejs bardziej przejrzystym.
6. Przebudowano aplikację w Dockerze za pomocą `docker compose up --build -d` i przetestowano poprawność kompilacji kodu.


