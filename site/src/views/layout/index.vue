<script setup lang="ts">
import { RouterView } from "vue-router"
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu } from "naive-ui"
import { useSideMenuStore } from "@/store"
import { useSiteMetaData } from "@/hooks"
import { sideMenuOptions } from "./model"

const { AppName } = useSiteMetaData()
const sideMenuStore = useSideMenuStore()
</script>

<template>
  <div class="h-screen w-screen">
    <NLayout
      class="h-full w-full"
      embedded
    >
      <NLayoutHeader
        class="flex h-16 items-center py-2 px-8"
        bordered
      >
        <div class="text-lg font-bold">{{ AppName }}</div>
      </NLayoutHeader>
      <NLayout
        class="flex h-[calc(100%-64px)] w-full"
        has-sider
      >
        <NLayoutSider
          class="flex h-full w-44 flex-col items-center justify-start"
          :native-scrollbar="false"
          show-trigger="arrow-circle"
          collapse-mode="width"
          :collapsed-width="64"
          bordered
        >
          <NMenu
            v-model:value="sideMenuStore.activeKey"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="sideMenuOptions"
          />
        </NLayoutSider>
        <NLayoutContent
          class="grow"
          :content-style="{ minHeight: '100%', position: 'relative', padding: '24px' }"
          :native-scrollbar="false"
        >
          <RouterView v-slot="{ Component }">
            <Transition
              name="fade"
              mode="out-in"
            >
              <component :is="Component" />
            </Transition>
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
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
