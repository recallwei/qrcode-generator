<script setup lang="ts">
import {
  SearchOutlined as SearchIcon,
  FileDownloadOutlined as DownloadIcon,
  RefreshFilled as ResetIcon
} from '@vicons/material'
import QRCodeManager from '@package/qrcode-manager'
import type { Config, CustomField, SelectorOption, WithNull, History, GeneratedQRCodeResult } from '@/types'
import { IndexedDBInstance } from '@/database'
import { formatCurrentTime, downloadFile, setClipBoardText } from '@/utils'
import type { TemplateForm } from './private/types'

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

/**
 * 2023/3/9 Bruce Song <recall4056@gmail.com>
 * NOTE:
 * Get template options by selecting config. Maybe caused error due to the changes of config.
 */
const templateOptions = ref<SelectorOption<CustomField>[]>([])

const message = useMessage()

const selectedConfigId = ref(null)
const selectedTemplateName = ref(null)
const templateForm = ref<WithNull<TemplateForm[]>>(null)
const templateFormRef = ref<FormInst | null>(null)

const imgURL = ref('')
const userInputTitle = ref('')
const userInputResult = ref<GeneratedQRCodeResult>({
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

const clearUserInputRelated = () => {
  userInputTitle.value = ''
  userInputResult.value.title = ''
  userInputResult.value.content = ''
  userInputResult.value.jsonContent = null
  imgURL.value = ''
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
    clearUserInputRelated()
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
  clearUserInputRelated()
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
  clearUserInputRelated()
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
  clearUserInputRelated()
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

const generateQRCode = () => {
  templateFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('内容填写不完整')
    } else {
      const jsonContent: Record<string, any> = {}
      templateForm.value?.forEach((customProperty) => {
        if (customProperty.value) {
          jsonContent[customProperty.keyCode] = customProperty.value
        }
      })
      const stringifiedJSON = JSON.stringify(jsonContent)
      userInputResult.value.title = userInputTitle.value
      userInputResult.value.content = stringifiedJSON
      userInputResult.value.jsonContent = jsonContent
      try {
        const qrcodeURL = await QRCodeManager.generateQRCode(stringifiedJSON)
        imgURL.value = qrcodeURL
        const historyModel: History = {
          src: qrcodeURL,
          content: stringifiedJSON,
          jsonContent,
          createAt: formatCurrentTime()
        }
        if (userInputResult.value.title) {
          historyModel.title = userInputResult.value.title
        }
        if ((await IndexedDBInstance.history.count()) >= 400) {
          throw new Error('可生成的二维码数量达到上限，无法继续生成，请删除历史记录后再试')
        }
        await IndexedDBInstance.history.add(historyModel)
        message.success('生成二维码成功')
      } catch (error: any) {
        message.error(error.message)
      }
    }
  })
}

const downloadQRCode = () => {
  if (!imgURL.value) {
    message.error('没有生成二维码，无法下载')
    return
  }
  downloadFile(imgURL.value, userInputResult.value.title ? `${userInputResult.value.title}.png` : 'qrcode.png')
}

const copyContent = () => {
  if (!userInputResult.value.content) {
    message.error('复制失败，请先生成二维码')
    return
  }
  setClipBoardText(userInputResult.value.content)
  message.success('复制成功')
}

const handleReset = () => {
  clearUserInputRelated()
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
          <div class="absolute right-1 top-1">
            <NIcon
              class="rounded-full hover:cursor-pointer hover:bg-slate-300 hover:shadow-md active:bg-slate-200"
              size="20"
              @click="() => handleReset()"
            >
              <ResetIcon />
            </NIcon>
          </div>
          <div class="flex h-fit w-fit flex-col items-center justify-center space-y-4">
            <transition
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

      <!-- Template Form Section -->
      <div>
        <NCard
          embedded
          hoverable
          class="h-full"
        >
          <div class="flex h-full min-w-[400px] flex-col justify-between">
            <NForm
              ref="templateFormRef"
              :model="templateForm"
              label-width="auto"
              label-align="left"
              label-placement="left"
              require-mark-placement="right-hanging"
            >
              <NFormItem label="标题">
                <NInput
                  v-model:value="userInputTitle"
                  type="text"
                  :maxlength="16"
                  clearable
                  show-count
                  placeholder="请输入标题【可选】"
                />
              </NFormItem>

              <template
                v-for="(customProperty, customPropertyIndex) in templateForm"
                :key="customPropertyIndex"
              >
                <NFormItem
                  :label="customProperty.keyName"
                  :path="`[${customPropertyIndex}].value`"
                  :rule="{
                    required: customProperty.require,
                    message: '请输入' + customProperty.keyName,
                    trigger: ['input', 'blur'],
                    type: customProperty.valueType
                  }"
                >
                  <template v-if="customProperty.valueType === 'string'">
                    <NInput
                      v-model:value="customProperty.value"
                      type="text"
                      :maxlength="
                        customProperty.stringOptions?.enableLengthLimit
                          ? customProperty.stringOptions.lengthLimit
                          : undefined
                      "
                      clearable
                      show-count
                      placeholder="请输入内容"
                    />
                  </template>
                  <template v-if="customProperty.valueType === 'number'">
                    <NInput-number
                      v-model:value="customProperty.value"
                      :min="customProperty.numberOptions?.enableRangeLimit ? customProperty.numberOptions?.min : 0"
                      :max="
                        customProperty.numberOptions?.enableRangeLimit ? customProperty.numberOptions?.max : undefined
                      "
                      clearable
                      show-count
                      placeholder="请输入内容"
                    />
                  </template>
                </NFormItem>
              </template>
            </NForm>

            <NSpace align="center">
              <NButton
                size="small"
                type="primary"
                strong
                secondary
                @click="() => copyContent()"
              >
                复制内容
              </NButton>
              <NButton
                size="small"
                type="primary"
                strong
                @click="() => generateQRCode()"
              >
                生成二维码
              </NButton>
            </NSpace>
          </div>
        </NCard>
      </div>

      <!-- Content Section -->
      <transition name="content-preview-card">
        <template v-if="userInputResult.content">
          <ContentPreviewCard :data="userInputResult" />
        </template>
      </transition>
    </div>

    <div class="mt-4 whitespace-pre">{{ templateForm }}</div>
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
