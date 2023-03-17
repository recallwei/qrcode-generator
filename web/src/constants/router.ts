import {
  QrCode2Outlined as QuickIcon,
  QrCodeScannerOutlined as DecodeIcon,
  SettingsOutlined as ConfigIcon,
  ArticleOutlined as TemplateIcon
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
        path: "/template",
        name: "template",
        component: () => import("@/views/Template"),
        meta: {
          title: "模板建码",
          icon: TemplateIcon
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
          icon: ConfigIcon,
          hidden: import.meta.env.PROD
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
