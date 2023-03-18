export type ValueType = 'string' | 'number' | 'boolean' | 'object' | 'array'

export type StringOptions = {
  enableLengthLimit: boolean
  lengthLimit?: number
}

export type NumberOptions = {
  enableRangeLimit: boolean
  max?: number
  min?: number
}

export type BooleanOptions = {
  label: string
  trueValue: any
  falseValue: any
}

export type ObjectOptions = {}

export type ArrayCandidates = {
  label: string
  value: any
}

export type ArrayOptions = {
  candidates: ArrayCandidates[]
  multiple?: boolean
}

export interface CustomProperty {
  keyName: string
  keyCode: string
  valueType: ValueType
  require: boolean
  stringOptions?: StringOptions
  numberOptions?: NumberOptions
  booleanOptions?: BooleanOptions
  objectOptions?: ObjectOptions
  arrayOptions?: ArrayOptions
}

export interface CustomField {
  name: string
  customProperties: CustomProperty[]
}
