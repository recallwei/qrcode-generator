/**
 * @description Corresponding to naiveUI Type `FormValidationStatus`
 */
export type ValidationStatus = 'success' | 'error' | 'warning'

/**
 * @description NSelect option type
 */
export type SelectorOption<T> = {
  label: string
  value: string | number
  data: T
}
