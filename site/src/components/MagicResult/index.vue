<script setup lang="ts">
import { NResult, NButton } from "naive-ui"

type Props = {
  status?: "500" | "error" | "info" | "success" | "warning" | "404" | "403" | "418"
  title: string
  description: string
  btnText: string
  btnFc?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  status: "info",
  btnFc: () => {}
})

const emit = defineEmits(["click:btn"])

const onClickBtn = () => {
  props.btnFc()
  emit("click:btn")
}
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      :status="props.status"
      :title="props.title"
      :description="props.description"
    >
      <template #footer>
        <n-button
          type="primary"
          secondary
          @click="onClickBtn"
        >
          {{ props.btnText }}
        </n-button>
      </template>
    </n-result>
  </main>
</template>
