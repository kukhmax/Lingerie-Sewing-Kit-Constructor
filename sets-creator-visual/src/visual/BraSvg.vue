<script setup>
import { computed } from 'vue';
import FabricDefs from './FabricDefs.vue';
import Mirror from './Mirror.vue';
import { METAL, useGarmentParts } from './useGarmentParts.js';

const LABELS = {
  cups: 'Miseczki',
  gore: 'Mostek',
  wings: 'Obwód biustonosza',
  straps: 'Ramiączka',
  elastics: 'Gumki wykończeniowe',
  underwires: 'Tunele na fiszbiny',
  hardware: 'Regulatory i kółka',
  closure: 'Zapięcie tyłu',
};

// Geometria lewej połowy (prawa jest lustrzanym odbiciem względem x = 300)
const CUP = 'M 120 222 L 166 205 C 185 250, 235 285, 286 300 C 288 350, 262 418, 195 428 C 130 432, 92 370, 86 300 C 95 270, 108 245, 120 222 Z';
const CUP_SEAM = 'M 88 322 C 150 296, 230 302, 286 320';
const CUP_DART = 'M 190 306 C 194 350, 196 390, 195 428';
const WIRE = 'M 286 302 C 288 350, 262 418, 195 428 C 130 432, 92 370, 86 302';
const STRAP = 'M 95 8 L 133 8 L 166 205 L 120 222 Z';
const SIDE_WING = 'M 104 258 C 72 266, 46 284, 34 310 L 30 396 C 62 418, 112 434, 195 436 L 195 300 Z';
const NECKLINE = 'M 166 205 C 185 250, 235 285, 286 300';
const ARMHOLE = 'M 120 222 C 108 245, 95 270, 86 300 M 104 258 C 72 266, 46 284, 34 310';
const BOTTOM_EDGE = 'M 30 397 C 62 419, 112 435, 195 437 C 240 438, 275 428, 300 422';

const props = defineProps({
  // { [partId]: { slot, product | null } } — tylko części powiązane ze slotami
  parts: { type: Object, required: true },
  activeSlotId: { type: Number, default: null },
});
const emit = defineEmits(['select']);

const { uid, textures, isOn, fill, outline, outlineW, dash, partProps, caption } = useGarmentParts(props, emit, LABELS);
const metal = computed(() => fill('hardware', METAL));
</script>

<template>
  <figure class="sgv-figure">
    <svg viewBox="0 0 600 520" class="sgv-garment" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Biustonosz — kliknij część, aby dobrać materiał">
      <FabricDefs prefix="bra" :uid="uid" :textures="textures" />

        <!-- 1. OBWÓD: tylna taśma (widoczna od środka) + boczne skrzydełka -->
        <g v-bind="partProps('wings')">
          <path
            d="M 185 428 C 235 478, 365 478, 415 428 L 415 452 C 365 504, 235 504, 185 452 Z"
            :fill="fill('wings')" :stroke="outline('wings')" :stroke-width="outlineW('wings')" :stroke-dasharray="dash('wings')"
          />
          <path d="M 185 428 C 235 478, 365 478, 415 428 L 415 452 C 365 504, 235 504, 185 452 Z" fill="rgba(0,0,0,0.16)" pointer-events="none" />
          <Mirror>
            <path :d="SIDE_WING" :fill="fill('wings')" :stroke="outline('wings')" :stroke-width="outlineW('wings')" :stroke-dasharray="dash('wings')" />
            <path :d="SIDE_WING" :fill="`url(#${uid}-shade)`" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 2. ZAPIĘCIE: haftki na środku tylnej taśmy -->
        <g v-bind="partProps('closure')">
          <rect x="278" y="462" width="44" height="30" rx="3"
            :fill="fill('closure')" :stroke="outline('closure')" :stroke-width="outlineW('closure')" :stroke-dasharray="dash('closure')" />
          <path d="M 300 464 L 300 490" stroke="rgba(0,0,0,0.25)" stroke-width="1" pointer-events="none" />
          <g v-for="y in [470, 484]" :key="y" pointer-events="none">
              <circle cx="289" :cy="y" r="2.2" fill="none" stroke="#6b7280" stroke-width="1.2" />
              <path :d="`M 307 ${y} h 7`" stroke="#6b7280" stroke-width="1.6" stroke-linecap="round" />
            </g>
        </g>

        <!-- 3. RAMIĄCZKA -->
        <g v-bind="partProps('straps')">
          <Mirror>
            <path :d="STRAP" :fill="fill('straps')" :stroke="outline('straps')" :stroke-width="outlineW('straps')" :stroke-dasharray="dash('straps')" stroke-linejoin="round" />
            <path :d="STRAP" :fill="`url(#${uid}-shade)`" pointer-events="none" />
            <!-- przeszycia wzdłuż krawędzi -->
            <path d="M 101 10 L 126 216 M 127 10 L 160 204" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" stroke-dasharray="3 3" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 4. MOSTEK -->
        <g v-bind="partProps('gore')">
          <path d="M 284 298 L 316 298 L 352 424 L 248 424 Z"
            :fill="fill('gore')" :stroke="outline('gore')" :stroke-width="outlineW('gore')" :stroke-dasharray="dash('gore')" stroke-linejoin="round" />
        </g>

        <!-- 5. MISECZKI (z cięciem poziomym i zaszewką, jak w szytym biustonoszu) -->
        <g v-bind="partProps('cups')">
          <Mirror>
            <path :d="CUP" :fill="fill('cups')" :stroke="outline('cups')" :stroke-width="outlineW('cups', 1.6)" :stroke-dasharray="dash('cups')" stroke-linejoin="round" />
            <path :d="CUP" :fill="`url(#${uid}-volume)`" pointer-events="none" />
            <path :d="CUP_SEAM" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.2" pointer-events="none" />
            <path :d="CUP_SEAM" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1" stroke-dasharray="4 3" transform="translate(0 4)" pointer-events="none" />
            <path :d="CUP_DART" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="1" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 6. FISZBINY I TUNELE: łuk pod miseczką -->
        <g v-bind="partProps('underwires')">
          <Mirror>
            <path :d="WIRE" fill="none" stroke="transparent" stroke-width="20" />
            <path :d="WIRE" fill="none" :stroke="outline('underwires')" :stroke-width="isOn('underwires') ? 13 : 10.5" stroke-linecap="round" />
            <path :d="WIRE" fill="none" :stroke="fill('underwires')" stroke-width="8" stroke-linecap="round" />
            <path :d="WIRE" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.8" stroke-dasharray="3 3" pointer-events="none" />
          </Mirror>
        </g>

        <!-- 7. GUMKI: koronkowy brzeg dekoltu, pacha, dolny pas -->
        <g v-bind="partProps('elastics')">
          <Mirror>
            <path :d="`${NECKLINE} ${ARMHOLE} ${BOTTOM_EDGE}`" fill="none" stroke="transparent" stroke-width="18" />
            <path :d="BOTTOM_EDGE" fill="none" :stroke="outline('elastics')" :stroke-width="isOn('elastics') ? 10 : 8" stroke-linecap="round" />
            <path :d="BOTTOM_EDGE" fill="none" :stroke="fill('elastics')" stroke-width="6" stroke-linecap="round" />
            <path :d="ARMHOLE" fill="none" :stroke="outline('elastics')" :stroke-width="isOn('elastics') ? 7 : 5.5" stroke-linecap="round" />
            <path :d="ARMHOLE" fill="none" :stroke="fill('elastics')" stroke-width="3.5" stroke-linecap="round" />
            <!-- pikotka: rząd ząbków wzdłuż dekoltu -->
            <path :d="NECKLINE" fill="none" :stroke="outline('elastics')" :stroke-width="isOn('elastics') ? 11 : 9.5" stroke-linecap="round" stroke-dasharray="0.1 9" transform="translate(4 -4)" />
            <path :d="NECKLINE" fill="none" :stroke="fill('elastics')" stroke-width="7.5" stroke-linecap="round" stroke-dasharray="0.1 9" transform="translate(4 -4)" />
            <path :d="NECKLINE" fill="none" :stroke="outline('elastics')" stroke-width="5.5" stroke-linecap="round" />
            <path :d="NECKLINE" fill="none" :stroke="fill('elastics')" stroke-width="3.5" stroke-linecap="round" />
          </Mirror>
        </g>

        <!-- 8. REGULATORY I KÓŁKA -->
        <g v-bind="partProps('hardware')">
          <Mirror>
            <!-- powiększony obszar klikalny -->
            <rect x="88" y="52" width="72" height="46" fill="transparent" stroke="none" />
            <circle cx="143" cy="210" r="16" fill="transparent" stroke="none" />
            <!-- regulator -->
            <g transform="rotate(-9 124 75)">
              <rect x="98" y="66" width="52" height="18" rx="5" fill="none"
                :stroke="outline('hardware')" :stroke-width="isOn('hardware') ? 8 : 6.5" />
              <rect x="98" y="66" width="52" height="18" rx="5" fill="none"
                :stroke="metal" stroke-width="4" />
              <path d="M 100 75 H 148" :stroke="metal" stroke-width="3" />
            </g>
            <!-- kółko łączące ramiączko z miseczką -->
            <ellipse cx="143" cy="211" rx="21" ry="6.5" fill="none" transform="rotate(-20 143 211)"
              :stroke="outline('hardware')" :stroke-width="isOn('hardware') ? 7 : 5.5" />
            <ellipse cx="143" cy="211" rx="21" ry="6.5" fill="none" transform="rotate(-20 143 211)"
              :stroke="metal" stroke-width="3.2" />
          </Mirror>
        </g>
    </svg>
    <figcaption aria-hidden="true">{{ caption }}</figcaption>
  </figure>
</template>
