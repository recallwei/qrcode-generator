<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton } from 'naive-ui'
import { siteMetaData } from '@/constants'

const { NotFoundInfo } = siteMetaData.ErrorPage

const router = useRouter()

const navToHome = () => router.push('/')
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      status="404"
      :title="NotFoundInfo.title"
      :description="NotFoundInfo.description"
    >
      <template #footer>
        <n-button
          type="primary"
          strong
          @click="navToHome"
        >
          {{ NotFoundInfo.btnText }}
        </n-button>
      </template>
    </n-result>
  </main>
</template>
