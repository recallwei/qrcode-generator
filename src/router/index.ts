import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/index")
    },
    {
      path: "/center",
      name: "center",
      component: () => import("@/views/center")
    }
  ]
})

export default router
