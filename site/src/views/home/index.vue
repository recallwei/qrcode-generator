<script setup lang="ts">
import { NResult } from "naive-ui"
import QRCodeManager from "@bruce/qrcode-manager"

const qrcode = QRCodeManager
console.log(await qrcode.generateQRCode("123"))

const test = async () => {
  throw new Error("Whoops!")
}
await test()
</script>

<template>
  <main class="absolute inset-0 bottom-28 m-auto flex items-center justify-center">
    <n-result
      status="info"
      title="正在开发中..."
      description="预计上线时间 xxxx/xx/xx"
    >
    </n-result>
  </main>
</template>

<style scoped lang="scss"></style>
