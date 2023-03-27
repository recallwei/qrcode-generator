<script setup lang="ts">
import type { GeneratedQRCodeResult } from '@/types'
type Props = {
  data: GeneratedQRCodeResult
}
const props = defineProps<Props>()

const TITLE_DISPLAY_TEXT = '标题：'

const hackOpacity = ref(100)

watch(
  () => props.data,
  (cur, pre) => {
    console.log(cur, pre)
    hackOpacity.value = 0
    setTimeout(() => {
      hackOpacity.value = 100
    }, 300)
  }
  // { deep: true }
)
</script>

<template>
  <n-card
    embedded
    hoverable
    class="overflow-hidden"
  >
    <div class="flex flex-col space-y-2">
      <template v-if="props.data.title">
        <div class="font-semibold">{{ TITLE_DISPLAY_TEXT + props.data.title }}</div>
      </template>
      <div
        class="whitespace-pre rounded-lg border-2 border-dashed border-gray-300 px-2 pt-2"
        :style="{ opacity: hackOpacity }"
      >
        <n-scrollbar
          x-scrollable
          class="pb-2"
        >
          {{ props.data.jsonContent }}
        </n-scrollbar>
      </div>
    </div>
  </n-card>
</template>
