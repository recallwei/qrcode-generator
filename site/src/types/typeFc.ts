export type WithNull<T = any> = T | null
export type WithUndefined<T = any> = T | undefined
export type WithNullAndUndefined<T = any> = T | null | undefined

export type CommonObject<T> = {
  [key: string]: T
}
