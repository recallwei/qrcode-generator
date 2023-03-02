<script setup lang="ts">
import { useRouter } from "vue-router"
import { MagicResult } from "@/components"

const router = useRouter()

const navToQuick = () => router.push("/quick")
</script>

<template>
  <main>
    <magic-result
      title="正在开发中..."
      description="预计上线时间 xxxx/xx/xx"
      btn-text="开始"
      @click:btn="navToQuick"
    />
  </main>
</template>

<style scoped lang="scss"></style>
