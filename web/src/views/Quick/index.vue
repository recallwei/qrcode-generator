<script setup lang="ts">
import {
  FileDownloadOutlined as DownloadIcon,
  RefreshFilled as ResetIcon,
  DeleteForeverOutlined as DeleteIcon,
  ContentCopyOutlined as CopyIcon
} from '@vicons/material'
import QRCodeManager from '@package/qrcode-manager'
import { setClipBoardText, downloadFile, formatCurrentTime, withPlaceholder, formatTime } from '@/utils'
import { useValidationStatus, useLoading } from '@/hooks'
import { IndexedDBInstance } from '@/database'
import type { History } from '@/types'

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

const historyList = useObservable(liveQuery(() => IndexedDBInstance.history.reverse().toArray()) as any) as Ref<
  History[]
>

const userInput = ref({
  title: '',
  content: ''
})
const imgURL = ref('')

const focusedHistoryItemIndex = ref<number | null | undefined>(null)

const onUserInput = () => userInputStatusDispatcher.clear()

const handleGenerateQRCode = useDebounceFn(async () => {
  generateQRCodeLoadingDispatcher.loading()
  imgURL.value = ''
  try {
    if (!userInput.value.content) {
      throw new Error('文字内容不能为空')
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
    if ((await IndexedDBInstance.history.count()) >= 400) {
      throw new Error('可生成的二维码数量达到上限，无法继续生成，请删除历史记录后再试')
    }
    await IndexedDBInstance.history.add(historyModel)
    message.success('生成二维码成功')
  } catch (error: any) {
    userInputStatusDispatcher.setError()
    message.error(error.message)
    imgURL.value = ''
  }
  generateQRCodeLoadingDispatcher.loaded()
}, 300)

const handleCopyContent = () => {
  if (!userInput.value.content) {
    userInputStatusDispatcher.setError()
    message.error('复制失败，没有输入文字内容')
    return
  }
  setClipBoardText(userInput.value.content)
  message.success('复制成功')
}

const handleDownloadQRCode = () => {
  if (!imgURL.value) {
    message.error('没有生成二维码，无法下载')
    userInputStatusDispatcher.setError()
    return
  }
  downloadFile(imgURL.value, userInput.value.title ? `${userInput.value.title}.png` : 'qrcode.png')
}

const handleReset = () => {
  userInput.value.title = ''
  userInput.value.content = ''
  userInputStatusDispatcher.clear()
  imgURL.value = ''
  message.success('重置成功')
}

const handleDeleteHistoryRecord = async (id?: number) => {
  try {
    if (!id) {
      throw new Error('删除失败，没有找到对应的历史记录')
    }
    await IndexedDBInstance.history.delete(id)
    message.success('删除成功')
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const handleCopyByHistoryRecord = (item: History, key: keyof History) => {
  if (!item[key]) {
    message.error('复制失败')
    return
  }
  setClipBoardText(item[key] as string)
  message.success('复制成功')
}

const handleDownloadByHistoryRecord = (item: History) => {
  if (!item.src) {
    message.error('下载失败')
    return
  }
  downloadFile(item.src, item.title ? `${item.title}.png` : 'qrcode.png')
}

const changeFocusedHistoryRecord = (item: History) => {
  focusedHistoryItemIndex.value = item.id
}

const clearFocusedHistoryRecord = () => {
  focusedHistoryItemIndex.value = null
}

const clearAllHistoryRecord = async () => {
  await IndexedDBInstance.history.clear()
  message.success('已清空历史数据')
}
</script>

<template>
  <main>
    <div class="mb-4 flex space-x-4">
      <!-- QRCode Preview Section -->
      <div class="w-[300px]">
        <NCard
          class="h-full w-full"
          embedded
          hoverable
        >
          <div class="absolute right-1 top-1">
            <NIcon
              class="rounded-full hover:cursor-pointer hover:bg-slate-300 hover:shadow-md active:bg-slate-200"
              size="20"
              @click="() => handleReset()"
            >
              <ResetIcon />
            </NIcon>
          </div>
          <div class="flex h-full flex-col items-center justify-center space-y-4">
            <Transition
              name="img"
              mode="out-in"
            >
              <NImage
                v-if="imgURL"
                class="h-200[px] w-[200px] p-2 shadow-md"
                show-toolbar-tooltip
                :src="imgURL"
              />
              <div
                v-else
                class="flex h-[200px] w-[200px] select-none items-center justify-center p-2 shadow-md"
              >
                此处预览生成的二维码
              </div>
            </Transition>
            <NButton
              type="primary"
              strong
              secondary
              @click="() => handleDownloadQRCode()"
            >
              <template #icon>
                <NIcon size="20">
                  <DownloadIcon />
                </NIcon>
              </template>
              下载
            </NButton>
          </div>
        </NCard>
      </div>

      <!-- User Input Section -->
      <NCard
        embedded
        hoverable
        content-style="padding: 12px 16px"
      >
        <div class="flex flex-col space-y-3">
          <NInput
            v-model:value="userInput.title"
            type="text"
            :maxlength="config.titleMaxLength"
            clearable
            show-count
            placeholder="请输入标题【可选】，可用于检索生成的二维码或作为下载的文件名"
          />
          <NInput
            v-model:value="userInput.content"
            type="textarea"
            :autosize="{
              minRows: 8,
              maxRows: 8
            }"
            :maxlength="config.contentMaxLength"
            :status="userInputStatus"
            :loading="generateQRCodeLoading"
            clearable
            show-count
            placeholder="请输入文字内容"
            @input="onUserInput"
          />
          <div class="flex items-center justify-center space-x-4">
            <NButton
              type="primary"
              strong
              secondary
              @click="() => handleCopyContent()"
            >
              复制文字
            </NButton>
            <NButton
              type="primary"
              strong
              @click="() => handleGenerateQRCode()"
            >
              生成二维码
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- History Section -->
    <template v-if="historyList?.length > 0">
      <div class="relative flex items-center justify-center py-4 text-sm">
        <NText type="primary"> 历史建码 </NText>
        <div class="absolute right-0 bottom-0 top-0 m-auto flex items-center">
          <NPopconfirm
            :positive-button-props="{ size: 'small' }"
            :negative-button-props="{ size: 'small' }"
            @positive-click="clearAllHistoryRecord"
          >
            <template #trigger>
              <NButton size="small">清空</NButton>
            </template>
            确认清空所有历史记录？
          </NPopconfirm>
        </div>
      </div>
      <div class="flex">
        <div class="flex w-full flex-col items-start justify-center space-y-4">
          <TransitionGroup name="history-list">
            <NCard
              v-for="item in historyList"
              :key="item.id"
              embedded
              hoverable
              @mouseenter.passive="() => changeFocusedHistoryRecord(item)"
              @mouseleave.passive="() => clearFocusedHistoryRecord()"
            >
              <div class="flex space-x-4">
                <div class="flex w-[120px] shrink-0 flex-col items-center justify-center space-y-2">
                  <NImage
                    class="h-120[px] w-full bg-white p-2 shadow-md"
                    show-toolbar-tooltip
                    :src="item.src"
                  />
                  <template v-if="item.title">
                    <NTooltip
                      placement="bottom"
                      trigger="hover"
                    >
                      <template #trigger>
                        <NText
                          class="cursor-pointer text-center"
                          @click="() => handleCopyByHistoryRecord(item, 'title')"
                        >
                          {{ item.title }}
                        </NText>
                      </template>
                      {{ item.title }}
                    </NTooltip>
                  </template>
                </div>
                <div class="flex grow flex-col justify-between space-y-1">
                  <NTooltip
                    placement="bottom"
                    trigger="hover"
                    style="max-width: 800px"
                  >
                    <template #trigger>
                      <NText
                        class="hover:cursor-pointer"
                        @click="() => handleCopyByHistoryRecord(item, 'content')"
                      >
                        {{ item.content }}
                      </NText>
                    </template>
                    {{ item.content }}
                  </NTooltip>
                  <div class="text-xs">
                    <NText class="select-none"> 生成时间：</NText>
                    <NTooltip
                      placement="bottom"
                      trigger="hover"
                    >
                      <template #trigger>
                        <NText class="cursor-pointer">
                          {{ withPlaceholder(formatTime(item.createAt as string, 'MM-DD hh:mm')) }}
                        </NText>
                      </template>
                      {{ withPlaceholder(item.createAt as string) }}
                    </NTooltip>
                  </div>
                  <Transition name="operation">
                    <template v-if="focusedHistoryItemIndex === item.id">
                      <div class="absolute right-4 bottom-4 flex items-center space-x-4">
                        <NButton
                          size="small"
                          tertiary
                          @click="() => handleCopyByHistoryRecord(item, 'content')"
                        >
                          <template #icon>
                            <NIcon size="14">
                              <CopyIcon />
                            </NIcon>
                          </template>
                          复制
                        </NButton>
                        <NButton
                          size="small"
                          tertiary
                          @click="() => handleDownloadByHistoryRecord(item)"
                        >
                          <template #icon>
                            <NIcon size="14">
                              <DownloadIcon />
                            </NIcon>
                          </template>
                          下载
                        </NButton>
                        <NButton
                          size="small"
                          type="error"
                          tertiary
                          @click="() => handleDeleteHistoryRecord(item.id)"
                        >
                          <template #icon>
                            <NIcon size="20">
                              <DeleteIcon />
                            </NIcon>
                          </template>
                          删除
                        </NButton>
                      </div>
                    </template>
                  </Transition>
                </div>
              </div>
            </NCard>
          </TransitionGroup>
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
}
.operation-enter-from {
  transform: translateX(-500px);
}
</style>
