<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import ToastNotice from './components/ToastNotice.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DefaultLayout))
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
  <ToastNotice />
</template>
