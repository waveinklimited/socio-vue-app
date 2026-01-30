<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageBackground from '../components/PageBackground.vue'

const route = useRoute()

const variant = computed(() => (route.name === 'dashboard' ? 'dashboard' : 'home'))
const isDashboard = computed(() => variant.value === 'dashboard')
const shellGrid = computed(() =>
  isDashboard.value
    ? 'relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-start justify-center px-4 py-10 sm:px-6 lg:px-10'
    : 'relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-start justify-center px-4 py-10 sm:px-6 lg:px-10'
)
const contentCard = computed(() =>
  isDashboard.value
    ? 'w-full rounded-[28px] border border-white/30 bg-white/90 p-8 shadow-[0_24px_50px_rgba(0,0,0,0.2)]'
    : 'w-full rounded-[28px] border border-white/30 bg-white/90 p-8 shadow-[0_24px_50px_rgba(0,0,0,0.2)]'
)
</script>

<template>
  <div class="app-shell" :data-variant="variant">
    <PageBackground :variant="variant" />
    <div :class="shellGrid">
      <div :class="contentCard">
        <slot />
      </div>
    </div>
  </div>
</template>
