import type { MenuOption } from "naive-ui"
import {
  Home,
  Qrcode,
  BuildingRegular,
  ShippingFast,
  Box,
  Users,
  UserTie,
  BoxOpen
} from "@vicons/fa"
import { Naive } from "@/modules"

export const sideMenuOptions: MenuOption[] = [
  {
    label: Naive.getRouterLinkNode("/", "首页"),
    key: "home",
    icon: Naive.renderIcon(Home)
  },
  {
    label: Naive.getRouterLinkNode("/quick", "快捷建码"),
    key: "quick",
    icon: Naive.renderIcon(Qrcode)
  },
  {
    label: "云南宇泽",
    key: "yuze",
    icon: Naive.renderIcon(BuildingRegular),
    children: [
      {
        label: "拉晶",
        // label: Naive.getRouterLinkNode("/yuze/crystal", "拉晶"),
        key: "yuze-crystal",
        icon: Naive.renderIcon(ShippingFast)
      },
      {
        label: "切片",
        // label: Naive.getRouterLinkNode("/yuze/slice", "切片"),
        key: "yuze-slice",
        icon: Naive.renderIcon(Box),
        children: [
          {
            // label: "内部",
            label: Naive.getRouterLinkNode("/yuze/slice/inner", "内部"),
            key: "yuze-slice-inner",
            icon: Naive.renderIcon(Users)
          },
          {
            label: Naive.getRouterLinkNode("/yuze/slice/outer", "外部"),
            key: "yuze-slice-outer",
            icon: Naive.renderIcon(UserTie)
          }
        ]
      }
    ]
  },
  {
    label: "其他工具",
    key: "tools",
    icon: Naive.renderIcon(BoxOpen),
    children: [
      {
        label: Naive.getOutsideLinkNode("https://cli.im/deqr", "二维码解码"),
        key: "deqr",
        icon: Naive.renderIcon(Qrcode)
      }
    ]
  }
]
