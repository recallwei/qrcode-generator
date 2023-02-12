<script setup lang="ts">
import { RouterView } from "vue-router"
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NLoadingBarProvider,
  zhCN,
  dateZhCN
} from "naive-ui"
import { FallBack } from "@/components"
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-auto"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <transition
              name="fade"
              mode="out-in"
            >
              <keep-alive>
                <suspense timeout="0">
                  <component :is="Component" />
                  <template #fallback>
                    <fall-back />
                  </template>
                </suspense>
              </keep-alive>
            </transition>
          </template>
        </router-view>
      </n-message-provider>
    </n-loading-bar-provider>
    <NGlobalStyle />
  </n-config-provider>
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
