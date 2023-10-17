<script setup>
import ColorThief from 'colorthief'
import { onUnmounted, ref } from 'vue'
const images = new Array(4).fill(null).map((obj, i) => `https://picsum.photos/200?r=${i}`)
const colorThief = new ColorThief()
const currentIndex = ref(-1)
const html = document.documentElement
let timer = null
async function handleMouseEnter(img, i) {
  timer && clearTimeout(timer)
  currentIndex.value = i
  const colors = await colorThief.getPalette(img, 3).map(([r, g, b]) => `rgb(${r},${g},${b})`)
  html.style.setProperty('--c1', colors[0])
  html.style.setProperty('--c2', colors[1])
  html.style.setProperty('--c3', colors[2])
}
function handleMouseLeave() {
  currentIndex.value = -1
  timer = setTimeout(() => {
    html.style.setProperty('--c1', '#eee')
    html.style.setProperty('--c2', '#eee')
    html.style.setProperty('--c3', '#eee')
  }, 300)
}
onUnmounted(() => timer && clearTimeout(timer))
</script>
<template>
  <el-row class="content">
    <el-row class="img-wrapper">
      <el-col
        v-for="(url, i) in images"
        :span="10"
        :key="i"
      >
        <img
          crossorigin="anonymous"
          :src="url"
          :style="{ opacity: currentIndex === -1 ? 0.8 : currentIndex === i ? 1 : 0.2 }"
          @mouseenter="handleMouseEnter($event.target, i)"
          @mouseleave="handleMouseLeave"
        />
      </el-col>
    </el-row>
  </el-row>
</template>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
  background-image: linear-gradient(0deg, var(--c1, #eee), var(--c2, #eee), var(--c3, #eee));

  img {
    width: 100%;
    aspect-ratio: 1;
    border: 4px solid #fff;
    border-radius: 4px;
    transform: scale(0.9);
    transition: all 0.5s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.img-wrapper {
  width: 640px;

  .el-col {
    margin-left: 40px;
    margin-bottom: 40px;
  }
}
</style>
