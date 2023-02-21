<script setup lang="ts">
import { useRouter } from "vue-router"
import { MagicResult } from "@/components"
import { siteMetaData } from "@/constants"

const { FallBackInfo } = siteMetaData.ErrorPage

const router = useRouter()

const refresh = () => router.go(0)
</script>

<template>
  <main>
    <magic-result
      status="error"
      :title="FallBackInfo.title"
      :description="FallBackInfo.description"
      :btn-text="FallBackInfo.btnText"
      @click:btn="refresh"
    />
  </main>
</template>

<style scoped lang="scss"></style>
