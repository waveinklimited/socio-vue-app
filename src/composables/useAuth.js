import { computed, reactive } from 'vue'
import { apiFetch } from './useApi'

const STORAGE_TOKEN = 'socio_user_token'
const STORAGE_NAME = 'socio_user_name'
const STORAGE_EMAIL = 'socio_user_email'

export const authState = reactive({
  token: localStorage.getItem(STORAGE_TOKEN) || '',
  name: localStorage.getItem(STORAGE_NAME) || '',
  email: localStorage.getItem(STORAGE_EMAIL) || '',
})

export const isAuthenticated = computed(() => Boolean(authState.token))
export const userLabel = computed(() => (authState.name ? `Signed in as ${authState.name}` : 'Signed in'))

const setSession = (data) => {
  authState.token = data.token || ''
  authState.name = data.user?.name || ''
  authState.email = data.user?.email || ''
  if (authState.token) {
    localStorage.setItem(STORAGE_TOKEN, authState.token)
    localStorage.setItem(STORAGE_NAME, authState.name)
    localStorage.setItem(STORAGE_EMAIL, authState.email)
  }
}

const clearSession = () => {
  authState.token = ''
  authState.name = ''
  authState.email = ''
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_NAME)
  localStorage.removeItem(STORAGE_EMAIL)
}

const login = async (payload) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setSession(data)
  return data
}

const register = async (payload) => {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setSession(data)
  return data
}

const logout = async () => {
  try {
    if (authState.token) {
      await apiFetch('/auth/logout', { method: 'POST' }, authState.token)
    }
  } finally {
    clearSession()
  }
}

export const useAuth = () => ({
  authState,
  isAuthenticated,
  userLabel,
  login,
  register,
  logout,
  clearSession,
})
