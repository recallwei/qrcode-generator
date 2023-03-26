import type { CustomProperty, WithNull } from '@/types'

export interface TemplateForm extends CustomProperty {
  value: any
}

export type UserInput = {
  title: string
  content: string
  jsonContent: WithNull<Record<string, any>>
}
