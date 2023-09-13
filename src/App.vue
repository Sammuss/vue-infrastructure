<script setup>
import { inject, computed } from 'vue'
const $t4el = inject('$t4el')
const locale = computed(() => ($t4el()))
</script>

<template>
    <el-config-provider :locale="locale">
        <router-view></router-view>
    </el-config-provider>
</template>
