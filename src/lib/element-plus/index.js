import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default {
  install: (app, ...options) => {
    app.use(ElementPlus, ...options)
  }
}
