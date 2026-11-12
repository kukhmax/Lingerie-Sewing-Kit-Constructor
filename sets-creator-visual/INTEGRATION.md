# Перенос режима «рисунок» в sets-creator

Эта папка — заготовка для приложения **sets-creator** (`mojzestaw.subtelnedetale.pl`, Laravel + Inertia + Vue 3).
Доступа к его репозиторию пока нет, поэтому серверная часть здесь имитируется заглушкой.
Всё, что лежит в `src/visual/`, написано так, чтобы потом просто скопировать.

## Что откуда взято

Снято с работающего сайта 12.11.2026 (только чтение):

- страница набора — компонент Inertia `Customer/Goals/Show` с props `goal`, `selection`, `verdict`, `summary`, `limits`, `sentAt`;
- выбор товара — `PATCH /goals/{goal}/slots/{slot}` с `{ product_id, quantity }`;
- снятие выбора — `DELETE /goals/{goal}/slots/{slot}`;
- перенос в корзину — `POST /goals/{goal}/cart` с `{ replace_cart, confirm_incomplete }`;
- цель «majtki» (id 2) со слотами и 28 товарами — в `mock-server/data/goals.json` лежит без изменений, кроме двух новых полей.

**Чего я не видел и что в заглушке угадано:** форма элементов `summary.items` (на сайте видел только пустой список),
точные тексты и коды ошибок сервера, поведение `POST /cart` при неполном наборе, структура таблиц базы.
Цели 101 и 102 (бюстгальтер, сорочка) выдуманы для демонстрации рисунков.

## Что нужно добавить в sets-creator

### 1. Два поля в данных

| Где | Поле | Значения | Смысл |
|---|---|---|---|
| шаблон цели | `visual` | `bra`, `panties`, `nightgown` или `null` | какой рисунок показывать; `null` — страница остаётся как сейчас |
| слот | `visual_parts` (JSON) | список id деталей рисунка, может быть пустым | какие детали закрашивает товар этого слота |

Один слот может закрашивать несколько деталей («tkanina» → перед, зад и ластовица), слот без деталей
(нитки) остаётся плашкой под рисунком. Деталь, не привязанная ни к одному слоту, рисуется нейтрально и не кликается.

Id деталей:

| Рисунок | Детали |
|---|---|
| `bra` | `cups`, `gore`, `wings`, `straps`, `elastics`, `underwires`, `hardware`, `closure` |
| `panties` | `front`, `back`, `gusset`, `waist`, `legs` |
| `nightgown` | `bodice`, `skirt`, `straps`, `underbust`, `trim` |

Одна деталь должна принадлежать не более чем одному слоту — это стоит проверять при сохранении в админке.

### 2. Отдать поля на страницу

В данных страницы `Customer/Goals/Show` добавить `goal.visual` и `slots[].visualParts` (camelCase, как остальные поля).

### 3. Поля в админке

В форме шаблона цели — выпадающий список «Rysunek», в форме слота — флажки деталей выбранного рисунка.

### 4. Скопировать компоненты

`src/visual/*` → `resources/js/Components/Visual/` (или куда принято в проекте).
Зависимостей кроме Vue 3 нет. Стили — один файл `visual.css`, все классы с префиксом `sgv-`, Tailwind не нужен.

### 5. Подключить на странице

`VisualConfigurator` сам запросов не делает — только сообщает о действиях. В `Show.vue` это несколько строк
поверх уже существующих вызовов роутера:

```vue
<script setup>
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import VisualConfigurator from '@/Components/Visual/VisualConfigurator.vue';

const props = defineProps({ goal: Object, selection: [Object, Array], verdict: Object, summary: Object, limits: Object, sentAt: String, errors: Object });

const pending = ref(false);
const sending = ref(false);
const only = ['selection', 'verdict', 'summary', 'flash', 'errors', 'sentAt'];
const opts = (flag) => ({
  preserveScroll: true, preserveState: true, only,
  onStart: () => (flag.value = true), onFinish: () => (flag.value = false),
});

const select = (slotId, productId) =>
  router.patch(`/goals/${props.goal.id}/slots/${slotId}`, { product_id: productId, quantity: 1 }, opts(pending));
const quantity = (slotId, qty) =>
  router.patch(`/goals/${props.goal.id}/slots/${slotId}`, { product_id: props.selection[slotId].productId, quantity: qty }, opts(pending));
const remove = (slotId) => router.delete(`/goals/${props.goal.id}/slots/${slotId}`, opts(pending));
const send = ({ replaceCart, confirmIncomplete }) =>
  router.post(`/goals/${props.goal.id}/cart`,
    { replace_cart: replaceCart, ...(confirmIncomplete ? { confirm_incomplete: true } : {}) }, opts(sending));
</script>

<template>
  <VisualConfigurator v-if="goal.visual" v-bind="{ goal, selection, verdict, summary, limits, sentAt, pending, sending, errors }"
    @select="select" @quantity="quantity" @remove="remove" @send="send" />
  <!-- иначе — прежняя разметка страницы -->
</template>
```

Сниппет написан по снятому с сайта коду и в настоящем проекте не запускался — сверить с реальным `Show.vue`.

### 6. Политика безопасности

Менять не нужно: скрипты и стили свои, фото товаров грузятся с `https://subtelnedetale.pl`, что уже разрешено в `img-src`.
Встроенных стилей (`style="…"`) в компонентах нет.

## Известные ограничения

- **Текстура из фото товара.** Деталь заливается средней частью фотографии, выложенной зеркальной плиткой.
  На плоских снимках кружева выглядит хорошо, на снимках драпированной ткани или катушек появляется «калейдоскоп».
  Надёжнее добавить товару отдельное фото-образец или цвет; компонент возьмёт его, если подставить в `imageUrl`.
- **Количество** — целые штуки, как сейчас в sets-creator. Нормы расхода по размеру сюда не перенесены.
- **Мелкая фурнитура** на рисунке закрашивается той же текстурой из фото — на регуляторах это почти не читается.
