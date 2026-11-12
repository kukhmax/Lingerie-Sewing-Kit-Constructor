<script setup>
import { computed } from 'vue';
import BraSvg from './BraSvg.vue';
import PantiesSvg from './PantiesSvg.vue';
import NightgownSvg from './NightgownSvg.vue';
import { buildParts } from './contract.js';

// Rysunek wyrobu dla celu (goal). goal.visual wybiera rysunek, slot.visualParts — części, które slot koloruje.
const VISUALS = { bra: BraSvg, panties: PantiesSvg, nightgown: NightgownSvg };

const props = defineProps({
  goal: { type: Object, required: true },
  selection: { type: Object, required: true }, // już znormalizowany
  activeSlotId: { type: Number, default: null },
});
defineEmits(['select']);

const component = computed(() => VISUALS[props.goal.visual] ?? null);
const parts = computed(() => buildParts(props.goal, props.selection));
</script>

<template>
  <component :is="component" v-if="component" :parts="parts" :active-slot-id="activeSlotId" @select="$emit('select', $event)" />
</template>
