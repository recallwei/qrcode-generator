export interface History {
  id?: number
  title?: string | null
  src?: string
  content?: string
  jsonContent?: object | null
  tags?: string[]
  categories?: string[]
  groups?: string[]
  createAt?: string | null
  updateAt?: string | null
}
