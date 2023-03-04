import type { CustomField } from "./dynamicFormatConfig"

export interface History {
  id?: number
  title?: string
  src?: string
  content?: string
  jsonContent?: object
  tags?: string[]
  categories?: string[]
  groups?: string[]
  createAt?: string
  updateAt?: string
}

export interface FormatConfig {
  id?: number
  name?: string
  description?: string
  customFields?: CustomField[]
}
