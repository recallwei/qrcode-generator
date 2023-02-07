export default [
  {
    path: "/",
    name: "layout",
    component: () => import("@/views/layout"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/home"),
        meta: { title: "首页 - 二维码生成工具" }
      },
      {
        path: "/crystal",
        name: "crystal",
        component: () => import("@/views/yuze/crystal"),
        meta: { title: "拉晶 - 云南宇泽" }
      },
      {
        path: "/slice",
        name: "slice",
        component: () => import("@/views/yuze/slice"),
        meta: { title: "切片 - 云南宇泽" }
      }
    ]
  }
]
