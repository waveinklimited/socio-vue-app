import { reactive } from 'vue'

const toastState = reactive({
  message: '',
  type: 'info',
  visible: false,
})

let toastTimer

const showToast = (message, type = 'info') => {
  toastState.message = message
  toastState.type = type
  toastState.visible = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastState.visible = false
  }, 3500)
}

export const useToast = () => ({
  toastState,
  showToast,
})
