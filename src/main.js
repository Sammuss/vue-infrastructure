import { createApp } from 'vue'
import './assets/css/index.css'
import 'animate.css'
import App from './App.vue'
import i18n from './lib/i18n'
import router from './lib/router'
import axios from './lib/axios'
import elementPlus from './lib/element-plus'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(axios)
app.use(elementPlus)
app.mount('#app')

export default app
