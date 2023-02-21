<script setup lang="ts">
import { useRouter } from "vue-router"
import { MagicResult } from "@/components"
import { siteMetaData } from "@/constants"

const { NotFoundInfo } = siteMetaData.ErrorPage

const router = useRouter()

const navToHome = () => router.push("/")
</script>

<template>
  <main>
    <magic-result
      status="404"
      :title="NotFoundInfo.title"
      :description="NotFoundInfo.description"
      :btn-text="NotFoundInfo.btnText"
      @click:btn="navToHome"
    />
  </main>
</template>

<style scoped lang="scss"></style>
