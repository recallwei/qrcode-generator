import { createPinia } from 'pinia'
import { sendNotification } from '@tauri-apps/api/notification'
import App from './App.vue'
import router from './router'
import { siteMetaData } from '@/constants'

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

if (import.meta.env.PROD) {
  sendNotification({
    title: '🍀二维码生成器',
    body: '当前仍处于内测阶段，如有问题请反馈管理员。',
    icon: siteMetaData.Favicon
  })
}

faviconLoader()
naiveUILoader()
