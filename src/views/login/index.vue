<script setup>
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/lib/pinia/user'

const userStore = useUserStore()
const t = inject('$t')
const formRef = ref()
const loading = ref(false)
const router = useRouter()
const rules = computed(() => ({
  username: [{ required: true, message: t('errors.required', { field: '@:fields.username' }), trigger: 'blur' }],
  password: [{ required: true, message: t('errors.required', { field: '@:fields.password' }), trigger: 'blur' }]
}))
const form = reactive({
  username: '',
  password: ''
})
const submit = async (el) => {
  if (!el) return
  await el.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const res = await userStore.login(form)
      loading.value = false
      if (res.code !== 200) return
      router.push({ path: '/' })
    }
  })
}
</script>
<template>
  <Transition leave-from-class="animate__animated animate__fadeOut">
    <div class="login-wrap">
      <el-form
        ref="formRef"
        v-loading="loading"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="submit(formRef)"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            :placeholder="$t('fields.username')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            inputmode="text"
            :placeholder="$t('fields.password')"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit(formRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.login-wrap {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 100px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url('../../assets/images/bg-repetition.jpg');
  background-repeat: repeat;
  background-clip: content-box;
  background-attachment: fixed;
  background-color: #fff;

  &::before {
    content: '';
    position: absolute;
    display: block;
    padding: 100px 0;
    background: linear-gradient(120deg, #eaee44, #33d0ff);
    background-clip: content-box;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0.5;
  }
}

@keyframes bg-focus {
  from {
    background-image: linear-gradient(120deg, #eaee44, #33d0ff);
  }
  to {
    background-image: linear-gradient(60deg, #eaee44, #33d0ff);
  }
}

.el-form {
  --border-radius: 8px;
  align-self: flex-end;
  max-width: 100%;
  max-height: 100%;
  width: 260px;
  transform: translate(-200px, -100px);
  padding: 120px 30px;
  box-shadow: 0 15px 30px #000;
  transition: box-shadow 0.5s;
  border-radius: var(--border-radius);

  &:hover,
  &:active,
  &:focus {
    box-shadow: 0 30px 60px #000;

    &::before {
      filter: blur(3px) opacity(0.85);
    }
  }

  &::before {
    content: '';
    background-color: rgba(255, 255, 255, 0.5);
    background-image: url('../../assets/images/bg-dog.jpg');
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    filter: blur(2px) opacity(0.85);
    z-index: -1;
    border-radius: var(--border-radius);
  }

  &::after {
    content: '';
    background-color: rgba(255, 255, 255, 0.75);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    filter: blur(50px) opacity(0.95);
    border-radius: var(--border-radius);
  }
}
</style>
