const {
  app,
  dialog,
  BrowserWindow,
  WebContentsView,
  Menu,
} = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    resizable: true,
    icon: path.join(__dirname, "assets/logo_light.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setTitle("ImagiForge");
  // win.removeMenu();

  // Create custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          click: () => {
            app.quit();
          },
          accelerator: "CmdOrCtrl+Q",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            // Reload the mainView instead of the BrowserWindow
            if (mainView && mainView.webContents) {
              mainView.webContents.reload();
            }
          },
        },
        { type: "separator" },
        {
          role: "togglefullscreen",
        },
      ],
    },
  ]);

  // Set the custom menu as the application menu
  Menu.setApplicationMenu(menu);

  // Create a BrowserView for the loader
  const loaderView = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.contentView.addChildView(loaderView);
  loaderView.webContents.loadFile("loader.html");

  const mainView = new WebContentsView();
  mainView.webContents.loadURL("https://imagiforge.vercel.app");

  // Hide the loader and show the main content when it's ready
  mainView.webContents.on("did-finish-load", () => {
    win.contentView.addChildView(mainView);
    const [width, height] = win.getContentSize();
    mainView.setBounds({ x: 0, y: 0, width, height });
  });

  // Resize the BrowserView when the window is resized
  win.on("resize", () => {
    const [width, height] = win.getContentSize();
    loaderView.setBounds({ x: 0, y: 0, width, height });

    // Set the bounds for the mainView (if it's loaded)
    if (mainView.webContents) {
      mainView.setBounds({ x: 0, y: 0, width, height });
    }
  });

  // Maximize the window after it's created
  win.maximize();
  win.show();

  // Confirmation dialog before window close
  win.on("close", (event) => {
    const response = dialog.showMessageBoxSync(win, {
      type: "warning",
      buttons: ["Cancel", "OK"],
      title: "Confirm",
      message: "Are you sure you want to close the window?",
    });

    // Prevent the window from closing if the user selects "Cancel"
    if (response === 0) {
      event.preventDefault(); // Prevent the default close action
    }
  });

  // Optional: Open DevTools for debugging
  // view.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
