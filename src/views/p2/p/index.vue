<script setup>
import { inject, reactive, onMounted, ref } from 'vue'
import { useUserStore } from '@/lib/pinia/user'
import { ElMessage } from 'element-plus'
import tts from '@/lib/tts'
onMounted(() => {})
const form = reactive({
  username: 'admin',
  password: '123456'
})
const total = ref(0)
const ttsText = ref('黑子说话')
const $http = inject('$http')
const user = useUserStore()
const { login, logout } = user
const switchLang = () => {
  document.querySelector('html').lang = 'ja'
}
const requestLogin = async () => {
  if (!form.username) return ElMessage.error("username can't not be empty.")
  if (!form.password) return ElMessage.error("password can't not be empty.")
  await login(form)
}

const requestLogout = async () => {
  logout()
}

const getUserList = async () => {
  const { code, data } = await $http('GET_USER_LIST', { page: 1, size: 100 })
  if (code !== 200) return
  total.value = data.total
}

const playVoice = () => {
  const buffer = tts(ttsText.value, { rate: 0.5 })
}
</script>
<template>
  <div>
    i18n，国际化，<button @click="switchLang">点击修改</button>
    <p>函数翻译：{{ $t('message.hello') }}</p>
    <p>指令翻译：<span v-t="'message.hello'"></span></p>
  </div>
  <div>
    <el-form
      :model="form"
      label-width="120px"
      style="width: 600px"
    >
      <el-form-item label="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="password">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item>
        <el-button @click="requestLogin">登录</el-button>
        <el-button @click="requestLogout">登出</el-button>
        <el-button @click="getUserList">请求用户列表</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table
      mb-1
      :data="[]"
    />
    <el-pagination :total="total" />
  </div>
  <div>
    <el-input v-model="ttsText" />
    <el-button @click="playVoice">转换语音</el-button>
  </div>
  <div>
    <div id="qrcode"></div>
  </div>
</template>
