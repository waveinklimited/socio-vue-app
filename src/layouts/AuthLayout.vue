<script setup>
import PageBackground from '../components/PageBackground.vue'
</script>

<template>
  <div class="app-shell" data-variant="auth">
    <PageBackground variant="auth" />
    <div
      class="relative z-10 mx-auto grid min-h-screen w-full max-w-[1200px] items-center gap-8 px-4 py-10 sm:px-6 lg:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      <aside
        class="hidden flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] lg:flex"
      >
        <div class="space-y-4">
          <p class="text-xs uppercase tracking-[0.3em] text-white/70">Socio platform</p>
          <h1 class="text-4xl leading-tight">Welcome back to the editorial lounge.</h1>
          <p class="text-sm text-white/70">
            Sign in to manage your drafts, schedule stories, and keep the public feed fresh.
          </p>
        </div>
        <div class="rounded-[22px] border border-white/15 bg-white/10 p-5">
          <p class="text-sm text-white/70">Quick start</p>
          <ul class="mt-3 space-y-3 text-sm">
            <li class="flex items-center gap-3">
              <span class="h-2 w-2 rounded-full bg-[#f1b934]"></span>
              Draft and schedule posts in seconds.
            </li>
            <li class="flex items-center gap-3">
              <span class="h-2 w-2 rounded-full bg-[#1d7f7a]"></span>
              Your content stays private until published.
            </li>
            <li class="flex items-center gap-3">
              <span class="h-2 w-2 rounded-full bg-[#e4572e]"></span>
              Curate the story flow for the community.
            </li>
          </ul>
        </div>
      </aside>

      <div class="rounded-[28px] border border-white/30 bg-white/90 p-8 shadow-[0_24px_50px_rgba(0,0,0,0.2)]">
        <slot />
      </div>
    </div>
  </div>
</template>
