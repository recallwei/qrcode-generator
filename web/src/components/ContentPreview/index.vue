<script setup lang="ts">
import { setClipBoardText } from '@/utils'
import type { GeneratedQRCodeResult } from '@/types'

type Props = {
  userInputResult: GeneratedQRCodeResult
}

const props = defineProps<Props>()

const message = useMessage()

const copyContent = () => {
  const { content } = props.userInputResult
  if (!content) {
    message.error('复制失败，请先生成二维码')
    return
  }
  setClipBoardText(content)
  message.success('复制成功')
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <Transition name="content-preview-card-title-text">
      <template v-if="props.userInputResult.title">
        <NText class="text-center font-semibold">{{ props.userInputResult.title }}</NText>
      </template>
    </Transition>
    <div class="rounded-lg border-2 border-dashed border-gray-300 px-2 pt-2">
      <NScrollbar
        x-scrollable
        class="pb-2"
      >
        <NText class="whitespace-pre font-mono">
          {{ props.userInputResult.jsonContent }}
        </NText>
      </NScrollbar>
    </div>
    <div class="flex items-center justify-center pt-2">
      <NButton
        size="small"
        type="primary"
        strong
        secondary
        @click="() => copyContent()"
      >
        复制内容
      </NButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-preview-card-title-text-enter-active,
.content-preview-card-title-text-leave-active {
  transition: opacity 0.5s ease;
}

.content-preview-card-title-text-enter-from,
.content-preview-card-title-text-leave-to {
  opacity: 0;
}
</style>
