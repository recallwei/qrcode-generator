import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import type { SideMenuActiveKey } from "@/interfaces"
import { useSideMenuStore } from "@/store"
import { routerData } from "./model"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerData
})

NProgress.configure({ showSpinner: false }) // Hide the Spinner of NProgress

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start()
  }
  const sideMenuStore = useSideMenuStore() // Store must define in the router.beforeEach function
  sideMenuStore.changeActiveKey(to.name as SideMenuActiveKey) // Change the active key of side menu
  document.title = to.meta.title as string
  next()
})

router.afterEach(() => NProgress.done())

export default router
