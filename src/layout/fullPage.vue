<template>
  <Transition
    name="fade"
    mode="default"
    appear
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown"
  >
    <div
      class="page-root"
      :key="$route.path"
    >
      <router-view></router-view>
    </div>
  </Transition>
</template>

<style scoped>
.page-root {
  width: 100%;
  height: 100%;
}

.fullPage-leave-active {
  animation: slideOutLeft; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}

.fullPage-enter-active {
  animation: slideInright; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}
</style>
