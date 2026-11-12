# Конструктор наборов для шитья белья — subtelnedetale.pl

Интерактивный модуль для магазина: покупательница выбирает изделие (бюстгальтер, трусы, ночная сорочка),
кликает по детали на рисунке, выбирает материал из подходящих товаров — деталь закрашивается в цвет товара,
а товар с нужным количеством попадает в список набора, откуда его можно отправить в корзину.

Модуль полностью автономный: никаких сторонних сервисов, ключей и ИИ. Он общается только с двумя адресами магазина —
каталог материалов и корзина.

> **Важно (12.11.2026).** Магазин `subtelnedetale.pl` работает на WordPress + WooCommerce, а наборы уже собирает
> отдельное приложение `mojzestaw.subtelnedetale.pl` (sets-creator: Laravel + Inertia + Vue 3). Поэтому рисунки переносятся
> внутрь него — см. раздел 8 и [`sets-creator-visual/INTEGRATION.md`](sets-creator-visual/INTEGRATION.md).
> Разделы 3–5 описывают автономный вариант с собственным Laravel-бэкендом; для этого магазина он не понадобится.

| | |
|---|---|
| Интерфейс | React 19 + Vite 8, чистый CSS, язык интерфейса — польский |
| Сервер | Laravel (готовые файлы в `laravel-backend/`) |
| Журнал изменений | [`DEVELOP.md`](DEVELOP.md) |

---

## 1. Как этим пользоваться (покупатель)

1. **Выбрать изделие** — вкладки вверху: Biustonosz / Majtki / Koszulka nocna. Набор общий: можно собрать все три.
2. **Выбрать размер** (S–XL). От размера зависит расход материала.
3. **Кликнуть по детали** на рисунке (при наведении она подсвечивается, под рисунком появляется её название).
   То же самое делают плашки деталей под рисунком — через них выбираются и невидимые детали, например каркасы (Fiszbiny).
4. **Выбрать материал** в открывшемся окне. Показаны только товары, подходящие этой детали, с ценой и расчётом
   «на эту деталь: 0,5 m ≈ 19,00 zł». Окно закрывается по Esc, крестику или клику мимо. «Usuń wybór» снимает материал.
5. **Проверить список «Twój zestaw»** справа: один товар — одна строка, даже если он использован в нескольких деталях.
   Количество можно менять кнопками − / +, позицию — удалить.
6. **Отправить в корзину**: «Do koszyka» у одной позиции или «Dodaj cały zestaw do koszyka».

Дополнительно: кнопки **Gotowe palety** подбирают материалы одного цвета сразу для всех деталей изделия.
Набор сохраняется в браузере и переживает перезагрузку страницы. Всё доступно с клавиатуры (Tab, Enter).

---

## 2. Запуск у себя

Нужен Node.js 20.19+ или 22.12+.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 — режим разработки
```

| Команда | Что делает |
|---|---|
| `npm run dev` | сервер разработки с автообновлением |
| `npm run build` | сборка в `frontend/dist/` |
| `npm run preview` | просмотр собранной версии на http://localhost:4173 |
| `npm test` | тесты логики набора и целостности каталога |
| `npm run lint` | проверка кода |

Через Docker — см. раздел 8.

**Демо-режим.** Без настроенных адресов магазина конструктор берёт каталог из `frontend/public/materials.json`
и в корзину ничего не отправляет — при нажатии честно сообщает об этом.

---

## 3. Подключение к сайту (Laravel)

### Шаг 1. Собрать интерфейс

```bash
cd frontend && npm install && npm run build
```

Скопировать в проект магазина, в `public/constructor/`:

```
frontend/dist/constructor.js
frontend/dist/constructor.css
```

Имена файлов постоянные (без хеша). `materials.json` и `index.html` из `dist/` на сайт копировать не нужно — это демо.

### Шаг 2. Разложить серверные файлы

| Файл из `laravel-backend/` | Куда положить |
|---|---|
| `2026_11_12_000000_add_constructor_fields_to_products_table.php` | `database/migrations/` |
| `ConstructorController.php` | `app/Http/Controllers/` |
| `ConstructorAddToCartRequest.php` | `app/Http/Requests/` |
| `ConstructorMaterialResource.php` | `app/Http/Resources/` |
| `ConstructorCart.php`, `SessionConstructorCart.php` | `app/Services/` |
| `constructor_routes.php` | `routes/` |
| `constructor.blade.php` | `resources/views/` |

### Шаг 3. Подключить

1. Выполнить миграцию: `php artisan migrate`.
2. В конце `routes/web.php` добавить:
   ```php
   require base_path('routes/constructor_routes.php');
   ```
   Именно `web.php`, а не `api.php`: корзине нужны сессия и проверка CSRF.
3. В модели `Product` добавить приведение типов:
   ```php
   protected $casts = [
       'is_constructor_compatible' => 'boolean',
       'constructor_parts' => 'array',
       'constructor_palettes' => 'array',
   ];
   ```
4. В `AppServiceProvider::register()` привязать корзину:
   ```php
   $this->app->bind(\App\Services\ConstructorCart::class, \App\Services\SessionConstructorCart::class);
   ```
   `SessionConstructorCart` — рабочий пример на сессии. Если в магазине уже есть своя корзина, напишите класс
   с теми же тремя методами (`add`, `availableQuantity`, `url`), вызывающий её, и привяжите его.
5. Поправить под свой проект места, помеченные словом «замените»: модель товара, колонку остатков,
   маршрут карточки товара и путь к изображению в `ConstructorMaterialResource`.
6. Заполнить у товаров новые поля (раздел 5) и открыть `/constructor`.

> Серверные файлы написаны под Laravel 10+, но в этом репозитории не запускались — здесь нет проекта магазина.
> Проверен только синтаксис PHP. Интерфейс проверен против имитации этих адресов (раздел 4).

### Шаг 4. Точка встраивания

Конструктор запускается в элементе `id="subtelne-constructor"` и читает настройки из его атрибутов:

```html
<link rel="stylesheet" href="/constructor/constructor.css?v=12">

<div id="subtelne-constructor"
     data-materials-url="/constructor/materials"
     data-cart-url="/constructor/cart"
     data-cart-page-url="/cart"
     data-csrf-token="{{ csrf_token() }}"></div>

<script type="module" src="/constructor/constructor.js?v=12"></script>
```

| Атрибут | Назначение | Если не задан |
|---|---|---|
| `data-materials-url` | адрес каталога (GET) | демо-каталог `materials.json` рядом со страницей |
| `data-cart-url` | адрес добавления в корзину (POST) | демо-режим, ничего не отправляется |
| `data-cart-page-url` | страница корзины для ссылки «Przejdź do koszyka» | берётся `cart_url` из ответа сервера |
| `data-csrf-token` | CSRF-токен | берётся из `<meta name="csrf-token">` |

`?v=12` — номер версии для сброса кеша браузера; в `constructor.blade.php` он подставляется автоматически по дате файла.

**Оформление.** Стили не затрагивают остальную страницу: всё ограничено классом `.sdc`. Цвета и шрифты можно
переопределить из стилей магазина:

```css
.sdc {
  --sdc-color-primary: #c9a236;
  --sdc-font-sans: 'Inter', sans-serif;
  --sdc-font-serif: 'Playfair Display', serif;
}
```

Шрифты конструктор сам не загружает — используются те, что подключены на сайте, иначе системные.

---

## 4. API

Интерфейс делает ровно два запроса, оба на тот же домен, с cookies сессии. Весь сетевой код — в `frontend/src/api.js`.

### GET `/constructor/materials` — каталог

Ответ — массив товаров (или объект `{ "data": [...] }`):

```json
[
  {
    "id": 17,
    "name": "Koronka elastyczna 'Wenecka' (Głębokie Wino)",
    "category": "fabric",
    "type": "lace",
    "colorName": "Wino",
    "colorHex": "#881337",
    "price": 42.0,
    "unit": "m",
    "step": 0.1,
    "description": "Premium włoska koronka…",
    "image": "https://subtelnedetale.pl/storage/products/17.jpg",
    "url": "https://subtelnedetale.pl/produkt/koronka-wenecka",
    "inStock": true,
    "parts": null,
    "palettes": ["wine"]
  }
]
```

| Поле | Обязательно | Описание |
|---|---|---|
| `id` | да | число или строка |
| `name` | да | название |
| `category` | да | `fabric`, `elastic`, `underwire`, `hardware`, `closure` |
| `price` | да | цена за единицу; число или строка `"42.00"` |
| `type` | нет | уточнение категории: `lace`, `microfiber`, `mesh`, `cotton`, `satin`, `strap`, `band`, `tunnel`, `wire` |
| `colorHex` | нет | `#rrggbb` — цвет закраски детали; неверное значение заменяется серым |
| `colorName` | нет | название цвета |
| `unit` | нет | `m`, `szt`, `kpl`, `para` (по умолчанию `szt`) |
| `step` | нет | шаг продажи; по умолчанию 0.1 для `m` и 1 для остального |
| `image` | нет | адрес фото; без него рисуется образец материала |
| `inStock` | нет | `false` — товар виден, но выбрать нельзя |
| `parts` | нет | явный список деталей, напр. `["bra.cups", "panties.front"]`; важнее правила «категория + тип» |
| `palettes` | нет | в какие готовые палитры входит: `emerald`, `wine`, `blush`, `black` |

Записи без `id`, `name`, `category` или с нечисловой ценой интерфейс молча пропускает.

### POST `/constructor/cart` — добавить в корзину

Заголовки: `Content-Type: application/json`, `Accept: application/json`, `X-CSRF-TOKEN: …`.

```json
{ "items": [ { "product_id": 17, "quantity": 0.5 }, { "product_id": 23, "quantity": 1 } ] }
```

Цена в запросе не передаётся — сервер берёт её из базы.

| Ответ | Тело | Что видит покупатель |
|---|---|---|
| 200 | `{ "success": true, "added_items_count": 2, "cart_url": "/cart" }` | «Dodano do koszyka…» и ссылка на корзину |
| 422 | `{ "success": false, "message": "…", "errors": { "items.0.quantity": ["…"] } }` | текст первой ошибки |
| 419 | любое | «Sesja wygasła. Odśwież stronę…» |
| 429 | любое | «Zbyt wiele prób…» |
| 500 и прочее | любое | общее сообщение без технических деталей |

`cart_url` принимается только если ведёт на тот же домен.

**Что проверяет сервер** (`ConstructorAddToCartRequest`): от 1 до 30 позиций; в позиции только `product_id` и `quantity`;
товар существует, помечен для конструктора и не повторяется; количество больше 0, не больше 50 и кратно шагу продажи.
Остатки проверяются по всем позициям до изменения корзины — добавляется либо всё, либо ничего.
Ограничение частоты: каталог — 60 запросов в минуту, корзина — 20.

Каталог кешируется на 5 минут. После изменения товаров сбросить: `Cache::forget('constructor.materials')`.

---

## 5. Настройка каталога и изделий

### Поля товара в базе

| Колонка | Пример | Назначение |
|---|---|---|
| `is_constructor_compatible` | `true` | показывать в конструкторе |
| `constructor_category` | `fabric` | категория |
| `constructor_type` | `lace` | тип внутри категории |
| `color_hex`, `color_name` | `#881337`, `Wino` | цвет детали и его название |
| `consumption_unit` | `m` | единица продажи |
| `sale_step` | `0.10` | шаг продажи |
| `constructor_parts` | `["bra.cups"]` или `NULL` | явная привязка к деталям (необязательно) |
| `constructor_palettes` | `["wine"]` или `NULL` | участие в готовых палитрах (необязательно) |

### Какая деталь что принимает

Таблица совместимости и нормы расхода — в `frontend/src/config/garments.js`. Пример:

```js
{ id: 'cups', label: 'Miseczki',
  accepts: { category: 'fabric', types: ['lace', 'microfiber'] },   // что можно выбрать
  qty: bySize(0.4, 0.5, 0.6, 0.7) }                                  // расход для S, M, L, XL
```

| Изделие | Деталь → допустимые типы |
|---|---|
| Бюстгальтер | чашки → lace, microfiber · мостик → mesh · пояс → microfiber, mesh · бретели → strap · отделочные резинки → band · тоннели → tunnel · каркасы → wire · регуляторы → hardware · застёжка → closure |
| Трусы | перед → lace, microfiber · зад → microfiber, mesh, lace · ластовица → cotton, mesh · талия → band · вырезы ног → band |
| Сорочка | лиф → lace · низ → satin, microfiber, lace · бретели → strap · под грудью → band · кайма → lace |

Порядок типов — это ещё и предпочтение для готовых палитр (для низа сорочки сначала ищется сатин).

**Нормы расхода в файле — ориентировочные.** Перед запуском их должен проверить технолог или швея магазина.

Количество в списке = сумма норм всех деталей, где использован товар, округлённая вверх до шага продажи.
После изменения `garments.js` запустите `npm test` — тест проверит, что у каждой детали есть хотя бы один товар
в демо-каталоге и что каждая палитра покрывает все детали, — и пересоберите интерфейс.

---

## 6. Структура проекта

```
sets-creator-visual/          макет для sets-creator: Vue-компоненты, сервер-заглушка, INTEGRATION.md
frontend/
  index.html                  демо-страница
  public/materials.json       демо-каталог (43 товара)
  src/
    main.jsx                  запуск в #subtelne-constructor
    App.jsx                   состояние и разметка
    api.js                    запросы к магазину, нормализация товаров
    config/garments.js        изделия, детали, совместимость, нормы, палитры
    lib/kit.js                расчёт набора (чистые функции)
    lib/storage.js            сохранение набора в браузере
    lib/format.js             формат цен и количеств
    components/
      BraSvg / PantiesSvg / NightgownSvg   рисунки изделий
      useGarmentParts.js, GarmentBits.jsx  общая логика рисунков
      ProductPicker.jsx       окно выбора материала
      KitList.jsx             список набора
      ProductSwatch.jsx       фото товара или нарисованный образец
  tests/kit.test.js           тесты
laravel-backend/              файлы для проекта магазина (раздел 3)
DEVELOP.md                    журнал шагов разработки
PLAN_AND_SPEC.md              исходное ТЗ (устарело, оставлено для истории)
```

---

## 8. Макет для sets-creator и запуск через Docker

Папка `sets-creator-visual/` — те же рисунки изделий на Vue 3 плюс сервер-заглушка, повторяющий адреса и формат данных
sets-creator. Деталь закрашивается фотографией выбранного товара. Данные цели «majtki» — настоящие, с сайта.

### Через Docker

Нужны Docker и Docker Compose. Из корня репозитория:

```bash
docker compose up --build
```

| Адрес | Что это |
|---|---|
| http://localhost:8080 | макет режима «рисунок» для sets-creator |
| http://localhost:5173 | автономный конструктор (React), режим разработки |

Только макет: `docker compose up --build mojzestaw`. Остановить: `Ctrl+C`, затем `docker compose down`.
Если порт занят — поменяйте левую часть в `ports` в `docker-compose.yml`, например `"9090:8080"`.

Фото товаров в макете грузятся с `subtelnedetale.pl`, поэтому нужен интернет. В корзину магазина макет ничего не отправляет.

### Без Docker

```bash
cd sets-creator-visual
npm install
npm run build && npm start     # http://localhost:8080
npm run dev                    # разработка: http://localhost:5174, заглушка на 8080
npm test
```

---

## 7. Что осталось сделать

- **Реальные фото и товары.** Демо-каталог условный, поле `image` в нём пустое. Нужно заполнить поля товаров в базе магазина.
- **Проверка серверной части на живом Laravel** и подключение настоящей корзины магазина.
- **Нормы расхода** — подтвердить у технолога.
- **Каркасы по размеру.** Сейчас в окне показаны все размеры каркасов; автоматический подбор по обхвату и чашке не сделан.
- **Рисунки изделий — иллюстрации.** Для фотореализма нужна фотография белого изделия и маски деталей поверх неё.
- **Зависимости сборки:** `npm audit` показывает 4 замечания средней важности в инструментах разработки
  (в собранный код не попадают); исправляются только обновлением с несовместимыми изменениями.
