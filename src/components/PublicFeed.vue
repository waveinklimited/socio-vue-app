<script setup>
import PaginationControls from './PaginationControls.vue'
import PostCard from './PostCard.vue'
import SectionHeader from './SectionHeader.vue'

const props = defineProps({
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  page: { type: Number, required: true },
  lastPage: { type: Number, required: true },
})

const emit = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="grid gap-6">
    <SectionHeader
      eyebrow="Public feed"
      title="Latest published posts"
      subtitle="Stories shared across the community."
    >
      <PaginationControls
        :page="props.page"
        :last-page="props.lastPage"
        :loading="props.loading"
        @prev="emit('prev')"
        @next="emit('next')"
      />
    </SectionHeader>

    <div v-if="props.loading" class="text-sm text-[color:var(--muted)]">Loading posts...</div>
    <div v-else class="grid gap-5">
      <RouterLink
        v-for="post in props.posts"
        :key="post.id"
        class="block transition hover:-translate-y-0.5"
        :to="{ name: 'post', params: { slug: post.slug } }"
      >
        <PostCard :post="post" />
      </RouterLink>
      <div
        v-if="!props.posts.length"
        class="rounded-[16px] border border-dashed border-[color:var(--border)] bg-white/60 p-6 text-center text-sm text-[color:var(--muted)]"
      >
        <p>No published posts yet.</p>
      </div>
    </div>
  </div>
</template>
