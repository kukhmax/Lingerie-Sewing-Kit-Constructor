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
3. Opracowano główny komponent `frontend/src/App.jsx` w języku polskim.

---

## Krok 4: Interaktywne schematy SVG (Biustonosz, Majtki, Koszulka nocna)
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Utworzono trzy wektorowe rysunki (SVG) dla bielizny (`BraSvg.jsx`, `PantiesSvg.jsx`, `NightgownSvg.jsx`).
2. Powiązano kształty z systemem stylów CSS.
3. Dodano obsługę kliknięć w celu wyboru części i filtrowania.
4. Zaimplementowano dynamiczny fill i nałożenie tekstur.

---

## Krok 5: Logika kompletacji zestawu (Checklist) i wskaźnik postępu
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Wdrożono mechanizm walidacji kompletności wyrobu w panelu bocznym.
2. Dodano graficzny wskaźnik postępu (Progress Bar) u góry prawej kolumny.
3. Dodano plakietkę sukcesu "Zestaw kompletny i gotowy do szycia! 🎉".
4. Przetestowano aplikację pod kątem postwarnego sumowania cen oraz przeliczania standardowych norm zużycia.

---

## Krok 6: Wyszukiwanie i dobór materiałów przez Gemini AI
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Skonfigurowano model językowy Gemini AI do pracy jako projektant bieliźniany w języku polskim.
2. Zaprojektowano prompt systemowy przekazujący katalog produktów.
3. Dodano okno ustawień klucza API dewelopera i powiązano z `VITE_GEMINI_API_KEY`.
4. Napisano parser wyrażeń regularnych wyodrębniający blok JSON z rekomendacjami.
5. Uruchomiono lokalny serwer deweloperski pod adresem `http://localhost:5173/`.

---

## Krok 7: Kompilacja produkcyjna i pełna dokumentacja integracji
**Data:** 2026-06-05

W tym kroku wykonaliśmy:
1. Przetestowano kompilację produkcyjną frontu za pomocą komendy `npm run build` w folderze `/frontend`. Kompilacja przebiegła pomyślnie w czasie 1.05 sekundy bez żadnych ostrzeżeń ani błędów (wygenerowano zoptymalizowane pliki JS i CSS w folderze `dist/`).
2. Utworzono kompletny i szczegółowy plik dokumentacji `README.md` w katalogu głównym projektu, opisujący:
   * Architekturę rozwiązania i zastosowane technologie.
   * Sposób instalacji i komendy uruchomienia lokalnego (oraz polecenia Docker).
   * Instrukcję krok po kroku, jak zintegrować moduł z silnikiem Laravel sklepu **subtelnedetale.pl** (migracje SQL, routing, kontroler PHP, widoki Blade oraz deployment zasobów).
3. Zweryfikowano działanie aplikacji w przeglądarce pod adresem `http://localhost:5173/`.

---

# Журнал доработок (с 2026-11-12, на русском)

Ниже — шаги доработки после ревью безопасности и UX. Каждый шаг — отдельный коммит в ветке
`claude/constructor-security-ux-review-ol8g8h`.

## Шаг 8: Реалистичный бюстгальтер
* `BraSvg.jsx` перерисован по фото-референсу: вид спереди, широкие бретели, чашки со швом и вытачкой,
  мостик, боковые крылья, задняя лента с застёжкой, кант-пикот.
* Невыбранная деталь — контур, выбранная — заливка цветом товара. Подсветка и подпись при наведении,
  управление с клавиатуры (Tab / Enter).

## Шаг 9: Удалён ИИ-консультант (Gemini)
* Из `App.jsx` убраны чат, поле ввода ключа, вызов `generativelanguage.googleapis.com` и разбор ответа.
* Из `docker-compose.yml` убрана переменная `VITE_GEMINI_API_KEY`, из `index.css` — стили чата.
* Конструктор теперь полностью автономный: никаких внешних сервисов и ключей, только каталог и корзина магазина.
* Причина: ключ из `VITE_*` попадал в публичный JS-бандл и передавался в URL — его мог забрать любой посетитель.

## Шаг 10 (пункт 1): Целевой сценарий — окно выбора и список набора
* `App.jsx` переписан. Клик по детали на рисунке (или по плашке детали под рисунком) открывает окно
  `ProductPicker` — в нём только совместимые с деталью товары, с изображением, ценой и расчётом
  «на эту деталь: 0,5 m ≈ 19,00 zł». Выбор закрашивает деталь и закрывает окно; Esc / клик по фону / «Zamknij» — закрыть,
  «Usuń wybór» — снять материал.
* `KitList` — боковой список «Twój zestaw»: один товар = одна строка со всех трёх изделий сразу,
  кнопки −/+ количества (с шагом продажи), «Usuń», «Do koszyka» для одной позиции и «Dodaj cały zestaw».
* `config/garments.js` — таблица деталей: что принимает каждая деталь (`accepts`) и норма расхода по размеру (`qty`).
* `lib/kit.js` — чистая логика: совместимость, округление до шага продажи, сборка списка покупок.
  Количество теперь = сумма норм деталей, а не `standard_qty × число деталей` (пресет «Szmaragd»: было 216 zł, стало ~60 zł).
* `api.js` — единственное место сетевых запросов. Без `data-cart-url` работает демо-режим и честно сообщает,
  что в корзину ничего не добавлено (раньше при ошибке сети показывался «успех»).
* Вместо `alert()` — всплывающие уведомления; ошибки 419 / 422 / 429 показываются понятным текстом.
* Добавлен выбор размера (S–XL) и невидимая на рисунке деталь «Fiszbiny» (сами каркасы).
* Удалены неиспользуемые `App.css`, `src/assets/*`, `public/icons.svg`; в `index.html` язык `pl` и нормальный заголовок.

## Шаг 11 (пункт 2): Данные — совместимость, нормы по размеру, контракт каталога
* Каждому товару добавлены поля `type` (lace / microfiber / mesh / cotton / satin / strap / band / tunnel / wire),
  `step` (шаг продажи), `inStock`, `image`, `palettes`; удалено `standard_qty` — норма расхода теперь принадлежит детали, а не товару.
* Демо-каталог расширен с 26 до 43 позиций, чтобы у каждой детали был выбор: сатин, хлопок на ластовицу,
  сетка, микрофибра в цветах палитр, каркасы пяти размеров.
* `api.js → normalizeProduct` приводит ответ магазина к одному виду: числовой `id` → строка, цена-строка (`"38.00"`,
  так Laravel отдаёт `decimal`) → число, некорректный `colorHex` → серый, записи без id / названия / цены отбрасываются.
* Товар может прийти с явным списком `parts` (`["bra.cups", "panties.front"]`) — он важнее правила «категория + тип».
* Тесты `npm test` (встроенный `node --test`, без новых зависимостей): совместимость, округление, сборка набора,
  нормализация, а также проверка каталога — у каждой детали есть товар и каждая палитра покрывает все детали.
* **Не сделано:** реальные фото и id. Доступа к базе магазина из этой среды нет, поэтому `image` в демо-каталоге пустой
  и вместо фото рисуется образец материала. Как только API отдаст `image`, фото появятся без правок кода.
