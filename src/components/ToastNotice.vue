<script setup>
import { useToast } from '../composables/useToast'

const { toastState } = useToast()
</script>

<template>
  <div
    class="fixed bottom-8 right-8 z-50 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(27,26,23,0.3)] transition"
    :class="[
      toastState.visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2',
      toastState.type === 'success'
        ? 'bg-[#136f63]'
        : toastState.type === 'error'
          ? 'bg-[#8f1c1c]'
          : 'bg-[#1b1a17]',
    ]"
  >
    {{ toastState.message }}
  </div>
</template>
