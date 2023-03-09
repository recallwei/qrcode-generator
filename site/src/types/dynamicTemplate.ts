export type ValueType = "string" | "number" | "boolean" | "object" | "array"

export interface CustomProperty {
  keyName: string
  keyCode: string
  valueType: ValueType
  require: boolean
  enableValueLengthLimit: boolean
  valueLengthLimit: number
}

export interface CustomField {
  name: string
  customProperties: CustomProperty[]
}
