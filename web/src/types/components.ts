import type { WithNull } from './typeFc'

export type GeneratedQRCodeResult = {
  title: string
  content: string
  jsonContent: WithNull<Record<string, any>>
}
