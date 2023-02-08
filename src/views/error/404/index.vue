<script setup lang="ts">
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"
import { useSiteMetaData } from "@/hooks"

const router = useRouter()

const { NotFound } = useSiteMetaData()

const navToHome = () => router.push("/")
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <NResult
      status="404"
      :title="NotFound.title"
      :description="NotFound.description"
    >
      <template #footer>
        <NButton
          type="primary"
          secondary
          @click="navToHome"
        >
          {{ NotFound.btnText }}
        </NButton>
      </template>
    </NResult>
  </main>
</template>
