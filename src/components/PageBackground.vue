<script setup>
const props = defineProps({
  variant: { type: String, default: 'home' },
})
</script>

<template>
  <div class="bg-scene" :data-variant="props.variant" aria-hidden="true">
    <div class="bg-grid"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    <div class="bg-sheen"></div>
  </div>
</template>
