import { siteMetaData } from "@/constants"

const { AppName } = siteMetaData

enum Router {
  Home = "home",
  Quick = "quick"
}

const RouterMap = new Map([
  [Router.Home, { path: "/", name: Router.Home, title: `首页 - ${AppName}` }],
  [Router.Quick, { path: "/quick", name: Router.Quick, title: `快捷建码 - ${AppName}` }]
])

export const routerData = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/views/layout"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/home"),
        meta: { title: `首页 - ${AppName}` }
      },
      {
        path: "/yuze/crystal",
        name: "yuze-crystal",
        component: () => import("@/views/yuze/crystal"),
        meta: { title: "拉晶 - 云南宇泽" }
      },
      {
        path: "/yuze/slice/inner",
        name: "yuze-slice-inner",
        component: () => import("@/views/yuze/slice/inner"),
        meta: { title: "切片 - 云南宇泽" }
      },
      {
        path: "/yuze/slice/outer",
        name: "yuze-slice-outer",
        component: () => import("@/views/yuze/slice/outer"),
        meta: { title: "切片 - 云南宇泽" }
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/error/not-found"),
        meta: { title: `404 - ${AppName}` }
      }
    ]
  }
]
