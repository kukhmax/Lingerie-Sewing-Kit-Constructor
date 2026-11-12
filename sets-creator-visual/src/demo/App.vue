<script setup>
// Strona-gospodarz makiety: odgrywa rolę stron Customer/Goals/Index i Customer/Goals/Show.
import { onMounted, ref } from 'vue';
import VisualConfigurator from '../visual/VisualConfigurator.vue';
import { clearSlot, listGoals, sendToCart, setSlot, showGoal } from './api.js';

const goals = ref([]);
const page = ref(null); // { goal, selection, verdict, summary, limits, sentAt }
const pending = ref(false);
const sending = ref(false);
const errors = ref({});
const loadError = ref(null);

const goalIdFromHash = () => Number(/^#\/goals\/(\d+)$/.exec(window.location.hash)?.[1]) || null;

async function route() {
  errors.value = {};
  loadError.value = null;
  const id = goalIdFromHash();
  try {
    if (id) page.value = await showGoal(id);
    else {
      page.value = null;
      goals.value = (await listGoals()).goals;
    }
  } catch (e) {
    loadError.value = e.message;
  }
}

// Wspólna obsługa akcji: serwer zwraca nowy stan (selection, verdict, summary, sentAt)
async function act(flag, request) {
  flag.value = true;
  errors.value = {};
  try {
    const { mock, ...state } = await request();
    page.value = { ...page.value, ...state };
    return mock;
  } catch (e) {
    errors.value = e.errors;
  } finally {
    flag.value = false;
  }
}

const id = () => page.value.goal.id;
const currentQty = (slotId) => (Array.isArray(page.value.selection) ? null : page.value.selection[slotId]);

const onSelect = (slotId, productId) => act(pending, () => setSlot(id(), slotId, productId, 1));
const onQuantity = (slotId, quantity) => act(pending, () => setSlot(id(), slotId, currentQty(slotId).productId, quantity));
const onRemove = (slotId) => act(pending, () => clearSlot(id(), slotId));
const onSend = (options) => act(sending, () => sendToCart(id(), options));

const slotsText = (g) => `${g.requiredSlots} elementów wymaganych, ${g.optionalSlots} opcjonalny`;

onMounted(() => {
  window.addEventListener('hashchange', route);
  route();
});
</script>

<template>
  <header class="demo-bar">
    <a href="#/">Mój zestaw</a>
    <span>makieta — dane i serwer są imitacją sets-creator, do koszyka sklepu nic nie trafia</span>
  </header>

  <p v-if="loadError" class="demo-error">Nie udało się wczytać danych: {{ loadError }}</p>

  <main v-else-if="!page" class="demo-index">
    <h1>Co chcesz uszyć?</h1>
    <p>Wybierz cel, a poprowadzimy Cię do kompletnego zestawu produktów.</p>
    <div class="demo-goals">
      <article v-for="g in goals" :key="g.id">
        <h2>{{ g.name }}</h2>
        <p>{{ slotsText(g) }}</p>
        <p>{{ g.availableProducts }} produktów do wyboru</p>
        <a :href="`#/goals/${g.id}`">Skompletuj zestaw</a>
      </article>
    </div>
  </main>

  <main v-else>
    <div class="demo-head">
      <a href="#/">← Wszystkie cele</a>
      <h1>{{ page.goal.name }}</h1>
    </div>
    <VisualConfigurator
      :goal="page.goal"
      :selection="page.selection"
      :verdict="page.verdict"
      :summary="page.summary"
      :limits="page.limits"
      :sent-at="page.sentAt"
      :pending="pending"
      :sending="sending"
      :errors="errors"
      @select="onSelect"
      @quantity="onQuantity"
      @remove="onRemove"
      @send="onSend"
    />
  </main>
</template>

<style>
.demo-bar { display: flex; gap: 1rem; align-items: baseline; padding: 0.6rem 1.5rem; background: #1f2937; color: #e5e7eb; font-size: 0.8rem; }
.demo-bar a { color: #fde68a; font-weight: 600; font-size: 1rem; text-decoration: none; }
.demo-index, .demo-head { max-width: 1280px; margin: 0 auto; padding: 1.5rem 1.5rem 0; }
.demo-head h1 { margin: 0.25rem 0 0; text-transform: capitalize; }
.demo-head a { color: #8a6d1c; font-size: 0.85rem; }
.demo-goals { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
.demo-goals article { padding: 1.25rem; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
.demo-goals h2 { margin: 0 0 0.5rem; text-transform: capitalize; }
.demo-goals p { margin: 0.15rem 0; color: #6b7280; font-size: 0.9rem; }
.demo-goals a { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #c9a236; color: #fff; border-radius: 6px; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none; }
.demo-error { margin: 2rem; color: #b42318; }
</style>
