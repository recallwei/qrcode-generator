type ErrorPageInfo = {
  title: string
  description: string
  btnText: string
}

type ErrorPage = {
  NotFound: ErrorPageInfo
  FallBack: ErrorPageInfo
}

export type SiteMetaData = {
  AppName: string
  Favicon?: string
  ErrorPage: ErrorPage
}
