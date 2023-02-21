import { siteMetaData } from "./siteMetaData"

const { AppName } = siteMetaData

export const routerData = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home"),
    meta: { title: AppName }
  },
  {
    path: "/",
    name: "layout",
    component: () => import("@/views/Layout"),
    children: [
      {
        path: "/quick",
        name: "quick",
        component: () => import("@/views/Quick"),
        meta: { title: `快速建码 - ${AppName}` }
      },
      {
        path: "/decode",
        name: "decode",
        component: () => import("@/views/Decode"),
        meta: { title: `解码工具 - ${AppName}` }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/Error/NotFound"),
    meta: { title: `404 - ${AppName}` }
  }
]
