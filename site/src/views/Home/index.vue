<script setup lang="ts">
import { useRouter } from "vue-router"
import { MagicResult } from "@/components"
import DBInstance from "@/database"

const router = useRouter()

const navToQuick = () => router.push("/quick")

DBInstance.open()
await DBInstance.historyData.add({
  text: "123",
  src: "123",
  createAt: "2022-03-01",
  updateAt: "2022-03-01"
})
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
