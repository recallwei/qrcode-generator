import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import "./assets/main.scss"
import "vfonts/OpenSans.css" // Import OpenSans Font
import "vfonts/FiraCode.css" // Import FiraCode Font
import "nprogress/nprogress.css" // NProgress Style

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Resolve the style conflict between Tailwind CSS and Naive UI
const meta = document.createElement("meta")
meta.name = "naive-ui-style"
document.head.appendChild(meta)

app.mount("#app")
