<script setup lang="ts">
import { RouterView } from "vue-router"
import { NConfigProvider, NGlobalStyle, NMessageProvider, zhCN, dateZhCN } from "naive-ui"
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-auto"
  >
    <NMessageProvider>
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </NMessageProvider>
    <NGlobalStyle />
  </NConfigProvider>
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
