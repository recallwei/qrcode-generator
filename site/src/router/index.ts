import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import type { SideMenuActiveKey } from "@/types"
import { useSideMenuStore } from "@/store"
import { routerData } from "@/constants"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerData
})

NProgress.configure({ showSpinner: false }) // Hide the Spinner of NProgress

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start()
  }
  // NOTE: Store must define in the function `router.beforeEach`
  const sideMenuStore = useSideMenuStore()
  sideMenuStore.changeActiveKey(to.name as SideMenuActiveKey) // Change the active key of side menu
  document.title = to.meta.title as string // Change the title of the document
  next()
})

router.afterEach(() => NProgress.done())

export default router
