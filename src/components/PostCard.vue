<script setup>
const props = defineProps({
  post: { type: Object, required: true },
})

const formatDate = (value) => {
  if (!value) return 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const shortBody = (post) => {
  const content = post.excerpt || post.body || ''
  if (!content) return 'No summary yet.'
  if (content.length <= 160) return content
  return `${content.slice(0, 160)}...`
}
</script>

<template>
  <article
    class="grid gap-4 rounded-[18px] border border-[color:var(--border)] bg-white/70 p-4 sm:grid-cols-[110px_1fr]"
  >
    <div
      class="grid min-h-[100px] place-items-center rounded-[14px] bg-[linear-gradient(140deg,rgba(228,87,46,0.2),rgba(29,127,122,0.2))] text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--muted)]"
      :class="props.post.image_url ? 'bg-cover bg-center text-transparent' : ''"
      :style="props.post.image_url ? { backgroundImage: `url(${props.post.image_url})` } : null"
    >
      <span v-if="!props.post.image_url">No image</span>
    </div>
    <div class="space-y-2">
      <div class="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
        <span>{{ props.post.author?.name || 'Guest' }}</span>
        <span class="opacity-60">|</span>
        <span>{{ formatDate(props.post.published_at) }}</span>
      </div>
      <h3 class="text-xl">{{ props.post.title }}</h3>
      <p class="text-sm text-[color:var(--muted)]">{{ shortBody(props.post) }}</p>
    </div>
  </article>
</template>
