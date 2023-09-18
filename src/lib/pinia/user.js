import { defineStore } from 'pinia'
import { $http } from '@/lib/axios'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async login (payload) {
            const { code, data } = await $http('POST_USER_LOGIN', payload, { headers: { 'content-type': 'application/x-www-form-urlencoded' }})
            if (code !== 200) return
            this.user = data

            data.token && storage.set('token', data.token)
        }
    }
})
