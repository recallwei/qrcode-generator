<script setup lang="ts">
import { ref, nextTick } from "vue"
import {
  NForm,
  NFormItem,
  NFormItemGridItem,
  NGrid,
  NCard,
  NButton,
  NInput,
  NInputNumber,
  NSwitch,
  NSelect,
  NSpace,
  NIcon,
  NUpload,
  useMessage,
  type FormInst,
  type FormRules,
  type UploadCustomRequestOptions,
  type UploadFileInfo
} from "naive-ui"
import { DeleteForeverOutlined as DeleteIcon } from "@vicons/material"
import type { CustomConfig, CustomField } from "@/types"
import { valueTypeCandidates } from "@/constants"
import { downloadFile } from "@/utils"

const DEFAULT_MAX_LENGTH_LIMIT = 16

const message = useMessage()

const formRef = ref<FormInst | null>(null)

const form = ref<CustomConfig>({
  name: "",
  description: "",
  customFields: []
})

const rules: FormRules = {
  name: [{ required: true, message: "请输入名称", trigger: ["input", "blur"] }]
}

const addCustomField = () => {
  const customField: CustomField = {
    name: "",
    customProperties: [
      {
        keyCode: "",
        valueType: "string",
        require: true,
        enableValueLengthLimit: true,
        valueLengthLimit: DEFAULT_MAX_LENGTH_LIMIT
      }
    ]
  }
  form.value.customFields.unshift(customField)
}

const deleteCustomField = (index: number) => form.value.customFields.splice(index, 1)

const clearAllCustomFields = () => {
  form.value.customFields = []
}

const addCustomProperty = (customField: CustomField) =>
  customField.customProperties.unshift({
    keyCode: "",
    valueType: "string",
    require: true,
    enableValueLengthLimit: true,
    valueLengthLimit: DEFAULT_MAX_LENGTH_LIMIT
  })

const deleteCustomProperty = (index: number, customField: CustomField) =>
  customField.customProperties.splice(index, 1)

const clearAllCustomProperties = (customField: CustomField) =>
  customField.customProperties.splice(0, customField.customProperties.length)

const uploadFinish = ({ file }: { file: UploadFileInfo }) => {
  const fileReader = new FileReader()
  fileReader.onload = () => {
    const json = JSON.parse(fileReader.result as string)
    message.success("导入配置成功")
    form.value = json
  }
  fileReader.readAsText(file.file as any)
  return file
}

const saveConfig = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error("内容填写不完整")
    } else {
      message.loading("正在导出配置文件")
      const jsonString = JSON.stringify(form.value)
      const jsonDataURL = `data:,${jsonString}`
      downloadFile(jsonDataURL, `${form.value.name}.json`)
      await nextTick()
      message.destroyAll()
      message.success("配置文件下载成功")
    }
  })
}

const handleUpload = (params: UploadCustomRequestOptions) => params.onFinish()
</script>

<template>
  <main>
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
    >
      <div class="flex flex-col gap-4">
        <n-card
          embedded
          hoverable
        >
          <n-form-item
            label="名称"
            path="name"
          >
            <n-input
              v-model:value="form.name"
              type="text"
              :maxlength="16"
              clearable
              show-count
              placeholder="请输入配置文件名称"
            />
          </n-form-item>

          <n-form-item
            label="描述"
            path="description"
          >
            <n-input
              v-model:value="form.description"
              type="textarea"
              :autosize="{
                minRows: 6,
                maxRows: 6
              }"
              :maxlength="400"
              clearable
              show-count
              placeholder="请输入配置文件描述"
            />
          </n-form-item>

          <n-space
            justify="space-between"
            align="center"
          >
            <n-space align="center">
              <n-button
                size="small"
                @click="() => addCustomField()"
              >
                添加字段
              </n-button>

              <n-button
                size="small"
                @click="() => clearAllCustomFields()"
              >
                清空字段
              </n-button>
            </n-space>

            <n-space align="center">
              <n-upload
                accept="application/json"
                :show-file-list="false"
                :custom-request="handleUpload"
                @finish="uploadFinish"
              >
                <n-button
                  size="small"
                  secondary
                >
                  导入配置
                </n-button>
              </n-upload>

              <n-button
                size="small"
                type="primary"
                @click="($event) => saveConfig($event)"
              >
                保存配置
              </n-button>
            </n-space>
          </n-space>
        </n-card>

        <n-card
          v-for="(customField, customFieldIndex) in form.customFields"
          :key="customFieldIndex"
          embedded
          hoverable
          closable
          @close="() => deleteCustomField(customFieldIndex)"
        >
          <n-form-item
            label="字段名称"
            :path="`customFields[${customFieldIndex}].name`"
            :rule="{
              required: true,
              message: '请输入字段名称',
              trigger: ['input', 'blur']
            }"
          >
            <n-input
              v-model:value="customField.name"
              type="text"
              placeholder="请输入字段名称"
              clearable
            />
          </n-form-item>

          <n-space
            align="center"
            class="mb-4"
          >
            <n-button
              size="small"
              @click="() => addCustomProperty(customField)"
            >
              添加属性
            </n-button>

            <n-button
              size="small"
              @click="() => clearAllCustomProperties(customField)"
            >
              清空属性
            </n-button>
          </n-space>

          <n-space
            v-for="(customFieldProperty, customFieldPropertyIndex) in customField.customProperties"
            :key="customFieldPropertyIndex"
          >
            <n-grid
              :cols="24"
              :x-gap="12"
            >
              <n-form-item-grid-item
                label="属性编码"
                :span="6"
                :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].keyCode`"
                :rule="{
                  required: true,
                  message: '请输入属性编码',
                  trigger: ['input', 'blur']
                }"
              >
                <n-input
                  v-model:value="customFieldProperty.keyCode"
                  type="text"
                  placeholder="请输入内容"
                  clearable
                />
              </n-form-item-grid-item>

              <n-form-item-grid-item
                label="数值类型"
                :span="5"
                :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].valueType`"
                :rule="{
                  required: true,
                  message: '请选择数值类型',
                  trigger: ['input', 'blur']
                }"
              >
                <n-select
                  v-model:value="customFieldProperty.valueType"
                  :options="valueTypeCandidates"
                />
              </n-form-item-grid-item>

              <n-form-item-grid-item
                label="必填项"
                :span="3"
                :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].require`"
              >
                <n-switch v-model:value="customFieldProperty.require">
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </n-switch>
              </n-form-item-grid-item>

              <n-form-item-grid-item
                label="启用长度限制"
                :span="4"
                :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].enableValueLengthLimit`"
              >
                <n-switch v-model:value="customFieldProperty.enableValueLengthLimit">
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </n-switch>
              </n-form-item-grid-item>

              <n-form-item-grid-item
                :span="4"
                :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].valueLengthLimit`"
                :rule="{
                  required: true,
                  message: '请输入最大值',
                  trigger: ['input', 'blur'],
                  type: 'number'
                }"
              >
                <n-input-number
                  v-if="customFieldProperty.enableValueLengthLimit"
                  v-model:value="customFieldProperty.valueLengthLimit"
                  placeholder="请输入最大值"
                  clearable
                  :min="1"
                  :max="60"
                />
              </n-form-item-grid-item>

              <n-form-item-grid-item
                :span="2"
                class="flex items-center justify-end"
              >
                <n-button
                  size="small"
                  type="error"
                  tertiary
                  @click="() => deleteCustomProperty(customFieldPropertyIndex, customField)"
                >
                  <template #icon>
                    <n-icon size="20">
                      <delete-icon />
                    </n-icon>
                  </template>
                  删除
                </n-button>
              </n-form-item-grid-item>
            </n-grid>
          </n-space>
        </n-card>
      </div>
    </n-form>
  </main>
</template>
