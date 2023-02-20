<script setup lang="ts">
import { NInput, NImage, NCard } from "naive-ui"
</script>

<template>
  <main class="flex gap-4">
    <n-input
      type="textarea"
      maxlength="120"
      placeholder="请输入文字内容"
      clearable
      show-count
    />
    <n-card>
      <n-image
        show-toolbar-tooltip
        width="100"
        src="https://aliyuncdn.antdv.com/vue.png"
      />
    </n-card>
  </main>
</template>

<style scoped lang="scss"></style>
