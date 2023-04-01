export const getPCPackage = () => {
  return new Promise((resolve, reject) => {
    fetch('https://api.github.com/repos/recallwei/qrcode-generator/releases/latest')
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch(() => {
        reject()
      })
  })
}
