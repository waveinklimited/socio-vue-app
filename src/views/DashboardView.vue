<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MyPostsList from '../components/MyPostsList.vue'
import PostEditor from '../components/PostEditor.vue'
import { useAuth } from '../composables/useAuth'
import { extractError } from '../composables/useApi'
import { usePosts } from '../composables/usePosts'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { userLabel, logout, clearSession } = useAuth()
const { myFeed, loadMyPosts, deleteMyPost } = usePosts()
const { showToast } = useToast()

const activePost = ref(null)
const editorAnchor = ref(null)

const refreshMyPosts = async (page = 1) => {
  try {
    await loadMyPosts(page)
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearSession()
      showToast('Session expired. Please sign in again.', 'error')
      router.push({ name: 'login', query: { redirect: '/dashboard' } })
      return
    }
    showToast(extractError(error), 'error')
  }
}

const handleDelete = async (post) => {
  if (!post) return
  const confirmed = window.confirm('Delete this post? This cannot be undone.')
  if (!confirmed) return
  try {
    await deleteMyPost(post.id)
    showToast('Post deleted.', 'success')
    await refreshMyPosts(myFeed.page)
  } catch (error) {
    showToast(extractError(error), 'error')
  }
}

const handleEdit = (post) => {
  activePost.value = post
  editorAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleReset = () => {
  activePost.value = null
}

const handleSaved = async () => {
  activePost.value = null
  await refreshMyPosts(myFeed.page)
}

const handleLogout = async () => {
  await logout()
  showToast('Signed out.', 'info')
  router.push({ name: 'login' })
}

onMounted(() => {
  refreshMyPosts(1)
})
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-4 rounded-[18px] border border-[color:var(--border)] bg-white/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Your space</p>
        <h1 class="text-3xl">Welcome back</h1>
        <p class="text-sm text-[color:var(--muted)]">{{ userLabel }}. Drafts are private until published.</p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
        type="button"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>

    <div ref="editorAnchor" class="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_24px_50px_rgba(27,26,23,0.15)]">
      <PostEditor :post="activePost" @saved="handleSaved" @reset="handleReset" />
    </div>

    <div class="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_24px_50px_rgba(27,26,23,0.15)]">
      <MyPostsList
        :posts="myFeed.posts"
        :loading="myFeed.loading"
        :page="myFeed.page"
        :last-page="myFeed.lastPage"
        @edit="handleEdit"
        @delete="handleDelete"
        @prev="refreshMyPosts(myFeed.page - 1)"
        @next="refreshMyPosts(myFeed.page + 1)"
      />
    </div>
  </div>
</template>
