export interface History {
  id?: number
  text: string
  src: string
  jsonString: string
  jsonObject: object
  tags: string[]
  categories: string[]
  groups: string[]
  createAt: string | null
  updateAt?: string | null
}
