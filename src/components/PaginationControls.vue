<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  lastPage: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['prev', 'next'])

const btnBase =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
const btnGhost = `${btnBase} border border-[color:var(--border)] bg-white/60 text-[color:var(--ink)]`
</script>

<template>
  <div class="flex gap-2">
    <button
      :class="btnGhost"
      type="button"
      :disabled="props.page <= 1 || props.loading"
      @click="emit('prev')"
    >
      Prev
    </button>
    <button
      :class="btnGhost"
      type="button"
      :disabled="props.page >= props.lastPage || props.loading"
      @click="emit('next')"
    >
      Next
    </button>
  </div>
</template>
