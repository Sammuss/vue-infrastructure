<script setup>
import { inject, computed } from 'vue'
const _getElLocale = inject('_getElLocale')
const $router = inject('$router')
const locale = computed(() => _getElLocale())
</script>

<template>
  <el-config-provider :locale="locale">
    <Transition
      name="aa"
      appear
    >
      <router-view></router-view>
    </Transition>
  </el-config-provider>
</template>
