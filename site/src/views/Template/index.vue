<script setup lang="ts">
import { ref, type Ref } from "vue"
import { useObservable } from "@vueuse/rxjs"
import { liveQuery } from "dexie"
import {
  NCard,
  NSelect,
  NSpace,
  NButton,
  NUpload,
  NInput,
  NInputNumber,
  NIcon,
  NImage,
  NTooltip,
  NForm,
  NFormItem,
  useMessage,
  type UploadFileInfo,
  type FormInst
} from "naive-ui"
import {
  SearchOutlined as SearchIcon,
  FileDownloadOutlined as DownloadIcon,
  RefreshFilled as ResetIcon,
  QuestionMarkOutlined as TipIcon
} from "@vicons/material"
import QRCodeManager from "@package/qrcode-manager"
import type { Config, CustomField, SelectorOption, WithNull, History } from "@/types"
import { IndexedDBInstance } from "@/database"
import { formatCurrentTime, downloadFile, setClipBoardText } from "@/utils"
import type { TemplateForm } from "./private/types"

// Dynamically get templates from IndexedDB.
const configOptions = useObservable(
  liveQuery(() =>
    IndexedDBInstance.config.toArray((array) =>
      array.map((item) => ({ label: item.name, value: item.id, data: item }))
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

const imgURL = ref("")
const userInput = ref({
  title: "",
  content: ""
})

const showSignal = ref({
  configSelector: false,
  templateSelector: false
})

const clearTemplateForm = () => {
  templateForm.value = null
}

const clearUserInputRelated = () => {
  userInput.value.title = ""
  userInput.value.content = ""
  imgURL.value = ""
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
    message.success("????????????")
  } catch {
    message.error("????????????")
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
    value: customProperty.valueType === "number" ? 0 : ""
  }))
}

const clearSelectedTemplate = () => {
  selectedTemplateName.value = null
  clearTemplateForm()
  clearUserInputRelated()
}

const uploadConfigValidation = async ({ file }: { file: UploadFileInfo }) => {
  const fileNameWithoutSuffix = file.name.split(".")[0]
  const repeated =
    (await IndexedDBInstance.config.where("name").equalsIgnoreCase(fileNameWithoutSuffix).count()) >
    0
  if (repeated) {
    message.error("??????????????????????????????????????????????????????????????????????????????")
    return false
  }
  return true
}

const uploadConfig = ({ file }: { file: UploadFileInfo }) => {
  const fileReader = new FileReader()
  fileReader.onload = async () => {
    try {
      const json = JSON.parse(fileReader.result as string)
      message.success("????????????????????????")
      await IndexedDBInstance.config.add(json)
    } catch {
      message.error("?????????????????????????????????????????????????????????")
    }
  }
  fileReader.readAsText(file.file as any)
  return file
}

const generateQRCode = () => {
  templateFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error("?????????????????????")
    } else {
      const jsonContent: Record<string, any> = {}
      templateForm.value?.forEach((customProperty) => {
        if (customProperty.value) {
          jsonContent[customProperty.keyCode] = customProperty.value
        }
      })
      const stringifiedJSON = JSON.stringify(jsonContent)
      userInput.value.content = stringifiedJSON
      try {
        const qrcodeURL = await QRCodeManager.generateQRCode(stringifiedJSON)
        imgURL.value = qrcodeURL
        const historyModel: History = {
          src: qrcodeURL,
          content: stringifiedJSON,
          jsonContent,
          createAt: formatCurrentTime()
        }
        if (userInput.value.title) {
          historyModel.title = userInput.value.title
        }
        if ((await IndexedDBInstance.history.count()) >= 400) {
          throw new Error("?????????????????????????????????????????????????????????????????????????????????????????????")
        }
        await IndexedDBInstance.history.add(historyModel)
        message.success("?????????????????????")
      } catch (error: any) {
        message.error(error.message)
      }
    }
  })
}
const downloadQRCode = () => {
  if (!imgURL.value) {
    message.error("????????????????????????????????????")
    return
  }
  downloadFile(imgURL.value, userInput.value.title ? `${userInput.value.title}.png` : "qrcode.png")
}

const copyContent = () => {
  if (!userInput.value.content) {
    message.error("????????????????????????????????????")
    return
  }
  setClipBoardText(userInput.value.content)
  message.success("????????????")
}

const handleReset = () => {
  userInput.value.title = ""
  imgURL.value = ""
  templateForm.value =
    templateForm.value?.map((customProperty) => ({
      ...customProperty,
      value: customProperty.valueType === "number" ? 0 : ""
    })) ?? null
  message.success("????????????")
}
</script>

<template>
  <main class="flex flex-col gap-4">
    <section>
      <n-card
        embedded
        hoverable
      >
        <n-space
          vertical
          size="large"
        >
          <n-space
            align="center"
            size="large"
          >
            ??????
            <n-select
              v-model:value="selectedConfigId"
              v-model:show="showSignal.configSelector"
              filterable
              clearable
              placeholder="???????????????"
              :options="configOptions"
              @clear="clearSelectedConfig"
              @update:value="selectConfig"
            >
              <template
                v-if="showSignal.configSelector"
                #arrow
              >
                <search-icon />
              </template>
              <template #empty> ?????????????????? </template>
            </n-select>

            <n-upload
              accept="application/json"
              :show-file-list="false"
              :custom-request="(params) => params.onFinish()"
              @before-upload="uploadConfigValidation"
              @finish="uploadConfig"
            >
              <n-button
                size="small"
                type="primary"
                secondary
              >
                ????????????
              </n-button>
            </n-upload>

            <template v-if="selectedConfigId">
              <n-button
                size="small"
                type="error"
                secondary
                @click="() => deleteConfig()"
              >
                ????????????
              </n-button>
            </template>
          </n-space>

          <n-space
            align="center"
            size="large"
          >
            ??????
            <n-select
              v-model:value="selectedTemplateName"
              v-model:show="showSignal.templateSelector"
              filterable
              clearable
              placeholder="???????????????"
              :options="templateOptions"
              @clear="clearSelectedTemplate"
              @update:value="selectTemplate"
            >
              <template
                v-if="showSignal.templateSelector"
                #arrow
              >
                <search-icon />
              </template>
              <template #empty> ?????????????????? </template>
            </n-select>
          </n-space>
        </n-space>
      </n-card>
    </section>

    <div
      v-if="templateForm"
      class="mb-4 flex gap-4"
    >
      <!-- QRCode Preview Section -->
      <div class="w-[300px]">
        <n-card
          class="w-full"
          embedded
          hoverable
        >
          <div class="absolute right-1 top-1">
            <n-icon
              class="rounded-full hover:cursor-pointer hover:bg-slate-300 hover:shadow-md active:bg-slate-200"
              size="20"
              @click="() => handleReset()"
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
                class="h-200[px] w-[200px] p-2 shadow-md"
                show-toolbar-tooltip
                :src="imgURL"
              />
              <div
                v-else
                class="flex h-[200px] w-[200px] select-none items-center justify-center p-2 shadow-md"
              >
                ??????????????????????????????
              </div>
            </transition>
            <n-button
              type="primary"
              strong
              secondary
              @click="() => downloadQRCode()"
            >
              <template #icon>
                <n-icon size="20">
                  <download-icon />
                </n-icon>
              </template>
              ??????
            </n-button>
          </div>
        </n-card>
      </div>

      <!-- Template Form Section -->
      <n-card
        embedded
        hoverable
      >
        <div class="flex h-full flex-col justify-between">
          <n-form
            ref="templateFormRef"
            :model="templateForm"
            label-width="80"
            label-align="left"
            label-placement="left"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="??????">
              <n-input
                v-model:value="userInput.title"
                style="width: 38.5%"
                type="text"
                :maxlength="16"
                clearable
                show-count
                placeholder="???????????????????????????"
              />
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon
                    class="ml-2 hover:cursor-pointer"
                    size="16"
                    depth="2"
                  >
                    <tip-icon />
                  </n-icon>
                </template>
                ?????????????????????????????????????????????????????????????????????
              </n-tooltip>
            </n-form-item>

            <template
              v-for="(customProperty, customPropertyIndex) in templateForm"
              :key="customPropertyIndex"
            >
              <n-form-item
                :label="customProperty.keyName"
                :path="`[${customPropertyIndex}].value`"
                :rule="{
                  required: customProperty.require,
                  message: '?????????' + customProperty.keyName,
                  trigger: ['input', 'blur'],
                  type: customProperty.valueType
                }"
              >
                <template v-if="customProperty.valueType === 'string'">
                  <n-input
                    v-model:value="customProperty.value"
                    style="width: 38.5%"
                    type="text"
                    :maxlength="
                      customProperty.enableValueLengthLimit
                        ? customProperty.valueLengthLimit
                        : undefined
                    "
                    clearable
                    show-count
                    placeholder="???????????????"
                  />
                </template>
                <template v-if="customProperty.valueType === 'number'">
                  <n-input-number
                    v-model:value="customProperty.value"
                    style="width: 38.5%"
                    :min="0"
                    :max="
                      customProperty.enableValueLengthLimit
                        ? customProperty.valueLengthLimit
                        : undefined
                    "
                    clearable
                    show-count
                    placeholder="???????????????"
                  />
                </template>
              </n-form-item>
            </template>
          </n-form>

          <n-space align="center">
            <n-button
              size="small"
              type="primary"
              strong
              secondary
              @click="() => copyContent()"
            >
              ????????????
            </n-button>
            <n-button
              size="small"
              type="primary"
              strong
              @click="() => generateQRCode()"
            >
              ???????????????
            </n-button>
          </n-space>
        </div>
      </n-card>
    </div>
  </main>
</template>
