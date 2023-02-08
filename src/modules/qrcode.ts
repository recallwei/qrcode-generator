import QRCode from "qrcode"

const generateQRCode = (data: string | object) => {
  return new Promise((resolve, reject) => {
    let content
    if (typeof data === "object") {
      content = JSON.stringify(data)
    } else {
      content = data
    }
    QRCode.toDataURL(
      content,
      {
        margin: 0,
        width: 200,
        errorCorrectionLevel: "low"
      },
      (err, url) => {
        if (err) {
          reject(new Error("生成二维码失败"))
        }
        resolve(url)
      }
    )
  })
}

export default { generateQRCode }
