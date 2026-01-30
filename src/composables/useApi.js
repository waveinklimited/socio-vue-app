const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const extractError = (error) => {
  if (error?.data?.errors) {
    const messages = Object.values(error.data.errors).flat()
    if (messages.length) return messages[0]
  }
  return error?.data?.message || error?.message || 'Request failed.'
}

export const apiFetch = async (path, options = {}, token = '') => {
  const config = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.body && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, config)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
