import { siteMetaData } from "./siteMetaData"

const { AppName } = siteMetaData

export enum Router {
  Home = "home",
  Quick = "quick"
}

export const routerMap = new Map([
  [Router.Home, { path: "/", name: Router.Home, title: `首页 - ${AppName}` }],
  [Router.Quick, { path: "/quick", name: Router.Quick, title: `快速建码 - ${AppName}` }]
])

export const routerData = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/views/Layout"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/Home"),
        meta: { title: `首页 - ${AppName}` }
      },
      {
        path: "/yuze/crystal",
        name: "yuze-crystal",
        component: () => import("@/views/YuZe/Crystal"),
        meta: { title: "拉晶 - 云南宇泽" }
      },
      {
        path: "/yuze/slice/inner",
        name: "yuze-slice-inner",
        component: () => import("@/views/YuZe/Slice/Inner"),
        meta: { title: "切片 - 云南宇泽" }
      },
      {
        path: "/yuze/slice/outer",
        name: "yuze-slice-outer",
        component: () => import("@/views/YuZe/Slice/Outer"),
        meta: { title: "切片 - 云南宇泽" }
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/Error/NotFound"),
        meta: { title: `404 - ${AppName}` }
      }
    ]
  }
]
