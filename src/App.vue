<script setup>
import { inject, computed } from 'vue'
import { emitter, EVENT_USER_INVALID } from '@/lib/mitt'
import { useUserStore } from './lib/pinia/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const _getElLocale = inject('_getElLocale')
const locale = computed(() => _getElLocale())
function initLister() {
  emitter.on(EVENT_USER_INVALID, () => {
    userStore.logout()
    router.go({ name: 'login' })
  })
}
initLister()
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
