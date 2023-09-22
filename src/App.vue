<script setup>
import { inject, computed } from 'vue'
const _getElLocale = inject('_getElLocale')
const locale = computed(() => _getElLocale())
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
