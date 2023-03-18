const { app, BrowserView, BrowserWindow, Notification } = require('electron')
const path = require('path')

function showNotification() {
  new Notification({
    title: '二维码生成器',
    body: '当前处于 v1.0.0-alpha.1 内测版本，出现 Bug 请反馈给管理员。',
    silent: false
  }).show()
}

const createWindow = () => {
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, './images/favicon.ico')
    // frame: false
  })

  win.once('ready-to-show', () => {
    win.show()
  })
  win.setAppDetails({ relaunchDisplayName: '二维码生成器' })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 10, y: 10, width: 1590, height: 840 })
  view.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true
  })
  // view.webContents.loadURL("http://localhost:4058")
  view.webContents.loadURL('https://qrcode.bruceworld.top')
}

app
  .whenReady()
  .then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  .then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
