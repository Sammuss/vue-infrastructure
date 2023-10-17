import { defineStore } from 'pinia'

import { $http } from '@/lib/axios/index'
import { emitter, EVENT_USER_LOGIN, EVENT_USER_LOGOUT } from '@/lib/mitt'
import { storage } from '@/utils/storage'

function getRefreshToken() {
  return storage.get('token')
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      token: getRefreshToken()
    }
  }),
  getters: {
    isLogin: (state) => !!state?.user?.token
  },
  actions: {
    async login(payload) {
      const { code, data } = await $http('POST_USER_LOGIN', payload)
      if (code === 200) {
        this.user = data

        data.token && storage.set('token', data.token)
        emitter.emit(EVENT_USER_LOGIN)
      }
      return { code, data }
    },

    async logout() {
      const { code } = await $http('POST_USER_LOGOUT')
      if (code !== 200) return false
      this.user = null
      storage.remove('token')
      emitter.emit(EVENT_USER_LOGOUT)
      return true
    }
  }
})
