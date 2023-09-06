<script setup>
import { inject } from 'vue'
const $i18n = inject('$i18n')
const switchLang = () => {
    // document.querySelector('html').lang = 'ja'
    $i18n.locale = 'ja'
}
</script>
<template>
    <div>
        i18n，国际化，<button @click="switchLang">点击修改</button>
        <p>函数翻译：{{ $t('message.hello') }}</p>
        <p>指令翻译：<span v-t="'message.hello'"></span></p>
    </div>
</template>
