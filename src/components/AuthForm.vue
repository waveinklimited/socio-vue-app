<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { extractError } from '../composables/useApi'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['authenticated'])

const { login, register } = useAuth()
const { showToast } = useToast()

const mode = ref('login')
const submitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const btnPrimary =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-transparent bg-[linear-gradient(120deg,var(--accent),var(--accent-strong))] text-white shadow-[0_12px_20px_rgba(228,87,46,0.25)]'
const btnGhost =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-[color:var(--border)] bg-white/60 text-[color:var(--ink)]'
const modeBase = 'rounded-full px-4 py-2 text-sm font-semibold transition'
const inputBase =
  'w-full rounded-xl border border-[color:var(--border)] bg-white/85 px-4 py-3 text-sm text-[color:var(--ink)] transition focus:border-[color:rgba(228,87,46,0.6)] focus:outline-none focus:ring-4 focus:ring-[color:rgba(228,87,46,0.15)]'

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.passwordConfirmation = ''
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (mode.value === 'login') {
      await login({
        email: form.email.trim(),
        password: form.password,
      })
      showToast('Welcome back.', 'success')
    } else {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      })
      showToast('Account created.', 'success')
    }
    resetForm()
    emit('authenticated')
  } catch (error) {
    showToast(extractError(error), 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Account</p>
      <h2 class="text-2xl">Welcome to Socio</h2>
      <p class="text-sm text-[color:var(--muted)]">Login or create a new account to start writing.</p>
    </div>

    <div class="grid grid-cols-2 gap-2 rounded-full bg-white/70 p-2">
      <button
        :class="[modeBase, mode === 'login' ? 'bg-white shadow-[0_6px_16px_rgba(27,26,23,0.1)]' : 'text-[color:var(--muted)]']"
        type="button"
        @click="mode = 'login'"
      >
        Login
      </button>
      <button
        :class="[modeBase, mode === 'register' ? 'bg-white shadow-[0_6px_16px_rgba(27,26,23,0.1)]' : 'text-[color:var(--muted)]']"
        type="button"
        @click="mode = 'register'"
      >
        Create account
      </button>
    </div>

    <form class="grid gap-4" @submit.prevent="handleSubmit">
      <div v-if="mode === 'register'" class="grid gap-2">
        <label for="name" class="text-sm font-semibold">Name</label>
        <input id="name" v-model="form.name" type="text" placeholder="Your name" :class="inputBase" required />
      </div>
      <div class="grid gap-2">
        <label for="email" class="text-sm font-semibold">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="you@socio.test" :class="inputBase" required />
      </div>
      <div class="grid gap-2">
        <label for="password" class="text-sm font-semibold">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Minimum 8 characters"
          :class="inputBase"
          required
        />
      </div>
      <div v-if="mode === 'register'" class="grid gap-2">
        <label for="confirm" class="text-sm font-semibold">Confirm password</label>
        <input
          id="confirm"
          v-model="form.passwordConfirmation"
          type="password"
          placeholder="Repeat password"
          :class="inputBase"
          required
        />
      </div>
      <button :class="btnPrimary" type="submit" :disabled="submitting">
        {{ submitting ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account' }}
      </button>
      <button v-if="mode === 'login'" :class="btnGhost" type="button" @click="mode = 'register'">
        Need an account?
      </button>
    </form>
  </div>
</template>
