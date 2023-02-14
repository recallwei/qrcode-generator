import { ref } from "vue"
import { defineStore } from "pinia"
import type { SideMenuActiveKey } from "@/interfaces"

export const useSideMenuStore = defineStore("sideMenu", () => {
  // SideMenu Current Active Item
  const activeKey = ref<SideMenuActiveKey>("home")
  const changeActiveKey = (key: SideMenuActiveKey) => {
    activeKey.value = key
  }

  // SideMenu Collapsed State
  const collapsed = ref(false)
  const changeCollapsed = (value: boolean) => {
    collapsed.value = value
  }
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  return {
    activeKey,
    changeActiveKey,
    collapsed,
    changeCollapsed,
    toggleCollapsed
  }
})
