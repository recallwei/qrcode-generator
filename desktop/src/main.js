const { app, BrowserView, BrowserWindow } = require("electron")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: "/src/images/qrcode-favicon.png"
  })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 1920, height: 1080 })
  view.setAutoResize({
    width: true,
    height: true,
    horizontal: false,
    vertical: false
  })
  view.webContents.loadURL("https://qrcode.bruceworld.top")
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
