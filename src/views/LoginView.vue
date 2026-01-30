<script setup>
import { useRoute, useRouter } from 'vue-router'
import AuthForm from '../components/AuthForm.vue'

const router = useRouter()
const route = useRoute()

const handleAuthenticated = () => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect)
}
</script>

<template>
  <div class="grid gap-6">
    <div class="space-y-3">
      <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Access</p>
      <h1 class="text-3xl">Sign in to your workspace</h1>
      <p class="text-sm text-[color:var(--muted)]">
        New here? Create a profile and start drafting your first post.
      </p>
    </div>
    <AuthForm @authenticated="handleAuthenticated" />
  </div>
</template>
