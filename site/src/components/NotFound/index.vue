<script setup lang="ts">
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"
import { siteMetaData } from "@/constants"

const router = useRouter()

const { NotFound } = siteMetaData.ErrorPage

const navToHome = () => router.push("/")
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      status="404"
      :title="NotFound.title"
      :description="NotFound.description"
    >
      <template #footer>
        <n-button
          type="primary"
          secondary
          @click="navToHome"
        >
          {{ NotFound.btnText }}
        </n-button>
      </template>
    </n-result>
  </main>
</template>
