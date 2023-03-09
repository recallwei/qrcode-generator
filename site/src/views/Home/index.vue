<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { NResult, NButton } from "naive-ui"
import { siteMetaData } from "@/constants"

const { AppName, Favicon } = siteMetaData

const router = useRouter()

const navToQuick = () => router.push("/quick")

const notice = ref({
  title: "🍀二维码生成器",
  description: "版本：v1.0.0 - alpha.1"
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
        <template #icon>
          <img
            width="80"
            height="80"
            :src="Favicon"
            :alt="AppName"
          />
        </template>
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
