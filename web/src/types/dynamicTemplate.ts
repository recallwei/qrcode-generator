export type ValueType = 'string' | 'number' | 'boolean' | 'array'

export interface BaseOptions<T> {
  disabled: boolean
  enableDefaultValue: boolean
  defaultValue?: T
}

export interface StringOptions extends BaseOptions<string> {
  enableLengthLimit: boolean
  lengthLimit?: number
}

export interface NumberOptions extends BaseOptions<number> {
  enableRangeLimit: boolean
  max?: number
  min?: number
}

export interface BooleanOptions extends BaseOptions<boolean> {
  enableCustomLabel: boolean
  customLabel?: string
  trueValue?: any
  falseValue?: any
}

export type ArrayCandidate = {
  label: string
  value: any
}

export type ArrayOptions = {
  candidates: ArrayCandidate[]
  multiple: boolean
}

export interface CustomProperty {
  keyName: string
  keyCode: string
  valueType: ValueType
  require: boolean
  stringOptions?: StringOptions
  numberOptions?: NumberOptions
  booleanOptions?: BooleanOptions
  arrayOptions?: ArrayOptions
}

export interface CustomField {
  name: string
  customProperties: CustomProperty[]
}

export interface CustomPropertyFormItem extends CustomProperty {
  value: any
}
