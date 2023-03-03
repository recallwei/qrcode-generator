type CustomField = {
  keyName: string
  keyText: string
  valueType: "string" | "number" | "boolean" | "object" | "array"
  require: boolean
  enableValueLengthLimit: boolean
  valueLengthLimit?: number
}

export type CustomConfig = {
  name: string
  description: string
  customFields: CustomField[]
}
