<script setup>
import { onMounted } from 'vue'
import Trace from '@/utils/trace'

onMounted(() => {
  const trace = new Trace(document.getElementById('canvas'))
  trace.draw()
})
</script>
<template>
  <canvas
    id="canvas"
    width="1400"
    height="600"
  ></canvas>
</template>
