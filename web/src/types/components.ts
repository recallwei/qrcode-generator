import type { WithNull } from './typeFc'

export type GeneratedQRCodeResult = {
  src: string
  title: string
  content: string
  jsonContent: WithNull<Record<string, any>>
}
