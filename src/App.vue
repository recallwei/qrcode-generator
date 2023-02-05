<script setup lang="ts">
import { RouterView } from "vue-router"
import { NConfigProvider, NGlobalStyle, zhCN, dateZhCN } from "naive-ui"
</script>

<template>
  <NConfigProvider
    class="container"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <RouterView v-slot="{ Component, route }">
      <Transition
        name="fade"
        mode="out-in"
      >
        <component
          :is="Component"
          :key="route.path"
        />
      </Transition>
    </RouterView>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<style scoped lang="scss">
.container {
  height: auto;
}
// 路由切换过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
