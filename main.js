"use strict";
// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray, Notification } = require("electron");
const path = require("path");

const Closing_title = "Meeting Scheduler";
const Closing_body =
  "Since you are closing Meeting scheduler, your upcoming meetings will not be saved and be opened during the time of schedule!";

let tray = null; //do not move this or the app tray will not work as intended!!

function createWindow() {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), "./public/js/preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
    icon: "./icon.ico",
  });

  //notification
  const showNotification = function () {
    app.whenReady().then(() => {
      if (app.isQuiting) {
        new Notification({
          title: Closing_title,
          body: Closing_body,
        }).show();
      }
    });
  };

  //icon
  const image = path.join(__dirname, "./icon.ico");

  // and load the index.html of the app.
  mainWindow.setMenuBarVisibility(false); //hide default menu bar

  mainWindow.setIcon(path.join(__dirname, "./icon.ico")); //add app icon
  // console.log(path.join(__dirname, "icon.png"));

  mainWindow.loadFile("./public/index.html"); //load app file
  // mainWindow.loadURL('https://meet.google.com');

  tray = new Tray(image);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show application",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Quit Meeting Scheduler",
      click: function () {
        mainWindow.hide();
        app.isQuiting = true;
        showNotification();
        setTimeout(() => {
          if (process.platform !== "darwin") app.quit();
        }, 5000);
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
      },
    },
  ]);

  tray.setToolTip("Meeting Scheduler");
  // tray.setImage(image);
  tray.setContextMenu(contextMenu);

  // console.log("Tray icon working!")
  // console.log(contextMenu)

  mainWindow.on("minimize", function (event) {
    showNotification();
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("close", function (event) {
    if (!app.isQuiting) {
      showNotification();
      event.preventDefault();
      mainWindow.hide();
    }
    showNotification();
    return false;
  });

  // app.on("window-all-closed", function () {
  //   app.isQuiting = true;
  //   mainWindow.hide();
  //   // if (process.platform !== "darwin") app.quit();
  // });

  //above is the default close program

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

//start app

// app.on("ready", () => {
//   // autoUpdater.checkForUpdates();
//   createWindow();
//   app.on("activate", function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

app.whenReady().then(() => {
  // console.log("App running!");
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
