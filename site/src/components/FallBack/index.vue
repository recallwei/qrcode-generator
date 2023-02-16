<script setup lang="ts">
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"
import { siteMetaData } from "@/constants"

const router = useRouter()

const { FallBack } = siteMetaData.ErrorPage

const refresh = () => router.go(0)
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      status="error"
      :title="FallBack.title"
      :description="FallBack.description"
    >
      <template #footer>
        <n-button
          type="primary"
          secondary
          @click="refresh"
        >
          {{ FallBack.btnText }}
        </n-button>
      </template>
    </n-result>
  </main>
</template>
