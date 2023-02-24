export const downloadFile = (imgURL: string, fileName: string) => {
  const aElement = document.createElement("a")
  aElement.href = imgURL
  aElement.setAttribute("download", fileName)
  aElement.click()
}
