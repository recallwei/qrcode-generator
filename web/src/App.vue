<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  NConfigProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  zhCN,
  dateZhCN,
  lightTheme,
  darkTheme
} from 'naive-ui'
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="lightTheme"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <router-view v-slot="{ Component }">
          <transition
            name="router"
            mode="out-in"
          >
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </n-message-provider>
    </n-loading-bar-provider>
    <n-global-style />
  </n-config-provider>
</template>

<style scoped lang="scss">
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}
.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>
