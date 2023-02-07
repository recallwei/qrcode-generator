import type { MenuOption } from "naive-ui"
import { Qrcode, ExternalLinkAlt, BuildingRegular, ShippingFast, Box } from "@vicons/fa"
import { Naive } from "@/modules"

const sideMenuOptions: MenuOption[] = [
  {
    label: Naive.getRouterLinkNode("/", "首页"),
    key: "home",
    icon: Naive.renderIcon(Qrcode)
  },
  {
    label: "云南宇泽",
    icon: Naive.renderIcon(BuildingRegular),
    children: [
      {
        // label: "拉晶",
        label: Naive.getRouterLinkNode("/crystal", "拉晶"),
        key: "crystal",
        icon: Naive.renderIcon(ShippingFast)
        // disabled: true
      },
      {
        label: Naive.getRouterLinkNode("/slice", "切片"),
        key: "slice",
        icon: Naive.renderIcon(Box)
      }
    ]
  },
  {
    label: Naive.getOutsideLinkNode("https://baidu.com", "外链测试"),
    key: "external",
    icon: Naive.renderIcon(ExternalLinkAlt)
  }
]

export { sideMenuOptions }
