<script setup>
// Definicje SVG: tekstury ze zdjęć produktów oraz cieniowanie nadające objętość
defineProps({
  uid: { type: String, required: true },
  textures: { type: Array, default: () => [] }, // [{ id, imageUrl }]
});

// cztery kafle: oryginał i odbicia w poziomie / pionie
const TILES = ['', 'translate(260 0) scale(-1 1)', 'translate(0 260) scale(1 -1)', 'translate(260 260) scale(-1 -1)'];
</script>

<template>
  <defs>
    <!--
      Tekstura ze zdjęcia produktu: bierzemy środkową połowę zdjęcia (bez tła na brzegach)
      i układamy ją w lustrzane kafle 2×2, żeby łączenia nie były widoczne.
    -->
    <pattern v-for="t in textures" :id="`${uid}-tex-${t.id}`" :key="t.id" width="260" height="260" patternUnits="userSpaceOnUse">
      <rect width="260" height="260" fill="#d9cfc2" />
      <g v-for="(flip, i) in TILES" :key="i" :transform="flip">
        <svg width="130" height="130" viewBox="65 65 130 130">
          <image :href="t.imageUrl" width="260" height="260" preserveAspectRatio="xMidYMid slice" />
        </svg>
      </g>
    </pattern>
    <radialGradient :id="`${uid}-volume`" cx="0.55" cy="0.5" r="0.65">
      <stop offset="0" stop-color="#fff" stop-opacity="0.28" />
      <stop offset="0.55" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.22" />
    </radialGradient>
    <linearGradient :id="`${uid}-shade`" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.12" />
      <stop offset="1" stop-color="#000" stop-opacity="0.14" />
    </linearGradient>
    <linearGradient :id="`${uid}-folds`" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.16" />
      <stop offset="0.18" stop-color="#fff" stop-opacity="0.1" />
      <stop offset="0.36" stop-color="#000" stop-opacity="0.1" />
      <stop offset="0.5" stop-color="#fff" stop-opacity="0.14" />
      <stop offset="0.64" stop-color="#000" stop-opacity="0.1" />
      <stop offset="0.82" stop-color="#fff" stop-opacity="0.1" />
      <stop offset="1" stop-color="#000" stop-opacity="0.16" />
    </linearGradient>
  </defs>
</template>
