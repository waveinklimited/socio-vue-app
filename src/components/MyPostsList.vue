<script setup>
import PaginationControls from './PaginationControls.vue'
import SectionHeader from './SectionHeader.vue'

const props = defineProps({
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  page: { type: Number, required: true },
  lastPage: { type: Number, required: true },
})

const emit = defineEmits(['edit', 'delete', 'prev', 'next'])

const btnGhost =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-[color:var(--border)] bg-white/60 text-[color:var(--ink)]'
const btnDanger =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-[color:rgba(208,42,42,0.3)] bg-[color:rgba(208,42,42,0.15)] text-[#8f1c1c]'

const formatDate = (value) => {
  if (!value) return 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}
</script>

<template>
  <div class="grid gap-4">
    <SectionHeader
      eyebrow="Your posts"
      title="Drafts and scheduled posts"
      subtitle="Only you can edit or delete these posts."
    >
      <PaginationControls
        :page="props.page"
        :last-page="props.lastPage"
        :loading="props.loading"
        @prev="emit('prev')"
        @next="emit('next')"
      />
    </SectionHeader>

    <div v-if="props.loading" class="text-sm text-[color:var(--muted)]">Loading your posts...</div>
    <div v-else class="grid gap-4">
      <div
        v-for="post in props.posts"
        :key="post.id"
        class="flex flex-col gap-3 rounded-[16px] border border-[color:var(--border)] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="font-semibold">{{ post.title }}</p>
          <p class="text-sm text-[color:var(--muted)]">
            {{ post.is_published ? 'Published' : 'Draft' }} | {{ formatDate(post.published_at || post.created_at) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button :class="btnGhost" type="button" @click="emit('edit', post)">Edit</button>
          <button :class="btnDanger" type="button" @click="emit('delete', post)">Delete</button>
        </div>
      </div>
      <div
        v-if="!props.posts.length"
        class="rounded-[16px] border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-[color:var(--muted)]"
      >
        <p>No posts yet. Start your first draft.</p>
      </div>
    </div>
  </div>
</template>
