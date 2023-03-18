import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import type { SideMenuActiveKey } from '@/types'
import { useSideMenuStore } from '@/store'
import { routes, siteMetaData } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const processTargetRoute = (to: RouteLocationNormalized) => {
  // NOTE: Store must define in the function `router.beforeEach`
  const sideMenuStore = useSideMenuStore()
  const { AppName } = siteMetaData
  sideMenuStore.changeActiveKey(to.name as SideMenuActiveKey) // Change the active key of side menu
  document.title = to.path === '/' ? AppName : `${to.meta.title} - ${AppName}` // Change the title of the document
}

NProgress.configure({ showSpinner: false }) // Hide the Spinner of NProgress

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start()
  }
  processTargetRoute(to)
  next()
})
router.afterEach(() => NProgress.done())

export default router
