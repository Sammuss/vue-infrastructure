<script setup>
import { inject } from 'vue'
const $send = inject('$send')

const switchLang = () => {
    document.querySelector('html').lang = 'ja'
}
let page = 1
const requestAlova = async () => {
    const ret = await $send('POST_USER_LOGIN', { username: 'aa', passwrod: '123' })
    // page++
    console.log(ret)
}
</script>
<template>
    <div>
        i18n，国际化，<button @click="switchLang">点击修改</button>
        <p>函数翻译：{{ $t('message.hello') }}</p>
        <p>指令翻译：<span v-t="'message.hello'"></span></p>
    </div>
    <div>
        alova 发起请求 <button @click="requestAlova">发起请求</button>
    </div>
</template>
