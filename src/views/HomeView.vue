<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import PublicFeed from '../components/PublicFeed.vue'
import { useAuth } from '../composables/useAuth'
import { extractError } from '../composables/useApi'
import { usePosts } from '../composables/usePosts'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { isAuthenticated, userLabel, logout, clearSession } = useAuth()
const { publicFeed, myFeed, loadPublicPosts, loadMyPosts } = usePosts()
const { showToast } = useToast()

const refreshFeed = async () => {
  if (!isAuthenticated.value) {
    router.replace({ name: 'login', query: { redirect: '/' } })
    return
  }
  try {
    await loadPublicPosts(1)
  } catch (error) {
    showToast(extractError(error), 'error')
  }
}

const loadPage = async (page) => {
  if (!isAuthenticated.value) {
    router.replace({ name: 'login', query: { redirect: '/' } })
    return
  }
  try {
    await loadPublicPosts(page)
  } catch (error) {
    showToast(extractError(error), 'error')
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const handleLogout = async () => {
  await logout()
  showToast('Signed out.', 'info')
  router.replace({ name: 'login' })
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.replace({ name: 'login', query: { redirect: '/' } })
    return
  }
  try {
    await loadPublicPosts(1)
    if (isAuthenticated.value) {
      await loadMyPosts(1)
    }
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearSession()
      router.replace({ name: 'login', query: { redirect: '/' } })
      return
    }
    showToast(extractError(error), 'error')
  }
})
</script>

<template>
  <div v-if="isAuthenticated">
    <div class="mb-10 flex flex-col gap-4 rounded-[18px] border border-[color:var(--border)] bg-white/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Your space</p>
        <h1 class="text-3xl">Welcome back</h1>
        <p class="text-sm text-[color:var(--muted)]">{{ userLabel }}. Browse what the community is sharing.</p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
        type="button"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>

    <HeroSection
      :public-count="publicFeed.posts.length"
      :my-count="myFeed.posts.length"
      :is-authenticated="isAuthenticated"
      :user-label="userLabel"
      @refresh="refreshFeed"
      @write="goToDashboard"
    />

    <section class="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_24px_50px_rgba(27,26,23,0.15)]">
      <PublicFeed
        :posts="publicFeed.posts"
        :loading="publicFeed.loading"
        :page="publicFeed.page"
        :last-page="publicFeed.lastPage"
        @prev="loadPage(publicFeed.page - 1)"
        @next="loadPage(publicFeed.page + 1)"
      />
    </section>
  </div>
</template>
