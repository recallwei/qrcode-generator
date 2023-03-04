import type { MenuOption } from "naive-ui"
import { Naive } from "@/modules"
import { routes } from "./router"

export const sideMenuOptions: MenuOption[] = (
  routes.find((routerItem) => routerItem.name === "layout") as any
).children.map((routerItem: any) => {
  const { path, name, meta } = routerItem
  const { title, icon, hidden, disabled } = meta || {}
  if (!path) throw new Error("Invalid router: router should have a path.")
  if (!name) throw new Error("Invalid router: router should have a name as key.")
  return {
    label: disabled ? title : Naive.getRouterLinkNode(path, title ?? ""),
    key: name,
    icon: icon && Naive.renderIcon(icon),
    show: !hidden,
    disabled
  }
})
