<script setup lang="ts">
import { RouterView } from "vue-router"
import {
  NConfigProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  zhCN,
  dateZhCN
} from "naive-ui"
import FallBack from "@/views/Error/FallBack/index.vue"
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
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
                <suspense>
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
