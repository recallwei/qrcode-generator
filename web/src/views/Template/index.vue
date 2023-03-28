<script setup lang="ts">
import { SearchOutlined as SearchIcon, FileDownloadOutlined as DownloadIcon } from '@vicons/material'
import type {
  Config,
  CustomField,
  CustomPropertyFormItem,
  SelectorOption,
  WithNull,
  GeneratedQRCodeResult
} from '@/types'
import { IndexedDBInstance } from '@/database'
import { downloadFile } from '@/utils'

const configOptions = useObservable(
  liveQuery(() =>
    IndexedDBInstance.config.toArray((array) =>
      array.map((item) => ({
        label: item.name,
        value: item.id,
        data: item
      }))
    )
  ) as any
) as Ref<SelectorOption<Config>[]>

const message = useMessage()

/**
 * 2023/3/9 Bruce Song <recall4056@gmail.com>
 * NOTE:
 * Get template options by selecting config. Maybe caused error due to the changes of config.
 */
const templateOptions = ref<SelectorOption<CustomField>[]>([])
const selectedConfigId = ref(null)
const selectedTemplateName = ref(null)
const templateForm = ref<WithNull<CustomPropertyFormItem[]>>(null)
const templateFormCardRef = ref<any>(null)

const userInputResult = ref<GeneratedQRCodeResult>({
  src: '',
  title: '',
  content: '',
  jsonContent: null
})

const showSignal = ref({
  configSelector: false,
  templateSelector: false
})

const clearTemplateForm = () => {
  templateForm.value = null
}

const deleteConfig = async () => {
  const currentId = selectedConfigId.value
  try {
    if (!currentId) {
      throw new Error()
    }
    selectedConfigId.value = null
    selectedTemplateName.value = null
    templateOptions.value = []
    clearTemplateForm()
    templateFormCardRef.value?.handleReset()
    await IndexedDBInstance.config.delete(currentId)
    message.success('删除成功')
  } catch {
    message.error('删除失败')
  }
}

const selectConfig = (_: any, option: SelectorOption<Config>) => {
  const { data } = option
  selectedTemplateName.value = null
  clearTemplateForm()
  templateFormCardRef.value?.handleReset()
  templateOptions.value =
    data.customFields?.map((item: CustomField) => ({
      label: item.name,
      value: item.name,
      data: item
    })) || []
}

const clearSelectedConfig = () => {
  selectedConfigId.value = null
  selectedTemplateName.value = null
  templateOptions.value = []
  clearTemplateForm()
  templateFormCardRef.value?.handleReset()
}

const selectTemplate = (_: any, option: SelectorOption<CustomField>) => {
  const { data } = option
  templateForm.value = data.customProperties.map((customProperty) => ({
    ...customProperty,
    value: customProperty.valueType === 'number' ? 0 : ''
  }))
}

const clearSelectedTemplate = () => {
  selectedTemplateName.value = null
  clearTemplateForm()
  templateFormCardRef.value?.handleReset()
}

const uploadConfigValidation = async ({ file }: { file: UploadFileInfo }) => {
  const fileNameWithoutSuffix = file.name.split('.')[0]
  const repeated = (await IndexedDBInstance.config.where('name').equalsIgnoreCase(fileNameWithoutSuffix).count()) > 0
  if (repeated) {
    message.error('无法导入重名文件，若要替换配置文件，请尝试删除旧文件')
    return false
  }
  return true
}

const uploadConfig = ({ file }: { file: UploadFileInfo }) => {
  const fileReader = new FileReader()
  fileReader.onload = async () => {
    try {
      const json = JSON.parse(fileReader.result as string)
      message.success('导入配置文件成功')
      await IndexedDBInstance.config.add(json)
    } catch {
      message.error('导入配置文件失败，文件内容格式存在问题')
    }
  }
  fileReader.readAsText(file.file as any)
  return file
}

const downloadConfig = async () => {
  if (!selectedConfigId.value) {
    message.error('请先选择配置文件')
    return
  }
  const config = await IndexedDBInstance.config.get(selectedConfigId.value)
  if (!config) {
    message.error('配置文件不存在')
    return
  }
  const { name, description, customFields } = config
  const configData = { name, description, customFields }
  message.loading('正在下载配置文件')
  const jsonString = JSON.stringify(configData)
  const jsonDataURL = `data:,${jsonString}`
  downloadFile(jsonDataURL, `${configData.name}.json`)
  await nextTick()
  message.destroyAll()
  message.success('配置文件下载成功')
}

const downloadQRCode = () => {
  if (!userInputResult.value.src) {
    message.error('没有生成二维码，无法下载')
    return
  }
  downloadFile(
    userInputResult.value.src,
    userInputResult.value.title ? `${userInputResult.value.title}.png` : 'qrcode.png'
  )
}

const onGenerateQRCode = (event: GeneratedQRCodeResult) => {
  userInputResult.value = event
}

const onReset = (event: GeneratedQRCodeResult) => {
  userInputResult.value = event
  templateForm.value =
    templateForm.value?.map((customProperty) => ({
      ...customProperty,
      value: customProperty.valueType === 'number' ? 0 : ''
    })) ?? null
  message.success('重置成功')
}
</script>

<template>
  <main class="flex flex-col space-y-4">
    <section>
      <NCard
        embedded
        hoverable
      >
        <NSpace
          vertical
          size="large"
        >
          <NSpace
            align="center"
            size="large"
          >
            配置
            <NSelect
              v-model:value="selectedConfigId"
              v-model:show="showSignal.configSelector"
              filterable
              clearable
              placeholder="请选择配置"
              :options="configOptions"
              @clear="clearSelectedConfig"
              @update:value="selectConfig"
            >
              <template
                v-if="showSignal.configSelector"
                #arrow
              >
                <SearchIcon />
              </template>
              <template #empty> 请先导入配置 </template>
            </NSelect>

            <NUpload
              accept="application/json"
              :show-file-list="false"
              :custom-request="(params) => params.onFinish()"
              @before-upload="uploadConfigValidation"
              @finish="uploadConfig"
            >
              <NButton
                size="small"
                type="primary"
                strong
                secondary
              >
                导入配置
              </NButton>
            </NUpload>

            <template v-if="selectedConfigId">
              <NButton
                size="small"
                strong
                secondary
                @click="() => downloadConfig()"
              >
                导出配置
              </NButton>

              <NButton
                size="small"
                type="error"
                strong
                secondary
                @click="() => deleteConfig()"
              >
                删除配置
              </NButton>
            </template>
          </NSpace>

          <NSpace
            align="center"
            size="large"
          >
            模板
            <NSelect
              v-model:value="selectedTemplateName"
              v-model:show="showSignal.templateSelector"
              filterable
              clearable
              placeholder="请选择模板"
              :options="templateOptions"
              @clear="clearSelectedTemplate"
              @update:value="selectTemplate"
            >
              <template
                v-if="showSignal.templateSelector"
                #arrow
              >
                <SearchIcon />
              </template>
              <template #empty> 请先选择配置 </template>
            </NSelect>
          </NSpace>
        </NSpace>
      </NCard>
    </section>

    <div
      v-if="templateForm"
      class="flex w-full space-x-4"
    >
      <!-- QRCode Preview Section -->
      <div>
        <NCard
          embedded
          hoverable
        >
          <div class="flex h-fit w-fit flex-col items-center justify-center space-y-4">
            <transition
              name="img"
              mode="out-in"
            >
              <NImage
                v-if="userInputResult.src"
                class="h-200[px] w-[200px] p-2 shadow-md"
                show-toolbar-tooltip
                :src="userInputResult.src"
              />
              <div
                v-else
                class="flex h-[200px] w-[200px] select-none items-center justify-center p-2 shadow-md"
              >
                此处预览生成的二维码
              </div>
            </transition>
            <NButton
              type="primary"
              strong
              secondary
              @click="() => downloadQRCode()"
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

      <template v-if="templateForm">
        <section class="min-w-[500px]">
          <NCard
            embedded
            hoverable
            class="h-full"
          >
            <TemplateForm
              ref="templateFormCardRef"
              :template-form="templateForm"
              :user-input-result="userInputResult"
              @generate="(event) => onGenerateQRCode(event)"
              @reset="(event) => onReset(event)"
            />
          </NCard>
        </section>
      </template>

      <section class="h-fit w-full">
        <transition name="content-preview-card">
          <template v-if="userInputResult.content">
            <NCard
              embedded
              hoverable
              class="overflow-hidden"
            >
              <ContentPreview :data="userInputResult" />
            </NCard>
          </template>
        </transition>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.content-preview-card-enter-active,
.content-preview-card-leave-active {
  transition: opacity 0.5s ease;
}

.content-preview-card-enter-from,
.content-preview-card-leave-to {
  opacity: 0;
}
</style>
