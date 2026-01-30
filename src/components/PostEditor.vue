<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { extractError } from '../composables/useApi'
import { usePosts } from '../composables/usePosts'
import { useToast } from '../composables/useToast'

const props = defineProps({
  post: { type: Object, default: null },
})

const emit = defineEmits(['saved', 'reset'])

const { createMyPost, updateMyPost } = usePosts()
const { showToast } = useToast()

const editor = reactive({
  id: null,
  title: '',
  excerpt: '',
  body: '',
  publishMode: 'draft',
  publishedAt: '',
  imageFile: null,
  imagePreview: '',
  imageLabel: 'No image selected.',
  saving: false,
})

const imageInputRef = ref(null)
let imageObjectUrl = null

const inputBase =
  'w-full rounded-xl border border-[color:var(--border)] bg-white/85 px-4 py-3 text-sm text-[color:var(--ink)] transition focus:border-[color:rgba(228,87,46,0.6)] focus:outline-none focus:ring-4 focus:ring-[color:rgba(228,87,46,0.15)]'
const btnPrimary =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-transparent bg-[linear-gradient(120deg,var(--accent),var(--accent-strong))] text-white shadow-[0_12px_20px_rgba(228,87,46,0.25)]'
const btnGhost =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 border border-[color:var(--border)] bg-white/60 text-[color:var(--ink)]'

const toDatetimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const clearPreview = () => {
  if (imageObjectUrl) {
    URL.revokeObjectURL(imageObjectUrl)
    imageObjectUrl = null
  }
}

const resetEditor = () => {
  editor.id = null
  editor.title = ''
  editor.excerpt = ''
  editor.body = ''
  editor.publishMode = 'draft'
  editor.publishedAt = ''
  editor.imageFile = null
  editor.imagePreview = ''
  editor.imageLabel = 'No image selected.'
  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
  clearPreview()
  emit('reset')
}

const setPublishMode = (mode) => {
  editor.publishMode = mode
  if (mode === 'draft') {
    editor.publishedAt = ''
  }
}

const buildFormData = () => {
  const data = new FormData()
  data.append('title', editor.title.trim())
  data.append('excerpt', editor.excerpt.trim())
  data.append('body', editor.body.trim())
  if (editor.publishMode === 'draft') {
    data.append('published_at', '')
  } else if (editor.publishedAt) {
    data.append('published_at', editor.publishedAt)
  }
  if (editor.imageFile) {
    data.append('image', editor.imageFile)
  }
  return data
}

const handleSave = async () => {
  editor.saving = true
  try {
    const formData = buildFormData()
    if (editor.id) {
      await updateMyPost(editor.id, formData)
      showToast('Post updated.', 'success')
    } else {
      await createMyPost(formData)
      showToast('Post created.', 'success')
    }
    resetEditor()
    emit('saved')
  } catch (error) {
    showToast(extractError(error), 'error')
  } finally {
    editor.saving = false
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) {
    editor.imageFile = null
    editor.imagePreview = ''
    editor.imageLabel = 'No image selected.'
    clearPreview()
    return
  }

  editor.imageFile = file
  clearPreview()
  imageObjectUrl = URL.createObjectURL(file)
  editor.imagePreview = imageObjectUrl
  editor.imageLabel = 'New upload preview'
}

watch(
  () => props.post,
  (post) => {
    if (!post) {
      resetEditor()
      return
    }
    editor.id = post.id
    editor.title = post.title || ''
    editor.excerpt = post.excerpt || ''
    editor.body = post.body || ''
    editor.publishMode = post.published_at ? 'publish' : 'draft'
    editor.publishedAt = post.published_at ? toDatetimeLocal(post.published_at) : ''
    editor.imagePreview = post.image_url || ''
    editor.imageLabel = post.image_url ? 'Current image' : 'No image selected.'
    editor.imageFile = null
    if (imageInputRef.value) {
      imageInputRef.value.value = ''
    }
    clearPreview()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearPreview()
})
</script>

<template>
  <div class="grid gap-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Editor</p>
        <h2 class="text-2xl">{{ editor.id ? 'Edit post' : 'Create a new post' }}</h2>
        <p class="text-sm text-[color:var(--muted)]">Draft and schedule posts before publishing.</p>
      </div>
      <button :class="btnGhost" type="button" @click="resetEditor">Reset</button>
    </div>

    <form class="grid gap-4" @submit.prevent="handleSave">
      <div class="grid gap-2">
        <label for="title" class="text-sm font-semibold">Title</label>
        <input id="title" v-model="editor.title" type="text" placeholder="Post title" :class="inputBase" required />
      </div>
      <div class="grid gap-2">
        <label for="excerpt" class="text-sm font-semibold">Excerpt</label>
        <textarea
          id="excerpt"
          v-model="editor.excerpt"
          rows="3"
          placeholder="Short summary"
          :class="inputBase"
        ></textarea>
      </div>
      <div class="grid gap-2">
        <label for="body" class="text-sm font-semibold">Body</label>
        <textarea
          id="body"
          v-model="editor.body"
          rows="7"
          placeholder="Write your story"
          :class="inputBase"
          required
        ></textarea>
      </div>
      <div class="grid gap-2">
        <label for="publish" class="text-sm font-semibold">Publish status</label>
        <select id="publish" v-model="editor.publishMode" :class="inputBase" @change="setPublishMode($event.target.value)">
          <option value="draft">Draft</option>
          <option value="publish">Set publish date</option>
        </select>
      </div>
      <div class="grid gap-2">
        <label for="published" class="text-sm font-semibold">Publish date</label>
        <input
          id="published"
          v-model="editor.publishedAt"
          type="datetime-local"
          :disabled="editor.publishMode === 'draft'"
          :class="inputBase"
        />
      </div>
      <div class="grid gap-2">
        <label for="image" class="text-sm font-semibold">Cover image</label>
        <input id="image" ref="imageInputRef" type="file" accept="image/*" :class="inputBase" @change="handleImageChange" />
        <div class="mt-2 grid gap-2 rounded-[14px] border border-dashed border-[color:var(--border)] bg-white/60 p-3 text-center text-sm text-[color:var(--muted)]">
          <img v-if="editor.imagePreview" :src="editor.imagePreview" class="max-h-40 w-full rounded-[12px] object-cover" alt="Preview" />
          <span>{{ editor.imageLabel }}</span>
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button :class="btnPrimary" type="submit" :disabled="editor.saving">
          {{ editor.saving ? 'Saving...' : editor.id ? 'Update post' : 'Create post' }}
        </button>
      </div>
    </form>
  </div>
</template>
