import type { MenuOption } from "naive-ui"
import { Naive } from "@/modules"
import { Router, routerMap } from "./router"

const mapToMenuOption = (router: Router): MenuOption => {
  const { path, name, sideMenu } = routerMap.get(router) ?? {}
  const { title, icon } = sideMenu ?? {}
  if (!path || !name || !title || !icon) throw new Error("Invalid router")
  return {
    label: Naive.getRouterLinkNode(path, title),
    key: name,
    icon: Naive.renderIcon(icon)
  }
}

export const sideMenuOptions: MenuOption[] = [
  mapToMenuOption(Router.Home),
  mapToMenuOption(Router.Quick)
]
