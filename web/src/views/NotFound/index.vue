<script setup lang="ts">
import { siteMetaData } from '@/constants'

const { NotFoundInfo } = siteMetaData.ErrorPage

const router = useRouter()

const navToHome = () => router.push('/')
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <NResult
      status="404"
      :title="NotFoundInfo.title"
      :description="NotFoundInfo.description"
    >
      <template #footer>
        <NButton
          type="primary"
          strong
          @click="navToHome"
        >
          {{ NotFoundInfo.btnText }}
        </NButton>
      </template>
    </NResult>
  </main>
</template>
