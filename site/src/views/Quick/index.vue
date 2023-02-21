<script setup lang="ts">
import { ref } from "vue"
import { NInput, NImage, NCard, NButton } from "naive-ui"

interface Config {
  textMaxLength: number
}

const config = ref<Config>({
  textMaxLength: 150
})
</script>

<template>
  <main class="flex gap-4">
    <n-card
      hoverable
      embedded
      content-style="padding: 12px 16px"
    >
      <div class="flex flex-col gap-3">
        <n-input
          type="textarea"
          :autosize="{
            minRows: 10,
            maxRows: 10
          }"
          :maxlength="config.textMaxLength"
          placeholder="请输入文字内容"
          clearable
          show-count
          loading
        />
        <div class="flex items-center justify-center">
          <n-button type="primary">生成二维码</n-button>
        </div>
      </div>
    </n-card>
    <n-card
      hoverable
      embedded
    >
      <n-image
        show-toolbar-tooltip
        width="100"
        src="https://aliyuncdn.antdv.com/vue.png"
      />
    </n-card>
  </main>
</template>

<style scoped lang="scss"></style>
