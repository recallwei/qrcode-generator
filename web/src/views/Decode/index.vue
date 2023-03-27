<script setup lang="ts">
import { CloudUploadOutlined as UploadIcon } from '@vicons/material'
import type { UploadFileType, HandleFinishUpload } from './interface'

const supportedFileTypes = ['image/png', 'image/jpg', 'image/jpeg']

const message = useMessage()

/**
 * @description Handle before upload, only support png, jpg, jpeg exts.
 * @param data Upload file info.
 */
const handleBeforeUpload = async (data: UploadFileType): Promise<boolean> => {
  if (!supportedFileTypes.includes(data.file.file?.type ?? '')) {
    message.error('只能上传 png、jpg、jpeg 格式的图片文件，请重新上传！')
    return false
  }
  return true
}

const handleUpload = (params: UploadCustomRequestOptions) => params.onFinish()

/**
 * @description Handle finish upload.
 */
const handleFinishUpload = ({ file }: HandleFinishUpload) => {
  message.success('上传成功！')
  const fileRef = file
  fileRef.name = `${file.name} - result`
  return file
}
</script>

<template>
  <main>
    <NCard
      hoverable
      embedded
    >
      <NUpload
        list-type="image"
        multiple
        :max="10"
        :custom-request="handleUpload"
        @before-upload="handleBeforeUpload"
        @finish="handleFinishUpload"
      >
        <NUploadDragger>
          <div class="mb-0">
            <NIcon
              size="48"
              :depth="3"
            >
              <UploadIcon />
            </NIcon>
          </div>
          <NText style="font-size: 18px"> 点击或者拖动图片到该区域来上传 </NText>
          <NP
            depth="3"
            style="margin-top: 8px"
          >
            支持 png、jpg、jpeg 格式图片，至多上传 10 张，无法解析非二维码图片
          </NP>
        </NUploadDragger>
      </NUpload>
    </NCard>
  </main>
</template>
