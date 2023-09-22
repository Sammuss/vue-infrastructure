// https://github.com/developit/mitt
import mitt from 'mitt'

const emitter = mitt()

export default {
  install: (app) => {
    app.config.globalProperties.$mitt = emitter
    app.provide('$mitt', emitter)
  }
}
