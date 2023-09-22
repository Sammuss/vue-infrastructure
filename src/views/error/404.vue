<template>
  <div class="container">
    <h1>Oops!</h1>
    <p>Page not found.</p>
    <p>Were you looking for me?</p>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10vh 14vw;
  background: url('../../assets/images/dog.png') right bottom / 64.2vh 87.3vh no-repeat;
  color: #fff;
  position: relative;
}

h1 {
  font-size: 80px;
}

p {
  font-size: 60px;
}

.container::before {
  position: absolute;
  display: flex;
  content: '';
  top: -50%;
  left: -50%;
  background: radial-gradient(circle at 100% 100%, #bfbcbc 6%, #71716b 65%, #766c6c);
  width: 200%;
  height: 200%;
  z-index: -1;
  animation: slide 5s ease-in-out infinite alternate;
}

@keyframes slide {
  from {
    top: -50%;
    left: -50%;
  }

  to {
    top: -20%;
    left: -20%;
  }
}
</style>
