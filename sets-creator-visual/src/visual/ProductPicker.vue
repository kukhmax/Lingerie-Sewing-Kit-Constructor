<script setup>
import { onMounted, ref } from 'vue';
import { formatPrice } from './contract.js';

// Okno wyboru produktu dla jednego slotu
defineProps({
  goalName: { type: String, required: true },
  kitSlot: { type: Object, required: true },
  selectedId: { type: Number, default: null },
});
const emit = defineEmits(['select', 'clear', 'close']);

const dialog = ref(null);
onMounted(() => dialog.value?.showModal());
const close = () => dialog.value?.close();
</script>

<template>
  <dialog
    ref="dialog"
    class="sgv-dialog"
    aria-labelledby="sgv-picker-title"
    @close="emit('close')"
    @click="$event.target === dialog && close()"
  >
    <div class="sgv-dialog-body">
      <header class="sgv-dialog-head">
        <div>
          <div class="sgv-eyebrow">{{ goalName }} · {{ kitSlot.required ? 'element wymagany' : 'element opcjonalny' }}</div>
          <h3 id="sgv-picker-title">{{ kitSlot.name }}</h3>
          <p v-if="kitSlot.description" class="sgv-muted">{{ kitSlot.description }}</p>
        </div>
        <button type="button" class="sgv-icon-btn" aria-label="Zamknij" @click="close">×</button>
      </header>

      <p v-if="kitSlot.products.length === 0" class="sgv-empty">Brak produktów dla tego elementu.</p>
      <ul v-else class="sgv-product-grid">
        <li v-for="product in kitSlot.products" :key="product.id" class="sgv-product-wrap">
          <button
            type="button"
            class="sgv-product"
            :class="{ 'is-selected': product.id === selectedId }"
            :aria-pressed="product.id === selectedId"
            @click="emit('select', product.id)"
          >
            <img class="sgv-swatch sgv-swatch-lg" :src="product.imageUrl" alt="" loading="lazy" />
            <span class="sgv-product-name">{{ product.name }}</span>
            <span class="sgv-product-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.id === selectedId" class="sgv-product-check">Wybrano</span>
          </button>
          <a v-if="product.permalink" class="sgv-product-link" :href="product.permalink" target="_blank" rel="noopener">
            Zobacz w sklepie ↗
          </a>
        </li>
      </ul>

      <footer class="sgv-dialog-foot">
        <button v-if="selectedId !== null" type="button" class="sgv-btn sgv-btn-ghost" @click="emit('clear')">Usuń wybór</button>
        <button type="button" class="sgv-btn" @click="close">Zamknij</button>
      </footer>
    </div>
  </dialog>
</template>
