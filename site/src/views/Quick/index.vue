<script setup lang="ts">
import { ref, type Ref } from "vue"
import {
  NInput,
  NImage,
  NCard,
  NButton,
  NIcon,
  NText,
  NTooltip,
  NPopconfirm,
  useMessage
} from "naive-ui"
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
import {
  setClipBoardText,
  downloadFile,
  formatCurrentTime,
  withPlaceholder,
  formatTime
} from "@/utils"
import { useValidationStatus, useLoading } from "@/hooks"
import { IndexDBInstance } from "@/database"
import type { History } from "@/types"

type Config = {
  titleMaxLength: number
  contentMaxLength: number
}

const message = useMessage()
const [generateQRCodeLoading, generateQRCodeLoadingDispatcher] = useLoading()
const [userInputStatus, userInputStatusDispatcher] = useValidationStatus()

const config = ref<Config>({
  titleMaxLength: 16,
  contentMaxLength: 400
})

const historyList = useObservable(
  liveQuery(() => IndexDBInstance.history.reverse().toArray()) as any
) as Ref<History[]>

const userInput = ref({
  title: "",
  content: ""
})
const imgURL = ref("")

const focusedHistoryItemIndex = ref<number | null | undefined>(null)

const onUserInput = () => userInputStatusDispatcher.clear()

const handleClickGenerateQRCodeBtn = useDebounceFn(async () => {
  /**
   * 2023/2/24 Bruce Song <recall4056@gmail.com>
   * NOTE:
   * When regenerate the QRCode, the previous image should be removed.
   */
  generateQRCodeLoadingDispatcher.loading()
  imgURL.value = ""
  try {
    if (!userInput.value.content) {
      throw new Error("文字内容不能为空")
    }
    const qrcodeURL = await QRCodeManager.generateQRCode(userInput.value.content)
    imgURL.value = qrcodeURL
    const historyModel: History = {
      src: qrcodeURL,
      content: userInput.value.content,
      createAt: formatCurrentTime()
    }
    if (userInput.value.title) {
      historyModel.title = userInput.value.title
    }
    await IndexDBInstance.history.add(historyModel)
    message.success("生成二维码成功")
  } catch (error: any) {
    userInputStatusDispatcher.setError()
    message.error(error.message)
    /**
     * 2023/2/23 Bruce Song <recall4056@gmail.com>
     * NOTE:
     * UX Related: Whether to remove the image if the QRCode fails to be generated.
     */
    imgURL.value = ""
  }
  generateQRCodeLoadingDispatcher.loaded()
}, 300)

const handleClickCopyBtn = () => {
  if (!userInput.value.content) {
    userInputStatusDispatcher.setError()
    message.error("复制失败，没有输入文字内容")
    return
  }
  setClipBoardText(userInput.value.content)
  message.success("复制成功")
}

const handleClickDownloadBtn = () => {
  if (!imgURL.value) {
    message.error("没有生成二维码，无法下载")
    userInputStatusDispatcher.setError()
    return
  }
  downloadFile(
    imgURL.value,
    userInput.value.content ? `${userInput.value.content}.png` : "qrcode.png"
  )
}

const handleClickResetBtn = () => {
  userInput.value.title = ""
  userInput.value.content = ""
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

const handleCopyByItem = (item: History, key: keyof History) => {
  if (!item[key]) {
    message.error("复制失败")
    return
  }
  setClipBoardText(item[key] as string)
  message.success("复制成功")
}

const handleDownloadItem = (item: History) => {
  if (!item.src) {
    message.error("下载失败")
    return
  }
  downloadFile(item.src, item.title ? `${item.title}.png` : "qrcode.png")
}

const changeFocusedItem = (item: History) => {
  focusedHistoryItemIndex.value = item.id
}

const clearFocusedItem = () => {
  focusedHistoryItemIndex.value = null
}

const clearHistoryData = async () => {
  await IndexDBInstance.history.clear()
  message.success("已清空历史数据")
}
</script>

<template>
  <main>
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
            v-model:value="userInput.title"
            :maxlength="config.titleMaxLength"
            clearable
            show-count
            placeholder="请输入标题【可选】，用于检索生成的二维码或作为下载的文件名"
          />
          <n-input
            v-model:value="userInput.content"
            type="textarea"
            :autosize="{
              minRows: 10,
              maxRows: 10
            }"
            :maxlength="config.contentMaxLength"
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
    <template v-if="historyList?.length > 0">
      <div class="relative flex items-center justify-center py-4 text-sm">
        <n-text type="primary"> 历史建码 </n-text>
        <div class="absolute right-0 bottom-0 top-0 m-auto flex items-center">
          <n-popconfirm
            :positive-button-props="{ size: 'small' }"
            :negative-button-props="{ size: 'small' }"
            @positive-click="clearHistoryData"
          >
            <template #trigger>
              <n-button size="small">清空</n-button>
            </template>
            确认清空所有历史记录？
          </n-popconfirm>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex w-full flex-col items-start justify-center gap-4">
          <transition-group name="history-list">
            <n-card
              v-for="item in historyList"
              :key="item.id"
              hoverable
              embedded
              @mouseenter.passive="($event) => changeFocusedItem(item)"
              @mouseleave.passive="($event) => clearFocusedItem()"
            >
              <div class="flex gap-4">
                <div class="flex w-[120px] shrink-0 flex-col items-center justify-center gap-1">
                  <n-image
                    class="h-120[px] w-full bg-white p-2 shadow-md"
                    show-toolbar-tooltip
                    :src="item.src"
                  />
                  <n-tooltip
                    placement="bottom"
                    trigger="hover"
                  >
                    <template #trigger>
                      <n-text
                        class="cursor-pointer text-center"
                        @click="($event) => handleCopyByItem(item, 'title')"
                      >
                        {{ item.title }}
                      </n-text>
                    </template>
                    {{ item.title }}
                  </n-tooltip>
                </div>
                <div class="flex grow flex-col justify-between gap-1">
                  <div>
                    <n-tooltip
                      placement="bottom"
                      trigger="hover"
                    >
                      <template #trigger>
                        <n-text
                          class="hover:cursor-pointer"
                          @click="($event) => handleCopyByItem(item, 'content')"
                        >
                          {{ item.content }}
                        </n-text>
                      </template>
                      {{ item.content }}
                    </n-tooltip>
                  </div>
                  <div class="text-xs">
                    <n-text class="select-none"> 生成时间：</n-text>
                    <n-tooltip
                      placement="bottom"
                      trigger="hover"
                    >
                      <template #trigger>
                        <n-text class="cursor-pointer">
                          {{ withPlaceholder(formatTime(item.createAt as string, "MM-DD hh:mm")) }}
                        </n-text>
                      </template>
                      {{ withPlaceholder(item.createAt as string) }}
                    </n-tooltip>
                  </div>
                  <template v-if="focusedHistoryItemIndex === item.id">
                    <transition name="operation">
                      <div class="absolute right-4 bottom-4 flex items-center gap-4">
                        <n-button
                          size="small"
                          tertiary
                          @click="($event) => handleCopyByItem(item, 'content')"
                        >
                          <template #icon>
                            <n-icon size="14">
                              <copy-icon />
                            </n-icon>
                          </template>
                          复制
                        </n-button>
                        <n-button
                          size="small"
                          tertiary
                          @click="($event) => handleDownloadItem(item)"
                        >
                          <template #icon>
                            <n-icon size="14">
                              <download-icon />
                            </n-icon>
                          </template>
                          下载
                        </n-button>
                        <n-button
                          size="small"
                          type="error"
                          tertiary
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
                    </transition>
                  </template>
                </div>
              </div>
            </n-card>
          </transition-group>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
.img-enter-active,
.img-leave-active {
  transition: all 0.3s ease;
}
.img-enter-from,
.img-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.history-list-move,
.history-list-enter-active,
.history-list-leave-active {
  transition: all 0.3s ease;
}
.history-list-enter-from,
.history-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.history-list-leave-active {
  position: absolute;
}

.operation-enter-active,
.operation-leave-active {
  transition: all 0.3s ease;
}
.operation-enter-from,
.operation-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}
</style>
