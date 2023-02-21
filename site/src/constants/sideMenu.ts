import type { MenuOption } from "naive-ui"
import { Qrcode as QrcodeIcon, BoxOpen as BoxOpenIcon } from "@vicons/fa"
import { Naive } from "@/modules"

enum SideMenu {
  Quick = "quick",
  Tools = "tools"
}

const sideMenuMap = new Map([
  [
    SideMenu.Quick,
    {
      path: "/quick",
      name: SideMenu.Quick,
      title: "快速建码",
      icon: QrcodeIcon
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
  const { path, name, title, icon } = sideMenuMap.get(sideMenu) ?? {}
  if (!path) throw new Error("Invalid router: router should have a path.")
  if (!name) throw new Error("Invalid router: router should have a name as key.")
  return {
    label: Naive.getRouterLinkNode(path, title ?? ""),
    key: name,
    icon: icon && Naive.renderIcon(icon)
  }
}

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

export const sideMenuOptions: MenuOption[] = [mapToMenuOption(SideMenu.Quick)]