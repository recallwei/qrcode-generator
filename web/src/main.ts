import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.scss'
import 'vfonts/OpenSans.css' // Import OpenSans Font
import 'vfonts/FiraCode.css' // Import FiraCode Font
import 'nprogress/nprogress.css' // NProgress Style

import { faviconLoader, naiveUILoader } from '@/tools'

const app = createApp(App)

// app.config.errorHandler = (err, instance, info) => {
//   console.log(err, instance, info)
// }

app.use(createPinia()).use(router).mount('#app')

faviconLoader()
naiveUILoader()
