<script setup>
import { inject, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/lib/pinia/user'
import { ElMessage } from 'element-plus'
onMounted(() => {
})
const form = reactive({
    username: 'admin',
    password: '123456'
})
const $http = inject('$http')
const $t4el = inject('$t4el')
const user = useUserStore()
const { login } = user
const switchLang = () => {
    document.querySelector('html').lang = 'ja'
}
const requestLogin = async () => {
    if (!form.username) return ElMessage.error('username can\'t not be empty.')
    if (!form.password) return ElMessage.error('password can\'t not be empty.')
    await login(form)
}
const locale = computed(() => ($t4el()))
</script>
<template>
    <div>
        i18n，国际化，<button @click="switchLang">点击修改</button>
        <p>函数翻译：{{ $t('message.hello') }}</p>
        <p>指令翻译：<span v-t="'message.hello'"></span></p>
    </div>
    <div>
        <el-form :model="form" label-width="120px" style="width: 300px;">
            <el-form-item label="username">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="password">
                <el-input v-model="form.password" />
            </el-form-item>
            <el-form-item>
                <el-button @click="requestLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div>
        <el-table mb-1 :data="[]" />
        <el-pagination :total="100" />
    </div>
</template>
