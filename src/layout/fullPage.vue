<template>
  <TransitionGroup name="fullPage">
    <div
      class="page-root"
      :key="$route.path"
    >
      <router-view></router-view>
    </div>
  </TransitionGroup>
</template>
<style scoped>
.page-root {
  width: 100%;
  height: 100%;
  --animation-duration: 0.4s;
}

.fullPage-leave-active {
  animation: fadeOutRight; /* referring directly to the animation's @keyframe declaration */
  animation-duration: var(--animation-duration); /* don't forget to set a duration! */
}

.fullPage-enter-active {
  animation: fadeInLeft; /* referring directly to the animation's @keyframe declaration */
  animation-duration: var(--animation-duration); /* don't forget to set a duration! */
  animation-delay: var(--animation-duration);
}
</style>
