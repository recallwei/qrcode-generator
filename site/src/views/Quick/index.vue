<script setup lang="ts">
import { ref } from "vue"
import { NInput, NImage, NCard, NButton, useMessage } from "naive-ui"
import { useDebounceFn } from "@vueuse/core"
import QRCodeManager from "@bruce/qrcode-manager"
import type { ValidationStatus, WithUndefined } from "@/types"
import { copyText } from "@/utils"

type Config = {
  textMaxLength: number
}

const message = useMessage()

const config = ref<Config>({
  textMaxLength: 400
})

const userInput = ref("")
const userInputStatus = ref<WithUndefined<ValidationStatus>>(undefined)
const imgURL = ref("")
const generateQRCodeLoading = ref(false)

const onUserInput = () => {
  userInputStatus.value = undefined
}

const handleClickGenerateQRCodeBtn = useDebounceFn(async () => {
  try {
    if (!userInput.value) {
      throw new Error("文字内容不能为空！")
    }
    const qrcodeURL = await QRCodeManager.generateQRCode(userInput.value)
    imgURL.value = qrcodeURL
    message.success("生成二维码成功")
  } catch (error: any) {
    userInputStatus.value = "error"
    message.error(error.message)
    /**
     * 2023/2/23 Bruce Song <recall4056@gmail.com>
     * NOTE:
     * UX Related: Whether to remove the image if the QRCode fails to be generated.
     */
    // imgURL.value = ""
  }
  generateQRCodeLoading.value = false
}, 300)

const handleClickCopyBtn = () => {
  if (copyText(userInput.value)) {
    message.success("复制文字成功")
  } else {
    userInputStatus.value = "error"
    message.error("复制失败，没有输入文字内容！")
  }
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-[300px]">
      <n-card
        hoverable
        embedded
        class="h-full w-full"
      >
        <div class="flex h-full items-center justify-center">
          <n-image
            v-if="imgURL"
            class="bg-white p-2 shadow-md"
            show-toolbar-tooltip
            width="200"
            :src="imgURL"
          />
          <div
            v-else
            class="flex h-[200px] w-[200px] select-none items-center justify-center bg-white p-2 shadow-md"
          >
            此处预览生成的二维码
          </div>
        </div>
      </n-card>
    </div>

    <n-card
      hoverable
      embedded
      content-style="padding: 12px 16px"
    >
      <div class="flex flex-col gap-3">
        <n-input
          v-model:value="userInput"
          type="textarea"
          :autosize="{
            minRows: 10,
            maxRows: 10
          }"
          :maxlength="config.textMaxLength"
          :status="userInputStatus"
          placeholder="请输入文字内容"
          clearable
          show-count
          @input="onUserInput"
        />
        <div class="flex items-center justify-center gap-4">
          <n-button
            type="primary"
            strong
            secondary
            @click="($event) => handleClickCopyBtn()"
          >
            复制文字
          </n-button>
          <n-button
            type="primary"
            strong
            @click="($event) => handleClickGenerateQRCodeBtn()"
          >
            生成二维码
          </n-button>
        </div>
      </div>
    </n-card>
  </div>

  <!-- <div class="flex gap-4">
    <n-card
      hoverable
      embedded
    >
    </n-card>
  </div> -->
</template>

<style scoped lang="scss"></style>
