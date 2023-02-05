import NProgress from "nprogress"
import type { Router } from "vue-router"

NProgress.configure({ showSpinner: false }) // 隐藏 NProgress 的 Spinner

export const withNProgress = (router: Router): Router => {
  // 导航守卫
  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      NProgress.start()
    }
  })
  router.afterEach(() => NProgress.done())
  return router
}
