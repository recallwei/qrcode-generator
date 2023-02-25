import type { MenuOption } from "naive-ui"
import { Qrcode as QuickIcon, BoxOpen as BoxOpenIcon } from "@vicons/fa"
import { QrCodeScannerOutlined as DecodeIcon } from "@vicons/material"
import { Naive } from "@/modules"
import type { SideMenuItem } from "@/types"

enum SideMenu {
  Quick = "quick",
  Decode = "decode",
  Tools = "tools"
}

const sideMenuMap = new Map<SideMenu, SideMenuItem>([
  [
    SideMenu.Quick,
    {
      path: "/quick",
      name: SideMenu.Quick,
      title: "快速建码",
      icon: QuickIcon
    }
  ],
  [
    SideMenu.Decode,
    {
      path: "/decode",
      name: SideMenu.Decode,
      title: "解码工具",
      icon: DecodeIcon,
      hidden: true
    }
  ],
  [
    SideMenu.Tools,
    {
      icon: BoxOpenIcon
    }
  ]
])

const mapToMenuOption = (sideMenu: SideMenu): MenuOption => {
  const { path, name, title, icon, hidden } = sideMenuMap.get(sideMenu) ?? {}
  if (!path) throw new Error("Invalid router: router should have a path.")
  if (!name) throw new Error("Invalid router: router should have a name as key.")
  return {
    label: Naive.getRouterLinkNode(path, title ?? ""),
    key: name,
    icon: icon && Naive.renderIcon(icon),
    show: !hidden
  }
}

/**
 * 2023/2/26 Bruce Song <recall4056@gmail.com>
 * NOTE:
 * This function is not used, because there aren't any routers with children in the menu.
 */
// const mapToMenuOptionWithChildren = (sideMenu: SideMenu, children: MenuOption[]): MenuOption => {
//   const { path, name, title, icon } = sideMenuMap.get(sideMenu) ?? {}
//   if (!path) throw new Error("Invalid router: router should have a path.")
//   if (!name) throw new Error("Invalid router: router should have a name as key.")
//   return {
//     label: Naive.getRouterLinkNode(path, title ?? ""),
//     key: name,
//     icon: icon && Naive.renderIcon(icon),
//     children
//   }
// }

export const sideMenuOptions: MenuOption[] = [
  mapToMenuOption(SideMenu.Quick),
  mapToMenuOption(SideMenu.Decode)
]
