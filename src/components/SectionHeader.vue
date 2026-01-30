<script setup>
const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const eyebrowClass = 'text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]'
const mutedClass = 'text-[color:var(--muted)]'
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p v-if="props.eyebrow" :class="eyebrowClass">{{ props.eyebrow }}</p>
      <h2 class="text-2xl">{{ props.title }}</h2>
      <p v-if="props.subtitle" class="text-sm" :class="mutedClass">{{ props.subtitle }}</p>
    </div>
    <div class="flex gap-2">
      <slot />
    </div>
  </div>
</template>
