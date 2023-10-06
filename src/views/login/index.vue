<script setup>
import monkey from '@/components/decorations/monkey.vue'
</script>
<template>
  <Transition leave-from-class="animate__animated animate__fadeOut">
    <div class="login-wrap">
      <monkey ref="monkeyDom" />
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.login-wrap {
  /* https://picsum.photos/ */
  // --background-image: url('https://picsum.photos/1440?blur=3');
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  background-image: url('https://www.pttrns.com/wp-content/uploads/2022/07/pttrns_home-886x1024.png');
}
</style>
