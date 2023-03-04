export type ValueType = "string" | "number" | "boolean" | "object" | "array"

export type CustomFieldProperty = {
  keyCode: string
  valueType: ValueType
  require: boolean
  enableValueLengthLimit: boolean
  valueLengthLimit: number
}

export type CustomField = {
  customFieldName: string
  customFieldProperties: CustomFieldProperty[]
}

export type CustomConfig = {
  name: string
  description: string
  customFields: CustomField[]
}
