import type { UploadFileInfo } from "naive-ui"

export type UploadFileType = {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}

export type HandleFinishUpload = {
  file: UploadFileInfo
  event?: ProgressEvent
}
