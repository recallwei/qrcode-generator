<script setup lang="ts">
import QRCodeManager from '@package/qrcode-manager'
import { IndexedDBInstance } from '@/database'
import { formatCurrentTime, setClipBoardText } from '@/utils'
import type { WithNull, CustomPropertyFormItem, GeneratedQRCodeResult, History } from '@/types'

type Props = {
  templateForm: WithNull<CustomPropertyFormItem[]>
  userInputResult: GeneratedQRCodeResult
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'generate', userInputResult: GeneratedQRCodeResult): void
  (e: 'reset', userInputResult: GeneratedQRCodeResult): void
}>()

const message = useMessage()

const templateFormRef = ref<FormInst | null>(null)

const userInputTitle = ref('')

const generateQRCode = () => {
  templateFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('内容填写不完整')
    } else {
      const jsonContent: Record<string, any> = {}
      props.templateForm?.forEach((customProperty) => {
        if (customProperty.value) {
          jsonContent[customProperty.keyCode] = customProperty.value
        }
      })
      const stringifiedJSON = JSON.stringify(jsonContent)
      try {
        const qrcodeURL = await QRCodeManager.generateQRCode(stringifiedJSON)
        const historyModel: History = {
          src: qrcodeURL,
          content: stringifiedJSON,
          jsonContent,
          createAt: formatCurrentTime()
        }
        if (userInputTitle.value) {
          historyModel.title = userInputTitle.value
        }
        if ((await IndexedDBInstance.history.count()) >= 400) {
          throw new Error('可生成的二维码数量达到上限，无法继续生成，请删除历史记录后再试')
        }
        await IndexedDBInstance.history.add(historyModel)
        emit('generate', {
          src: qrcodeURL,
          title: userInputTitle.value,
          content: stringifiedJSON,
          jsonContent
        })
        message.success('生成二维码成功')
      } catch (error: any) {
        message.error(error.message)
      }
    }
  })
}

const copyContent = () => {
  const { content } = props.userInputResult
  if (!content) {
    message.error('复制失败，请先生成二维码')
    return
  }
  setClipBoardText(content)
  message.success('复制成功')
}

const handleReset = () => {
  userInputTitle.value = ''
  emit('reset', {
    src: '',
    title: '',
    content: '',
    jsonContent: null
  })
}

defineExpose({
  handleReset
})
</script>

<template>
  <template v-if="props.templateForm">
    <NCard
      embedded
      hoverable
      class="h-full"
    >
      <div class="flex h-full flex-col justify-between">
        <NForm
          ref="templateFormRef"
          :model="props.templateForm"
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
                  class="w-full"
                  type="text"
                  :disabled="customProperty.stringOptions?.disabled"
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
                <NInputNumber
                  v-model:value="customProperty.value"
                  :disabled="customProperty.numberOptions?.disabled"
                  :min="customProperty.numberOptions?.enableRangeLimit ? customProperty.numberOptions?.min : 0"
                  :max="customProperty.numberOptions?.enableRangeLimit ? customProperty.numberOptions?.max : undefined"
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
            @click="() => handleReset()"
          >
            重置
          </NButton>
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
  </template>
</template>

<style scoped lang="scss">
:deep(.n-input-number) {
  width: 100%;
}
</style>
