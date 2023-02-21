<script setup lang="ts">
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"

const router = useRouter()

const navToQuick = () => router.push("/quick")
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      status="info"
      title="正在开发中..."
      description="预计上线时间 xxxx/xx/xx"
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
  </main>
</template>

<style scoped lang="scss"></style>
