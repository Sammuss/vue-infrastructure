import { createApp } from 'vue'
import './assets/css/index.css'
import App from './App.vue'
import i18n from './lib/i18n'
import api from './constant/api'
import router from './lib/router'
import storage from './utils/storage'
import alova from './lib/alova'
import mitt from './lib/mitt'

const app = createApp(App)

app.config.globalProperties.$api = api

app.use(storage)
app.use(mitt)
app.use(i18n)
app.use(router)
app.use(alova)
app.mount('#app')

export default app