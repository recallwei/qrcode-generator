<script setup lang="ts">
import { ref, type Ref } from "vue"
import { NInput, NImage, NCard, NButton, NIcon, NText, useMessage } from "naive-ui"
import { Download as DownloadIcon } from "@vicons/fa"
import {
  RefreshFilled as ResetIcon,
  DeleteForeverOutlined as DeleteIcon,
  ContentCopyOutlined as CopyIcon
} from "@vicons/material"
import { useDebounceFn } from "@vueuse/core"
import { useObservable } from "@vueuse/rxjs"
import { liveQuery } from "dexie"
import QRCodeManager from "@package/qrcode-manager"
import { setClipBoardText, downloadFile, formatCurrentTime } from "@/utils"
import { useValidationStatus, useLoading } from "@/hooks"
import { IndexDBInstance } from "@/database"
import type { History } from "@/types"

type Config = {
  textMaxLength: number
}

const message = useMessage()
const [generateQRCodeLoading, generateQRCodeLoadingDispatcher] = useLoading()
const [userInputStatus, userInputStatusDispatcher] = useValidationStatus()

const config = ref<Config>({
  textMaxLength: 400
})

const historyList = useObservable(
  liveQuery(() => IndexDBInstance.history.reverse().toArray()) as any
) as Ref<History[]>

const userInput = ref("")
const imgURL = ref("")

const onUserInput = () => userInputStatusDispatcher.clear()

/**
 * @description Generate QRCode event
 */
const handleClickGenerateQRCodeBtn = useDebounceFn(async () => {
  /**
   * 2023/2/24 Bruce Song <recall4056@gmail.com>
   * NOTE:
   * When regenerate the QRCode, the previous image should be removed.
   */
  generateQRCodeLoadingDispatcher.loading()
  imgURL.value = ""
  try {
    if (!userInput.value) {
      throw new Error("文字内容不能为空")
    }
    const qrcodeURL = await QRCodeManager.generateQRCode(userInput.value)
    imgURL.value = qrcodeURL
    await IndexDBInstance.history.add({
      src: qrcodeURL,
      content: userInput.value,
      createAt: formatCurrentTime()
    })
    message.success("生成二维码成功")
  } catch (error: any) {
    userInputStatusDispatcher.setError()
    message.error(error.message)
    /**
     * 2023/2/23 Bruce Song <recall4056@gmail.com>
     * NOTE:
     * UX Related: Whether to remove the image if the QRCode fails to be generated.
     */
    // imgURL.value = ""
  }
  generateQRCodeLoadingDispatcher.loaded()
}, 300)

/**
 * @description Copy QRCode content event
 */
const handleClickCopyBtn = () => {
  if (!userInput.value) {
    userInputStatusDispatcher.setError()
    message.error("复制失败，没有输入文字内容")
    return
  }
  setClipBoardText(userInput.value)
  message.success("复制文字成功")
}

/**
 * @description Download QRCode event
 */
const handleClickDownloadBtn = () => {
  if (!imgURL.value) {
    message.error("没有生成二维码，无法下载")
    userInputStatusDispatcher.setError()
    return
  }
  downloadFile(imgURL.value, "qrcode.png")
}

/**
 * @description Reset QRCode event
 */
const handleClickResetBtn = () => {
  userInput.value = ""
  userInputStatusDispatcher.clear()
  imgURL.value = ""
  message.success("重置成功")
}

const handleDeleteHistoryItem = async (id?: number) => {
  try {
    if (!id) {
      throw new Error("删除失败，没有找到对应的历史记录")
    }
    await IndexDBInstance.history.delete(id)
    message.success("删除成功")
  } catch (error: any) {
    message.error(error.message || "删除失败")
  }
}
</script>

<template>
  <div class="mb-4 flex gap-4">
    <!-- QRCode Preview Section -->
    <div class="w-[300px]">
      <n-card
        hoverable
        embedded
        class="h-full w-full"
      >
        <div class="absolute right-1 top-1">
          <n-icon
            class="rounded-full hover:cursor-pointer hover:bg-slate-300 hover:shadow-md active:bg-slate-200"
            size="20"
            @click="($event) => handleClickResetBtn()"
          >
            <reset-icon />
          </n-icon>
        </div>
        <div class="flex h-full flex-col items-center justify-center gap-4">
          <transition
            name="img"
            mode="out-in"
          >
            <n-image
              v-if="imgURL"
              class="h-200[px] w-[200px] bg-white p-2 shadow-md"
              show-toolbar-tooltip
              :src="imgURL"
            />
            <div
              v-else
              class="flex h-[200px] w-[200px] select-none items-center justify-center bg-white p-2 shadow-md"
            >
              此处预览生成的二维码
            </div>
          </transition>
          <n-button
            type="primary"
            strong
            secondary
            @click="($event) => handleClickDownloadBtn()"
          >
            <template #icon>
              <n-icon size="14">
                <download-icon />
              </n-icon>
            </template>
            下载
          </n-button>
        </div>
      </n-card>
    </div>

    <!-- User Input Section -->
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
          :loading="generateQRCodeLoading"
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

  <!-- History Section -->
  <div
    class="mb-4 flex items-center justify-center border-b-[1px] border-b-[#18A058] pb-1 text-base"
  >
    <n-text type="primary"> 历史建码 </n-text>
  </div>
  <div class="flex gap-4">
    <div class="flex w-full flex-col items-start justify-center gap-6">
      <transition-group name="list">
        <template
          v-for="item in historyList"
          :key="item.id"
        >
          <n-card
            hoverable
            embedded
          >
            <div class="flex gap-4">
              <div class="flex w-[120px] flex-col items-center justify-center gap-1">
                <n-image
                  v-if="item.src"
                  class="h-120[px] w-full bg-white p-2 shadow-md"
                  show-toolbar-tooltip
                  :src="item.src"
                />
                <n-text class="text-center">{{ item.title }}</n-text>
              </div>
              <div class="flex grow flex-col justify-between">
                <div class="flex justify-between">
                  {{ item.content }}
                  <n-text> {{ `生成时间：${item.createAt}` }}</n-text>
                </div>
                <div class="flex items-center justify-end gap-4">
                  <n-button
                    size="small"
                    @click="($event) => {}"
                  >
                    <template #icon>
                      <n-icon size="14">
                        <copy-icon />
                      </n-icon>
                    </template>
                    复制
                  </n-button>
                  <n-button size="small">
                    <template #icon>
                      <n-icon size="14">
                        <download-icon />
                      </n-icon>
                    </template>
                    下载
                  </n-button>
                  <n-button
                    size="small"
                    @click="($event) => handleDeleteHistoryItem(item.id)"
                  >
                    <template #icon>
                      <n-icon size="20">
                        <delete-icon />
                      </n-icon>
                    </template>
                    删除
                  </n-button>
                </div>
              </div>
            </div>
          </n-card>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-enter-active,
.img-leave-active {
  transition: opacity 0.3s ease;
}
.img-enter-from,
.img-leave-to {
  opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
