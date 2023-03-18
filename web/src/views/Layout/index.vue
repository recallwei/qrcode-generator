<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui'
import { useSideMenuStore } from '@/store'
import { siteMetaData, sideMenuOptions } from '@/constants'

const { AppName, Favicon } = siteMetaData

const router = useRouter()
const sideMenuStore = useSideMenuStore()

const navToHome = () => router.push('/')
</script>

<template>
  <div class="h-screen w-screen">
    <n-layout
      class="h-full w-full"
      embedded
    >
      <n-layout-header
        class="flex h-16 items-center py-2 px-4"
        bordered
      >
        <div
          class="flex select-none items-center space-x-2 hover:cursor-pointer"
          @click="navToHome"
        >
          <img
            width="36"
            height="36"
            :src="Favicon"
            :alt="AppName"
          />
          <div
            class="text-xl font-semibold tracking-wide"
            @click="navToHome"
          >
            {{ AppName }}
          </div>
        </div>
      </n-layout-header>
      <n-layout
        class="flex h-[calc(100%-64px)] w-full"
        has-sider
      >
        <n-layout-sider
          class="flex h-full w-44 flex-col items-center justify-start"
          show-trigger="arrow-circle"
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :native-scrollbar="false"
          @update:collapsed="(value) => sideMenuStore.changeCollapsed(value)"
        >
          <n-menu
            v-model:value="sideMenuStore.activeKey"
            class="tracking-[0.0625rem]"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="sideMenuOptions"
            :collapsed="sideMenuStore.collapsed"
          />
        </n-layout-sider>
        <n-layout-content
          class="grow"
          :content-style="{ minHeight: '100%', position: 'relative', padding: '24px' }"
          :native-scrollbar="false"
        >
          <router-view v-slot="{ Component }">
            <transition
              name="content"
              mode="out-in"
            >
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped lang="scss">
.content-enter-active,
.content-leave-active {
  transition: opacity 0.3s ease;
}
.content-enter-from,
.content-leave-to {
  opacity: 0;
}
</style>
