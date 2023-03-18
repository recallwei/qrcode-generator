import type { CustomField } from './dynamicTemplate'

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

export interface Config {
  id?: number
  name?: string
  description?: string
  customFields?: CustomField[]
}
