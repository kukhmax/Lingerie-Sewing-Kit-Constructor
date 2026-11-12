<script setup>
// Rysuje zawartość dwa razy: oryginał + lustrzane odbicie względem pionowej osi x = axis
defineProps({ axis: { type: Number, default: 300 } });
</script>

<template>
  <slot />
  <g :transform="`translate(${axis * 2} 0) scale(-1 1)`"><slot /></g>
</template>
