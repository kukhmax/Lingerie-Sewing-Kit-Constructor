<script setup>
/**
 * Tryb „rysunek” dla strony Customer/Goals/Show w sets-creator.
 *
 * Komponent jest czysto prezentacyjny: dostaje te same props co strona Inertia
 * (goal, selection, verdict, summary, limits, sentAt) i zgłasza zdarzenia.
 * Zapytania do serwera wykonuje strona nadrzędna — tak jak robi to dziś Show.vue.
 */
import { computed, ref } from 'vue';
import GarmentVisual from './GarmentVisual.vue';
import ProductPicker from './ProductPicker.vue';
import { buildLines, formatPrice, normalizeSelection, selectedProduct } from './contract.js';
import './visual.css';

const props = defineProps({
  goal: { type: Object, required: true }, // + nowe pola: goal.visual, slot.visualParts
  selection: { type: [Object, Array], required: true },
  verdict: { type: Object, required: true },
  summary: { type: Object, required: true },
  limits: { type: Object, required: true },
  sentAt: { type: String, default: null },
  pending: { type: Boolean, default: false }, // trwa zapis wyboru
  sending: { type: Boolean, default: false }, // trwa przenoszenie do koszyka
  errors: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  'select', // (slotId, productId)
  'quantity', // (slotId, quantity)
  'remove', // (slotId)
  'send', // ({ replaceCart, confirmIncomplete })
]);

const activeSlotId = ref(null);
const replaceCart = ref(false);
const askedIncomplete = ref(false);

const selection = computed(() => normalizeSelection(props.selection));
const lines = computed(() => buildLines(props.goal, selection.value));
const activeSlot = computed(() => props.goal.slots.find((s) => s.id === activeSlotId.value) ?? null);
const missingIds = computed(() => new Set(props.verdict.missingRequired.map((s) => s.id)));
const errorList = computed(() => Object.values(props.errors).flat());
// potwierdzenie obowiązuje tylko dopóki zestaw jest niekompletny
const confirming = computed(() => askedIncomplete.value && !props.verdict.complete);
const canSend = computed(() => lines.value.length > 0 && !props.pending && !props.sending);

const slotProduct = (slot) => selectedProduct(slot, selection.value);

function pick(productId) {
  emit('select', activeSlotId.value, productId);
  activeSlotId.value = null;
}

function clear() {
  emit('remove', activeSlotId.value);
  activeSlotId.value = null;
}

function send() {
  if (!props.verdict.complete && !confirming.value) {
    askedIncomplete.value = true; // najpierw potwierdzenie niekompletnego zestawu
    return;
  }
  emit('send', { replaceCart: replaceCart.value, confirmIncomplete: !props.verdict.complete });
  askedIncomplete.value = false;
}
</script>

<template>
  <div class="sgv">
    <div class="sgv-layout">
      <section class="sgv-card sgv-stage" :aria-label="`Podgląd: ${goal.name}`">
        <div v-if="goal.visual" class="sgv-canvas">
          <GarmentVisual :goal="goal" :selection="selection" :active-slot-id="activeSlotId" @select="activeSlotId = $event" />
        </div>

        <!-- Wszystkie sloty, także te bez części na rysunku (np. nici) -->
        <ul class="sgv-slots">
          <li v-for="slot in goal.slots" :key="slot.id">
            <button
              type="button"
              class="sgv-slot"
              :class="{ 'is-done': slotProduct(slot), 'is-missing': missingIds.has(slot.id) && confirming }"
              @click="activeSlotId = slot.id"
            >
              <img v-if="slotProduct(slot)" class="sgv-swatch sgv-swatch-sm" :src="slotProduct(slot).imageUrl" alt="" />
              <i v-else />
              <span>
                <strong>{{ slot.name }} <em v-if="!slot.required" class="sgv-slot-badge">opcja</em></strong>
                <small>{{ slotProduct(slot)?.name ?? 'Wybierz produkt' }}</small>
              </span>
            </button>
          </li>
        </ul>
      </section>

      <aside class="sgv-card sgv-side" aria-label="Twój zestaw">
        <h3 class="sgv-card-title">
          Twój zestaw
          <span class="sgv-muted">{{ verdict.filledSlots }}/{{ verdict.totalSlots }}</span>
        </h3>

        <p v-for="message in errorList" :key="message" class="sgv-notice sgv-notice--error" role="alert">{{ message }}</p>
        <p v-if="sentAt" class="sgv-notice sgv-notice--ok" role="status">
          Zestaw wysłany do koszyka sklepu. Możesz go poprawić i wysłać ponownie.
        </p>

        <p v-if="lines.length === 0" class="sgv-empty">
          Lista jest pusta. Kliknij część wyrobu na rysunku i wybierz produkt — pojawi się tutaj.
        </p>

        <template v-else>
          <ul class="sgv-kit">
            <li v-for="line in lines" :key="line.slot.id" class="sgv-kit-line">
              <img class="sgv-swatch sgv-swatch-sm" :src="line.product.imageUrl" alt="" />
              <div class="sgv-kit-main">
                <div class="sgv-kit-name">{{ line.product.name }}</div>
                <div class="sgv-muted">{{ line.slot.name }}</div>
                <div class="sgv-kit-controls">
                  <div class="sgv-stepper" role="group" :aria-label="`Ilość: ${line.product.name}`">
                    <button
                      type="button"
                      aria-label="Mniej"
                      :disabled="line.quantity <= limits.minQuantity"
                      @click="emit('quantity', line.slot.id, line.quantity - 1)"
                    >
                      −
                    </button>
                    <span aria-live="polite">{{ line.quantity }} szt</span>
                    <button
                      type="button"
                      aria-label="Więcej"
                      :disabled="line.quantity >= limits.maxQuantity"
                      @click="emit('quantity', line.slot.id, line.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                  <strong>{{ formatPrice(line.lineTotal) }}</strong>
                </div>
                <div class="sgv-kit-actions">
                  <button type="button" class="sgv-link" @click="activeSlotId = line.slot.id">Zmień</button>
                  <button type="button" class="sgv-link sgv-link-danger" @click="emit('remove', line.slot.id)">Usuń</button>
                </div>
              </div>
            </li>
          </ul>

          <div class="sgv-total">
            <span>Razem</span>
            <strong>{{ formatPrice(summary.total) }}</strong>
          </div>
        </template>

        <p v-if="!verdict.complete && lines.length > 0" class="sgv-notice">
          Brakuje: <strong>{{ verdict.missingRequired.map((s) => s.name).join(', ') }}</strong>.
          <template v-if="confirming"> Możesz dodać zestaw do koszyka mimo to — brakujące elementy dokupisz osobno.</template>
        </p>

        <label class="sgv-check">
          <input v-model="replaceCart" type="checkbox" />
          <span>Zastąp obecną zawartość mojego koszyka w sklepie tym zestawem (usuwa też kupony).</span>
        </label>

        <button type="button" class="sgv-btn sgv-btn-primary sgv-btn-block" :disabled="!canSend" @click="send">
          {{ sending ? 'Przenoszenie do koszyka…' : confirming ? 'Dodaj mimo braków' : 'Do koszyka' }}
        </button>
      </aside>
    </div>

    <ProductPicker
      v-if="activeSlot"
      :key="activeSlot.id"
      :goal-name="goal.name"
      :kit-slot="activeSlot"
      :selected-id="selection[activeSlot.id]?.productId ?? null"
      @select="pick"
      @clear="clear"
      @close="activeSlotId = null"
    />
  </div>
</template>
