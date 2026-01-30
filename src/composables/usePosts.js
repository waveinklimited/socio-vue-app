import { reactive } from 'vue'
import { apiFetch } from './useApi'
import { authState } from './useAuth'

const publicFeed = reactive({
  posts: [],
  page: 1,
  lastPage: 1,
  loading: false,
})

const myFeed = reactive({
  posts: [],
  page: 1,
  lastPage: 1,
  loading: false,
})

const loadPublicPosts = async (page = 1) => {
  publicFeed.loading = true
  try {
    const data = await apiFetch(`/posts?page=${page}`)
    publicFeed.posts = Array.isArray(data.data) ? data.data : []
    publicFeed.page = data.current_page || page
    publicFeed.lastPage = data.last_page || page
  } finally {
    publicFeed.loading = false
  }
}

const loadMyPosts = async (page = 1) => {
  myFeed.loading = true
  try {
    const data = await apiFetch(`/me/posts?page=${page}`, {}, authState.token)
    myFeed.posts = Array.isArray(data.data) ? data.data : []
    myFeed.page = data.current_page || page
    myFeed.lastPage = data.last_page || page
  } finally {
    myFeed.loading = false
  }
}

const createMyPost = async (formData) =>
  apiFetch('/me/posts', { method: 'POST', body: formData }, authState.token)

const updateMyPost = async (postId, formData) =>
  apiFetch(`/me/posts/${postId}`, { method: 'PATCH', body: formData }, authState.token)

const deleteMyPost = async (postId) =>
  apiFetch(`/me/posts/${postId}`, { method: 'DELETE' }, authState.token)

export const usePosts = () => ({
  publicFeed,
  myFeed,
  loadPublicPosts,
  loadMyPosts,
  createMyPost,
  updateMyPost,
  deleteMyPost,
})
