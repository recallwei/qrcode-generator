import {
  QrCode2Outlined as QuickIcon,
  QrCodeScannerOutlined as DecodeIcon,
  SettingsOutlined as ConfigIcon
} from "@vicons/material"
import { siteMetaData } from "../../site.config"

const { AppName } = siteMetaData

export const routes = [
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
        meta: {
          title: "快速建码",
          icon: QuickIcon
        }
      },
      {
        path: "/decode",
        name: "decode",
        component: () => import("@/views/Decode"),
        meta: {
          title: "解码工具",
          icon: DecodeIcon,
          disabled: true
          // hidden: true
        }
      },
      {
        path: "/config-files",
        name: "config-files",
        component: () => import("@/views/ConfigFiles"),
        meta: {
          title: "配置文件",
          icon: ConfigIcon
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound"),
    meta: {
      title: "404"
    }
  }
]
