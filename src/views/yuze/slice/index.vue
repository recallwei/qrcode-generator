<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const navToHome = () => {
  router.push("/")
}
</script>

<template>
  <main>
    <div @click="navToHome">切片</div>
  </main>
</template>

<style scoped lang="scss"></style>
