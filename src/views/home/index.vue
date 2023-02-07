<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMessage } from "naive-ui"
import { QRCode } from "@/modules"

const router = useRouter()

const message = useMessage()

const testJson = ref({
  type: 0,
  kccj: "特斯拉特斯拉",
  tfcj: "特斯拉特斯拉",
  model: "xxxxxx",
  batch: "xxxxxxxxxx",
  num: "xxxxxx",
  zgbh: "aaaaaaaaaaaaaaaaaaaa/bbbbbbbbbbbbbbbbbbbbbbb/ccccccccccccccccccccccc",
  grooveDepth: "xxxxxx",
  grooveModel: "xxxxxx",
  correct: "xxxxxx",
  remark: "aaaaaaaaaaaaaaaaaaaa/bbbbbbbbbbbbbbbbbbbbbbb/ccccccccccccccccccccccc"
})

testJson.value = ""
const img = ref("")

onMounted(async () => {
  try {
    const data = (await QRCode.generateQRCode(testJson.value)) as string
    console.log(data)
    img.value = data
  } catch (err: any) {
    message.error(err.message, { duration: 2000 })
    img.value = ""
  }
})

const navToCenter = () => {
  router.push("/center")
}
</script>

<template>
  <main>
    <div @click="navToCenter">首页</div>
    <img
      v-if="img"
      :src="img"
      width="200"
      height="200"
    />
  </main>
</template>

<style scoped lang="scss"></style>
