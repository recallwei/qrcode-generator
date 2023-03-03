<script setup lang="ts">
import { useRouter } from "vue-router"
import { MagicResult } from "@/components"

const router = useRouter()

const navToQuick = () => router.push("/quick")
</script>

<template>
  <main class="h-screen w-screen">
    <magic-result
      title="🚀正在努力开发中..."
      description="预计上线时间 2023/03/10"
      btn-text="开始"
      @click:btn="navToQuick"
    />
  </main>
</template>

<style scoped lang="scss"></style>
