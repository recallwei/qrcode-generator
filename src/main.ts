import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import { withNProgress } from "@/modules"

import "./assets/main.scss"
import "vfonts/OpenSans.css" // 引入 OpenSans 字体
import "vfonts/FiraCode.css" // 引入 FiraCode 字体
import "nprogress/nprogress.css" // NPorgress 样式文件

const app = createApp(App)

app.use(createPinia())
app.use(withNProgress(router))

// 解决 Tailwind CSS 与 Naive UI 样式冲突问题
const meta = document.createElement("meta")
meta.name = "naive-ui-style"
document.head.appendChild(meta)

app.mount("#app")
