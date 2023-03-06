export type ValueType = "string" | "number" | "boolean" | "object" | "array"

export type CustomProperty = {
  keyCode: string
  valueType: ValueType
  require: boolean
  enableValueLengthLimit: boolean
  valueLengthLimit: number
}

export type CustomField = {
  name: string
  customProperties: CustomProperty[]
}
