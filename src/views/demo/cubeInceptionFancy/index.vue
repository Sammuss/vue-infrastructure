<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  let c = document.querySelector('#c')
  let x = c.getContext('2d')
  let S = Math.sin
  let C = Math.cos
  let t = 0
  let go = 0
  let rsz = (window.onresize = () => {
    setTimeout(() => {
      if (document.body.clientWidth > document.body.clientHeight * 1.77777778) {
        c.style.height = '100vh'
        setTimeout(() => (c.style.width = c.clientHeight * 1.77777778 + 'px'), 0)
      } else {
        c.style.width = '100vw'
        setTimeout(() => (c.style.height = c.clientWidth / 1.77777778 + 'px'), 0)
      }
      c.width = 1920
      c.height = c.width / 1.777777778
    }, 0)
  })
  rsz()

  let Draw = () => {
    let bg = new Image()
    bg.src = 'https://srmcgann.github.io/drawings/rotated/05412d422b2714fbeab2593366338211_rotated.jpg'
    if (!t) {
      go = false
      for (let CB = [], j = 6; j--; )
        for (let i = 4; i--; ) {
          let p = ((Math.PI * 2) / 4) * i + Math.PI / 4
          let l = j < 3 ? -1 : 1
          let a = [S(p), C(p), 2 ** 0.5 / 2]
          CB = [...CB, [a[j % 3] * l, a[(j + 1) % 3] * l, a[(j + 2) % 3] * l]]
        }
      bg.onload = () => {
        go = true
      }
    }
    x.lineJoin = 'round'
    x.lineCap = 'round'

    if (go) {
      let g = 'globalAlpha'
      x[g] = 0.4
      let w = c.width
      x.drawImage(bg, 0, 0, w, c.height)
      x[g] = 0.4
      x.fillRect(0, 0, w, w)
      let P = []
      for (let i = 5; i--; ) {
        let p = ((Math.PI * 2) / 4) * i + Math.PI / 4
        P.push([S(p), C(p), 2 ** 0.5 * (1.5 + S(t * 2) * 1)])
      }
      let Q = (X, Y, Z) => {
        let k = 6
        let z
        for (x.beginPath(); k--; )
          for (let j = 5; j--; ) {
            let l = k < 3 ? -1 : 1
            z = Z + l * P[j][(k + 2) % 3]
            x[j - 4 ? 'lineTo' : 'moveTo'](
              960 + ((X + P[j][k % 3] * l) / z) * h,
              h + ((Y + l * P[j][(k + 1) % 3]) / z) * h
            )
          }
        x.lineWidth = 2 + Math.min(10, 99 / z / z)
        x[g] = (1 / (1 + z ** 5 / 8e6)) * ((z / 9 ** 6) * 3e4)
        let ss = 'strokeStyle'
        x[ss] = `hsla(${(Math.hypot(X, Y) * 3 ** 4) / 16 - t * h},99%,${250 + S(t) * 220}%,.5`
        x.lineWidth = (4e3 / (4 + z) ** 2) | 0
        x.stroke()
        x.lineWidth /= 4
        x[ss] = '#fff'
        x.stroke()
      }
      x[g] = 1
      let h = 540
      let m = 400
      x.lineCap = 'round'
      x.lineJoin = 'round'
      for (let s = 12; m--; ) {
        let Z = ((m / 100) | 0) * s + 16 - ((t * 50) % s)
        if (Z > 2)
          Q(((m % 10) - 5) * s + ((S(t / 4) * 64) % s), ((((m / 10) | 0) % 10) - 5) * s + ((C(t / 4) * 40) % s), Z)
      }
    } else {
      let w = 1920
      x.fillRect(0, 0, w, w)
    }

    t += 1 / 60
    requestAnimationFrame(Draw)
  }
  Draw()
})
</script>
<template>
  <el-row class="content">
    <canvas id="c"></canvas>
  </el-row>
</template>
<style lang="scss" scoped>
.content {
  height: 100%;
  justify-content: center;
  align-items: center;

  > div {
    width: 200px;
    height: 200px;
    overflow: auto;
  }
}
</style>
