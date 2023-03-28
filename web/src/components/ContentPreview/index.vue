<script setup lang="ts">
import type { GeneratedQRCodeResult } from '@/types'

type Props = {
  data: GeneratedQRCodeResult
}

const props = defineProps<Props>()

const TITLE_DISPLAY_TEXT = '标题：'
</script>

<template>
  <div class="flex flex-col space-y-2">
    <Transition name="content-preview-card-title-text">
      <template v-if="props.data.title">
        <NText class="font-semibold">{{ TITLE_DISPLAY_TEXT + props.data.title }}</NText>
      </template>
    </Transition>
    <div class="rounded-lg border-2 border-dashed border-gray-300 px-2 pt-2">
      <NScrollbar
        x-scrollable
        class="pb-2"
      >
        <NText class="whitespace-pre font-mono">
          {{ props.data.jsonContent }}
        </NText>
      </NScrollbar>
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
