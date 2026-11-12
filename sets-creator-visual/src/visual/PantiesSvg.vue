<script setup>
import FabricDefs from './FabricDefs.vue';
import Mirror from './Mirror.vue';
import { useGarmentParts } from './useGarmentParts.js';

const LABELS = {
  front: 'Panel przedni',
  back: 'Panel tylny',
  gusset: 'Klin (krok)',
  waist: 'Gumka w pasie',
  legs: 'Wykończenie nogawek',
};

// Widok z przodu, majtki leżą płasko; tył wystaje przy nogawkach i nad linią pasa
const FRONT = 'M 95 72 Q 300 142 505 72 L 495 152 C 430 190, 370 290, 345 372 L 255 372 C 230 290, 170 190, 105 152 Z';
const BACK = 'M 95 72 L 505 72 L 497 160 C 488 260, 415 350, 352 388 Q 300 400 248 388 C 185 350, 112 260, 103 160 Z';
const GUSSET = 'M 230 309 Q 300 294 370 309 L 345 372 Q 300 384 255 372 Z';
const WAIST_FRONT = 'M 95 72 Q 300 142 505 72';
const WAIST_BACK = 'M 95 72 L 505 72';
// lewa nogawka (prawa = odbicie lustrzane)
const LEG_FRONT = 'M 105 152 C 170 190, 230 290, 255 372';
const LEG_BACK = 'M 103 160 C 112 260, 185 350, 248 388';

const props = defineProps({
  // { [partId]: { slot, product | null } } — tylko części powiązane ze slotami
  parts: { type: Object, required: true },
  activeSlotId: { type: Number, default: null },
});
const emit = defineEmits(['select']);

const { uid, textures, isOn, fill, outline, outlineW, dash, partProps, caption } = useGarmentParts(props, emit, LABELS);
</script>

<template>
  <figure class="sgv-figure">
    <svg viewBox="0 0 600 440" class="sgv-garment" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Majtki — kliknij część, aby dobrać materiał">
      <FabricDefs prefix="pan" :uid="uid" :textures="textures" />

        <!-- 1. TYŁ (widoczny od środka: nad pasem i przy nogawkach) -->
        <g v-bind="partProps('back')">
          <path :d="BACK" :fill="fill('back')" :stroke="outline('back')" :stroke-width="outlineW('back')" :stroke-dasharray="dash('back')" />
          <path :d="BACK" fill="rgba(0,0,0,0.14)" pointer-events="none" />
        </g>

        <!-- 2. PRZÓD -->
        <g v-bind="partProps('front')">
          <path :d="FRONT" :fill="fill('front')" :stroke="outline('front')" :stroke-width="outlineW('front', 1.6)" :stroke-dasharray="dash('front')" />
          <path :d="FRONT" :fill="`url(#${uid}-volume)`" pointer-events="none" />
          <!-- szwy boczne -->
          <Mirror>
            <path d="M 100 76 L 109 150" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.9" stroke-dasharray="3 3" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 3. KLIN -->
        <g v-bind="partProps('gusset')">
          <path :d="GUSSET" :fill="fill('gusset')" :stroke="outline('gusset')" :stroke-width="outlineW('gusset')" :stroke-dasharray="dash('gusset')" />
          <path d="M 236 314 Q 300 300 364 314" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.9" stroke-dasharray="3 3" pointer-events="none" />
        </g>

        <!-- 4. WYKOŃCZENIE NOGAWEK -->
        <g v-bind="partProps('legs')">
          <Mirror>
            <path :d="LEG_FRONT" fill="none" stroke="transparent" stroke-width="16" />
            <path :d="LEG_BACK" fill="none" :stroke="outline('legs')" :stroke-width="isOn('legs') ? 7.5 : 6" stroke-linecap="round" />
            <path :d="LEG_BACK" fill="none" :stroke="fill('legs')" stroke-width="4" stroke-linecap="round" />
            <path :d="LEG_FRONT" fill="none" :stroke="outline('legs')" :stroke-width="isOn('legs') ? 9.5 : 8" stroke-linecap="round" />
            <path :d="LEG_FRONT" fill="none" :stroke="fill('legs')" stroke-width="6" stroke-linecap="round" />
            <path :d="LEG_FRONT" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.8" stroke-dasharray="3 3" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 5. GUMKA W PASIE (z pikotką) -->
        <g v-bind="partProps('waist')">
          <path :d="WAIST_BACK" fill="none" :stroke="outline('waist')" :stroke-width="isOn('waist') ? 8 : 6.5" stroke-linecap="round" />
          <path :d="WAIST_BACK" fill="none" :stroke="fill('waist')" stroke-width="4.5" stroke-linecap="round" />
          <path :d="WAIST_FRONT" fill="none" :stroke="outline('waist')" :stroke-width="isOn('waist') ? 11 : 9.5" stroke-linecap="round" stroke-dasharray="0.1 9" transform="translate(0 -5)" />
          <path :d="WAIST_FRONT" fill="none" :stroke="fill('waist')" stroke-width="7.5" stroke-linecap="round" stroke-dasharray="0.1 9" transform="translate(0 -5)" />
          <path :d="WAIST_FRONT" fill="none" :stroke="outline('waist')" :stroke-width="isOn('waist') ? 13 : 11.5" stroke-linecap="round" />
          <path :d="WAIST_FRONT" fill="none" :stroke="fill('waist')" stroke-width="9.5" stroke-linecap="round" />
          <path :d="WAIST_FRONT" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.8" stroke-dasharray="3 3" pointer-events="none" />
          <!-- kokardka -->
          <g pointer-events="none" :stroke="outline('waist')" stroke-width="1" :fill="fill('waist')">
            <path d="M 300 108 L 282 98 L 284 118 Z M 300 108 L 318 98 L 316 118 Z" />
            <circle cx="300" cy="108" r="4" />
          </g>
        </g>
    </svg>
    <figcaption aria-hidden="true">{{ caption }}</figcaption>
  </figure>
</template>
