<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui"
</script>

<template>
  <main>
    <n-tabs default-value="inner">
      <n-tab-pane
        name="inner"
        display-directive="show"
        tab="内部"
      >
      </n-tab-pane>
      <n-tab-pane
        name="outer"
        display-directive="show"
        tab="外部"
      >
      </n-tab-pane>
    </n-tabs>
  </main>
</template>

<style scoped lang="scss"></style>
