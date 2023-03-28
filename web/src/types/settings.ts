export type ThemeMode = 'light' | 'dark'

export type EncodeMode = 'UTF-8' | 'GBK'

export type CorrectLevel = 'L' | 'M' | 'Q' | 'H'

export type GenerateQRCodeOptions = {
  correctLevel: CorrectLevel
}

export type AppOptions = {
  enableAddTitle: boolean
  showJsonContent: boolean
}

export type UserSettings = {
  themeMode: ThemeMode
  encodeMode: EncodeMode
  generateQRCodeOptions: GenerateQRCodeOptions
  appOptions: AppOptions
}
