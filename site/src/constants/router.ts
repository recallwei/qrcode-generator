import { Home as HomeIcon, Qrcode as QrcodeIcon, BoxOpen as BoxOpenIcon } from "@vicons/fa"
import { siteMetaData } from "./siteMetaData"

const { AppName } = siteMetaData

export enum Router {
  Home = "home",
  Quick = "quick"
}

export const routerMap = new Map([
  [
    Router.Home,
    {
      path: "/",
      name: Router.Home,
      title: `首页 - ${AppName}`,
      sideMenu: {
        title: "首页",
        icon: HomeIcon
      }
    }
  ],
  [
    Router.Quick,
    {
      path: "/quick",
      name: Router.Quick,
      title: `快速建码 - ${AppName}`,
      sideMenu: {
        title: "快速建码",
        icon: QrcodeIcon
      }
    }
  ]
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
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/Error/NotFound"),
        meta: { title: `404 - ${AppName}` }
      }
    ]
  }
]
