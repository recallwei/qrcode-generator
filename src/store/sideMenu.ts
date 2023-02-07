import { ref } from "vue"
import { defineStore } from "pinia"
import type { SideMenuActiveKey } from "@/interfaces"

export const useSideMenuStore = defineStore("sideMenu", () => {
  const activeKey = ref<SideMenuActiveKey>("home")

  const changeActiveKey = (key: SideMenuActiveKey) => {
    activeKey.value = key
  }

  return {
    activeKey,
    changeActiveKey
  }
})
