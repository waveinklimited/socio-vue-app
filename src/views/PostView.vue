<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authState } from '../composables/useAuth'
import { apiFetch, extractError } from '../composables/useApi'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const post = ref(null)
const loading = ref(false)
const notFound = ref(false)
const errorMessage = ref('')

const slug = computed(() => String(route.params.slug || ''))

const formatDate = (value) => {
  if (!value) return 'Not published'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const wordCount = computed(() => {
  const body = post.value?.body || ''
  const trimmed = body.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
})

const readingTime = computed(() => {
  if (!wordCount.value) return '—'
  const minutes = Math.max(1, Math.round(wordCount.value / 220))
  return `${minutes} min read`
})

const heroFallback = computed(() =>
  post.value?.image_url
    ? null
    : 'linear-gradient(140deg, rgba(228,87,46,0.35), rgba(29,127,122,0.35), rgba(241,185,52,0.4))'
)

const loadPost = async () => {
  if (!slug.value) return
  loading.value = true
  notFound.value = false
  errorMessage.value = ''
  post.value = null
  try {
    post.value = await apiFetch(`/posts/${slug.value}`, {}, authState.token)
  } catch (error) {
    if (error.status === 404) {
      notFound.value = true
      return
    }
    errorMessage.value = extractError(error)
    showToast(errorMessage.value, 'error')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push({ name: 'home' })
}

onMounted(loadPost)
watch(slug, loadPost)
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Socio journal</p>
        <h1 class="mt-2 text-4xl sm:text-5xl">Post spotlight</h1>
        <p class="mt-3 max-w-xl text-base text-[color:var(--muted)]">
          A single story with the full narrative, visuals, and publishing details.
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/70 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
        type="button"
        @click="goBack"
      >
        Back to feed
      </button>
    </div>

    <div v-if="loading" class="rounded-[26px] border border-[color:var(--border)] bg-white/70 p-8">
      <p class="text-sm text-[color:var(--muted)]">Loading post...</p>
    </div>

    <div v-else-if="notFound" class="rounded-[26px] border border-dashed border-[color:var(--border)] bg-white/70 p-10 text-center">
      <h2 class="text-2xl">Post not found</h2>
      <p class="mt-2 text-sm text-[color:var(--muted)]">Try heading back to the feed to pick another story.</p>
      <button
        class="mt-6 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
        type="button"
        @click="goBack"
      >
        Return home
      </button>
    </div>

    <div v-else-if="post" class="space-y-10">
      <section
        class="relative overflow-hidden rounded-[28px] border border-white/40 bg-white/80 shadow-[0_28px_60px_rgba(27,26,23,0.18)]"
      >
        <div
          class="absolute inset-0 opacity-60"
          :style="heroFallback ? { backgroundImage: heroFallback } : null"
        ></div>
        <div class="relative grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-10">
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
              <span>Story</span>
              <span class="h-1 w-1 rounded-full bg-[color:var(--accent)]"></span>
              <span>{{ post.author?.name || 'Guest author' }}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl">{{ post.title }}</h2>
            <p v-if="post.excerpt" class="max-w-xl text-base leading-relaxed text-[color:var(--muted)]">
              {{ post.excerpt }}
            </p>
            <div class="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              <span class="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                {{ formatDate(post.published_at || post.created_at) }}
              </span>
              <span class="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                {{ readingTime }}
              </span>
              <span
                class="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1"
                :class="post.is_published ? 'text-[#0f4b47]' : 'text-[#8a6407]'"
              >
                {{ post.is_published ? 'Published' : 'Draft' }}
              </span>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/60">
            <img
              v-if="post.image_url"
              :src="post.image_url"
              :alt="post.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="grid h-full min-h-[220px] place-items-center bg-[linear-gradient(140deg,rgba(228,87,46,0.25),rgba(29,127,122,0.25))] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]"
            >
              No image
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article class="space-y-6 rounded-[24px] border border-[color:var(--border)] bg-white/80 p-6 shadow-[0_20px_40px_rgba(27,26,23,0.12)]">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Full story</p>
            <h3 class="text-2xl">Inside the post</h3>
          </div>
          <p
            class="whitespace-pre-line text-base leading-relaxed text-[color:var(--ink)]"
          >
            {{ post.body || 'No body content yet.' }}
          </p>
        </article>

        <aside class="space-y-4">
          <div class="rounded-[20px] border border-[color:var(--border)] bg-white/80 p-5">
            <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Story details</p>
            <div class="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <div class="flex items-center justify-between gap-2">
                <span>Author</span>
                <span class="text-[color:var(--ink)]">{{ post.author?.name || 'Guest' }}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span>Published</span>
                <span class="text-[color:var(--ink)]">{{ formatDate(post.published_at) }}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span>Word count</span>
                <span class="text-[color:var(--ink)]">{{ wordCount || '—' }}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span>Read time</span>
                <span class="text-[color:var(--ink)]">{{ readingTime }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-[20px] border border-dashed border-[color:rgba(241,185,52,0.6)] bg-[color:rgba(241,185,52,0.18)] p-5 text-sm">
            <p class="text-xs uppercase tracking-[0.3em] text-[#8a6407]">Explore more</p>
            <p class="mt-3 text-[color:var(--muted)]">
              Return to the feed to see other published stories from the community.
            </p>
            <button
              class="mt-4 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
              type="button"
              @click="router.push({ name: 'home' })"
            >
              Browse the feed
            </button>
          </div>
        </aside>
      </section>
    </div>

    <div v-else class="rounded-[26px] border border-[color:var(--border)] bg-white/70 p-8">
      <p class="text-sm text-[color:var(--muted)]">{{ errorMessage || 'Post unavailable.' }}</p>
    </div>
  </div>
</template>
