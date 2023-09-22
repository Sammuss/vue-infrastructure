import { createApp } from 'vue'
import './assets/css/index.css'
import App from './App.vue'
import i18n from './lib/i18n'
import router from './lib/router'
import storage from './utils/storage'
import axios from './lib/axios'
import mitt from './lib/mitt'
import elementPlus from './lib/element-plus'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(storage)
app.use(i18n)
app.use(mitt)
app.use(router)
app.use(axios)
app.use(pinia)
app.use(elementPlus)
app.mount('#app')

export default app
