export const setClipBoardText = (text: string) => navigator.clipboard.writeText(text)

export const openNewWindow = (url: string) => {
  const w: Window | null = window.open('about:blank')
  if (w) {
    w.opener = null
    w.location.href = url
  }
}
