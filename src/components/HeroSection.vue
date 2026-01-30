<script setup>
const props = defineProps({
  publicCount: { type: Number, default: 0 },
  myCount: { type: Number, default: 0 },
  isAuthenticated: { type: Boolean, default: false },
  userLabel: { type: String, default: '' },
})

const emit = defineEmits(['refresh', 'write'])

const btnBase =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
const btnGhost = `${btnBase} border border-[color:var(--border)] bg-white/60 text-[color:var(--ink)]`
const btnPrimary = `${btnBase} border border-transparent bg-[linear-gradient(120deg,var(--accent),var(--accent-strong))] text-white shadow-[0_12px_20px_rgba(228,87,46,0.25)]`
</script>

<template>
  <header class="mb-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
    <div class="space-y-4">
      <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Community journal</p>
      <h1 class="text-4xl sm:text-5xl">Socio Stories</h1>
      <p class="max-w-xl text-lg leading-relaxed text-[color:var(--muted)]">
        A shared newsroom for the Socio community. Read the latest public posts, and manage your own
        drafts when you sign in.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <button :class="btnGhost" type="button" @click="emit('refresh')">Refresh feed</button>
        <button v-if="props.isAuthenticated" :class="btnPrimary" type="button" @click="emit('write')">
          Write a post
        </button>
      </div>
    </div>

    <div class="grid gap-5 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_24px_50px_rgba(27,26,23,0.15)]">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div
        class="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-1.5 text-xs"
          :class="
            props.isAuthenticated
              ? 'border-[color:rgba(29,127,122,0.3)] bg-[color:rgba(29,127,122,0.15)] text-[#0f4b47]'
              : ''
          "
        >
          {{ props.isAuthenticated ? props.userLabel : 'Signed out' }}
        </div>
        <div class="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <span class="h-2 w-2 rounded-full bg-[color:var(--accent-2)]"></span>
          Live community pulse
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-[16px] border border-white/60 bg-white/70 p-4 shadow-[0_12px_24px_rgba(27,26,23,0.08)]">
          <p class="text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--muted)]">Published</p>
          <p class="mt-2 text-3xl font-bold">{{ props.publicCount }}</p>
          <p class="text-sm text-[color:var(--muted)]">Stories across the lounge</p>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80">
            <div
              class="h-full w-[70%] rounded-full bg-[linear-gradient(120deg,var(--accent),var(--accent-3))]"
            ></div>
          </div>
        </div>
        <div class="rounded-[16px] border border-white/60 bg-white/70 p-4 shadow-[0_12px_24px_rgba(27,26,23,0.08)]">
          <p class="text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--muted)]">Your drafts</p>
          <p class="mt-2 text-3xl font-bold">{{ props.myCount }}</p>
          <p class="text-sm text-[color:var(--muted)]">Pieces ready to shape</p>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80">
            <div
              class="h-full w-[45%] rounded-full bg-[linear-gradient(120deg,var(--accent-2),#3aa49f)]"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="grid gap-2 rounded-[14px] border border-dashed border-[color:rgba(241,185,52,0.6)] bg-[color:rgba(241,185,52,0.2)] p-4 text-sm"
      >
        <span class="text-[0.65rem] uppercase tracking-[0.2em] text-[#8a6407]">Tip</span>
        <p>Schedule a publish date to push a post live automatically.</p>
      </div>
    </div>
  </header>
</template>
