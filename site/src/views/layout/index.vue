<script setup lang="ts">
import { RouterView } from "vue-router"
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu } from "naive-ui"
import { useSideMenuStore } from "@/store"
import { useSiteMetaData } from "@/hooks"
import { FallBack } from "@/components"
import { sideMenuOptions } from "./model"

const { AppName } = useSiteMetaData()
const sideMenuStore = useSideMenuStore()
</script>

<template>
  <div class="h-screen w-screen">
    <n-layout
      class="h-full w-full"
      embedded
    >
      <n-layout-header
        class="flex h-16 items-center py-2 px-8"
        bordered
      >
        <div class="text-lg font-bold">{{ AppName }}</div>
      </n-layout-header>
      <n-layout
        class="flex h-[calc(100%-64px)] w-full"
        has-sider
      >
        <n-layout-sider
          class="flex h-full w-44 flex-col items-center justify-start"
          :native-scrollbar="false"
          show-trigger="arrow-circle"
          collapse-mode="width"
          :collapsed-width="64"
          bordered
        >
          <n-menu
            v-model:value="sideMenuStore.activeKey"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="sideMenuOptions"
          />
        </n-layout-sider>
        <n-layout-content
          class="grow"
          :content-style="{ minHeight: '100%', position: 'relative', padding: '24px' }"
          :native-scrollbar="false"
        >
          <router-view v-slot="{ Component }">
            <template v-if="Component">
              <transition
                name="fade"
                mode="out-in"
              >
                <suspense timeout="0">
                  <component :is="Component" />
                  <template #fallback>
                    <fall-back />
                  </template>
                </suspense>
              </transition>
            </template>
          </router-view>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
