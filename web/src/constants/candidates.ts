import type { ValueType } from '@/types'

export const valueTypeCandidates: { label: string; value: ValueType; disabled?: boolean }[] = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'boolean', disabled: true },
  { label: '数组', value: 'array', disabled: true },
  { label: '对象', value: 'object', disabled: true }
]
