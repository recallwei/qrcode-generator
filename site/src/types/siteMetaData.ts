type ErrorPageInfo = {
  title: string
  description: string
  btnText: string
}

type ErrorPage = {
  NotFoundInfo: ErrorPageInfo
}

export type SiteMetaData = {
  AppName: string
  Favicon?: string
  ErrorPage: ErrorPage
}
