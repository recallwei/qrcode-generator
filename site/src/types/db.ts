export interface History {
  id?: number
  text?: string | null
  src?: string
  content?: string
  jsonContent?: object | null
  tags?: string[]
  categories?: string[]
  groups?: string[]
  createAt?: string | null
  updateAt?: string | null
}
