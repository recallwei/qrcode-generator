<script setup lang="ts">
import { useRouter } from "vue-router"
import { NTabs, NTabPane } from "naive-ui"

const router = useRouter()
</script>

<template>
  <main>
    <NTabs default-value="inner">
      <NTabPane
        name="inner"
        display-directive="show"
        tab="内部"
      >
        <show-input />
      </NTabPane>
      <NTabPane
        name="outer"
        display-directive="show"
        tab="外部"
      >
        <show-input />
      </NTabPane>
    </NTabs>
  </main>
</template>

<style scoped lang="scss"></style>
