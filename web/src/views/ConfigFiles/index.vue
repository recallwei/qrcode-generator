<!-- <script setup lang="ts">
import {
  FolderOpenOutlined as FolderIcon,
  CloseOutlined as CloseIcon,
  EditNoteOutlined as EditIcon,
  FileDownloadOutlined as DownloadIcon
} from '@vicons/material'
import type { CustomField, Config } from '@/types'
import { IndexedDBInstance } from '@/database'
import { valueTypeCandidates } from '@/constants'
import { downloadFile } from '@/utils'

type OperateMode = 'noAction' | 'create' | 'edit' | 'readOnly'

const DEFAULT_MAX_LENGTH_LIMIT = 16
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入配置文件名称',
      trigger: ['input', 'blur']
    }
  ]
}

const message = useMessage()

const configList = useObservable(liveQuery(() => IndexedDBInstance.config.toArray()) as any) as Ref<Config[]>

const formRef = ref<FormInst | null>(null)
const form = ref<Config>({
  id: undefined,
  name: '',
  description: '',
  customFields: []
})

const operateMode = ref<OperateMode>('noAction')

const showEditableArea = computed(() => operateMode.value === 'create' || operateMode.value === 'edit')

const selectConfig = async (id: number) => {
  try {
    if (form.value.id === id) {
      form.value = {
        id: undefined,
        name: '',
        description: '',
        customFields: []
      }
      operateMode.value = 'noAction'
      return
    }
    const json = await IndexedDBInstance.config.get(id)
    form.value = { ...form.value, ...json }
    operateMode.value = 'readOnly'
  } catch {
    message.error('获取配置文件失败')
  }
}

const addConfig = () => {
  form.value = {
    id: undefined,
    name: '',
    description: '',
    customFields: []
  }
  operateMode.value = 'create'
}

const deleteConfig = async (id: number) => {
  try {
    if (form.value.id === id) {
      form.value = {
        id: undefined,
        name: '',
        description: '',
        customFields: []
      }
    }
    operateMode.value = 'noAction'
    await IndexedDBInstance.config.delete(id)
    message.success('删除成功')
  } catch {
    message.error('删除失败')
  }
}

const editConfig = (config: Config) => {
  operateMode.value = 'edit'
  form.value = config
}

const downloadConfig = async (config: Config) => {
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

const addCustomField = () => {
  const customField: CustomField = {
    name: '',
    customProperties: [
      {
        keyName: '',
        keyCode: '',
        valueType: 'string',
        require: true,
        enableValueLengthLimit: true,
        valueLengthLimit: DEFAULT_MAX_LENGTH_LIMIT
      }
    ]
  }
  form.value.customFields?.unshift(customField)
}

const deleteCustomField = (index: number) => form.value.customFields?.splice(index, 1)

const clearAllCustomFields = () => {
  form.value.customFields = []
}

const addCustomProperty = (customField: CustomField) =>
  customField.customProperties.push({
    keyName: '',
    keyCode: '',
    valueType: 'string',
    require: true,
    enableValueLengthLimit: true,
    valueLengthLimit: DEFAULT_MAX_LENGTH_LIMIT
  })

const deleteCustomProperty = (index: number, customField: CustomField) => customField.customProperties.splice(index, 1)

const clearAllCustomProperties = (customField: CustomField) =>
  customField.customProperties.splice(0, customField.customProperties.length)

const uploadFileValidation = async ({ file }: { file: UploadFileInfo }) => {
  const fileNameWithoutSuffix = file.name.split('.')[0]
  if ((await IndexedDBInstance.config.where('name').equalsIgnoreCase(fileNameWithoutSuffix).count()) > 0) {
    message.error('无法导入重名文件，若要替换配置文件，请尝试删除旧文件')
    return false
  }
  return true
}

const uploadFileToList = ({ file }: { file: UploadFileInfo }) => {
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

const handleUpload = (params: UploadCustomRequestOptions) => params.onFinish()

const saveConfig = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('内容填写不完整')
    }
    if (operateMode.value === 'edit') {
      message.loading('正在保存配置文件')
      await IndexedDBInstance.config.put(toRaw(form.value), form.value.id)
      await nextTick()
      message.destroyAll()
      message.success('配置文件保存成功')
    } else if (operateMode.value === 'create') {
      message.loading('正在导出配置文件')
      const jsonString = JSON.stringify(form.value)
      const jsonDataURL = `data:,${jsonString}`
      downloadFile(jsonDataURL, `${form.value.name}.json`)
      await nextTick()
      message.destroyAll()
      message.success('配置文件下载成功')
      IndexedDBInstance.config.add(form.value)
    }
  })
}
</script>

<template>
  <main>
    <div class="mb-4">
      <NCard
        embedded
        hoverable
      >
        <NSpace
          justify="space-between"
          align="center"
        >
          配置列表

          <NSpace
            align="center"
            justify="space-between"
          >
            <NButton
              size="small"
              @click="() => addConfig()"
            >
              新建
            </NButton>

            <NUpload
              accept="application/json"
              :show-file-list="false"
              :custom-request="handleUpload"
              @before-upload="uploadFileValidation"
              @finish="uploadFileToList"
            >
              <NButton size="small"> 导入配置 </NButton>
            </NUpload>
          </NSpace>
        </NSpace>

        <div
          v-if="Array.isArray(configList) && configList.length > 0"
          class="mt-2"
        >
          <NList
            hoverable
            clickable
            show-divider
            bordered
          >
            <template
              v-for="config in configList"
              :key="config.id"
            >
              <NListItem
                :class="{ 'bg-[#F3F3F5]': form.id === config.id }"
                @click="() => selectConfig(config.id as number)"
              >
                <div class="flex items-center justify-between space-y-2">
                  <div class="flex items-center justify-center space-x-2">
                    <NIcon size="20">
                      <FolderIcon />
                    </NIcon>

                    <NText class="w-24 overflow-hidden text-ellipsis whitespace-nowrap">
                      {{ config.name }}
                    </NText>

                    <NDivider vertical />

                    <NTooltip trigger="hover">
                      <template #trigger>
                        <NText class="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {{ config.description }}
                        </NText>
                      </template>
                      {{ config.description }}
                    </NTooltip>
                  </div>

                  <div class="flex items-center">
                    <NIcon
                      size="20"
                      :depth="2"
                      class="rounded-sm transition-all hover:bg-[#E3E3E5] active:bg-[#cacacf]"
                      @click.stop="() => editConfig(config)"
                    >
                      <EditIcon />
                    </NIcon>

                    <NIcon
                      size="20"
                      :depth="2"
                      class="ml-4 rounded-sm transition-all hover:bg-[#E3E3E5] active:bg-[#cacacf]"
                      @click.stop="() => downloadConfig(config)"
                    >
                      <DownloadIcon />
                    </NIcon>

                    <NIcon
                      size="20"
                      :depth="2"
                      color="red"
                      class="ml-4 rounded-sm transition-all hover:bg-[#E3E3E5] active:bg-[#cacacf]"
                      @click.stop="() => deleteConfig(config.id as number)"
                    >
                      <CloseIcon />
                    </NIcon>
                  </div>
                </div>
              </NListItem>
            </template>
          </NList>
        </div>
      </NCard>
    </div>

    <template v-if="showEditableArea">
      <NForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        require-mark-placement="right-hanging"
      >
        <div class="flex flex-col space-y-4">
          <NCard
            embedded
            hoverable
          >
            <NFormItem
              label="名称"
              path="name"
            >
              <NInput
                v-model:value="form.name"
                type="text"
                :maxlength="16"
                clearable
                show-count
                placeholder="请输入配置文件名称"
              />
            </NFormItem>

            <NFormItem
              label="描述"
              path="description"
            >
              <NInput
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
            </NFormItem>

            <NSpace
              justify="space-between"
              align="center"
            >
              <NSpace align="center">
                <NButton
                  size="small"
                  @click="() => addCustomField()"
                >
                  添加字段
                </NButton>

                <NButton
                  size="small"
                  @click="() => clearAllCustomFields()"
                >
                  清空字段
                </NButton>
              </NSpace>

              <NButton
                size="small"
                type="primary"
                @click="($event) => saveConfig($event)"
              >
                保存配置
              </NButton>
            </NSpace>
          </NCard>

          <NCard
            v-for="(customField, customFieldIndex) in form.customFields"
            :key="customFieldIndex"
            embedded
            hoverable
            closable
            @close="() => deleteCustomField(customFieldIndex)"
          >
            <NFormItem
              label="字段名称"
              :path="`customFields[${customFieldIndex}].name`"
              :rule="{
                required: true,
                message: '请输入字段名称',
                trigger: ['input', 'blur']
              }"
            >
              <NInput
                v-model:value="customField.name"
                type="text"
                placeholder="请输入字段名称"
                clearable
              />
            </NFormItem>

            <NSpace
              align="center"
              class="mb-4"
            >
              <NButton
                size="small"
                @click="() => addCustomProperty(customField)"
              >
                添加属性
              </NButton>

              <NButton
                size="small"
                @click="() => clearAllCustomProperties(customField)"
              >
                清空属性
              </NButton>
            </NSpace>

            <NSpace
              v-for="(customFieldProperty, customFieldPropertyIndex) in customField.customProperties"
              :key="customFieldPropertyIndex"
            >
              <NGrid :x-gap="12">
                <NFormItemGridItem
                  label="属性名称"
                  :span="6"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].keyName`"
                  :rule="{
                    required: true,
                    message: '请输入属性名称',
                    trigger: ['input', 'blur']
                  }"
                >
                  <NInput
                    v-model:value="customFieldProperty.keyName"
                    type="text"
                    placeholder="请输入内容"
                    clearable
                  />
                </NFormItemGridItem>

                <NFormItemGridItem
                  label="属性编码"
                  :span="6"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].keyCode`"
                  :rule="{
                    required: true,
                    message: '请输入属性编码',
                    trigger: ['input', 'blur']
                  }"
                >
                  <NInput
                    v-model:value="customFieldProperty.keyCode"
                    type="text"
                    placeholder="请输入内容"
                    clearable
                  />
                </NFormItemGridItem>

                <NFormItemGridItem
                  label="数值类型"
                  :span="5"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].valueType`"
                  :rule="{
                    required: true,
                    message: '请选择数值类型',
                    trigger: ['input', 'blur']
                  }"
                >
                  <NSelect
                    v-model:value="customFieldProperty.valueType"
                    :options="valueTypeCandidates"
                  />
                </NFormItemGridItem>

                <NFormItemGridItem
                  label="必填项"
                  :span="3"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].require`"
                >
                  <n-switch v-model:value="customFieldProperty.require">
                    <template #checked> 是 </template>
                    <template #unchecked> 否 </template>
                  </n-switch>
                </NFormItemGridItem>

                <NFormItemGridItem
                  label="启用长度限制"
                  :span="4"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].enableValueLengthLimit`"
                >
                  <n-switch v-model:value="customFieldProperty.enableValueLengthLimit">
                    <template #checked> 是 </template>
                    <template #unchecked> 否 </template>
                  </n-switch>
                </NFormItemGridItem>

                <NFormItemGridItem
                  v-if="customFieldProperty.enableValueLengthLimit"
                  :span="4"
                  :path="`customFields[${customFieldIndex}].customProperties[${customFieldPropertyIndex}].valueLengthLimit`"
                  :rule="{
                    required: true,
                    message: '请输入最大值',
                    trigger: ['input', 'blur'],
                    type: 'number'
                  }"
                >
                  <NInputNumber
                    v-model:value="customFieldProperty.valueLengthLimit"
                    placeholder="请输入最大值"
                    clearable
                    :min="1"
                    :max="60"
                  />
                </NFormItemGridItem>

                <NFormItemGridItem
                  :span="customFieldProperty.enableValueLengthLimit ? 2 : 6"
                  class="flex cursor-pointer items-center justify-end"
                >
                  <NIcon
                    size="20"
                    :depth="2"
                    color="red"
                    class="rounded-sm transition-all hover:bg-[#E3E3E5] active:bg-[#cacacf]"
                    @click="() => deleteCustomProperty(customFieldPropertyIndex, customField)"
                  >
                    <CloseIcon />
                  </NIcon>
                </NFormItemGridItem>
              </NGrid>
            </NSpace>
          </NCard>
        </div>
      </NForm>
    </template>
  </main>
</template> -->

<template>
  <div></div>
</template>
