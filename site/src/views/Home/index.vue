<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"

const router = useRouter()

const navToQuick = () => router.push("/quick")

const notice = ref({
  title: "🚀正在开发中...",
  description: "预计上线时间 2023/03/10"
})
</script>

<template>
  <main class="h-screen w-screen">
    <div class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
      <n-result
        status="info"
        :title="notice.title"
        :description="notice.description"
      >
        <template #footer>
          <n-button
            type="primary"
            secondary
            @click="navToQuick"
          >
            开始
          </n-button>
        </template>
      </n-result>
    </div>
  </main>
</template>
