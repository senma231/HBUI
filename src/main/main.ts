const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset', // macOS style
    show: false,
  });

  // Load the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for Homebrew operations
ipcMain.handle('brew-search', async (event, query) => {
  try {
    const { stdout } = await execAsync(`brew search ${query}`);
    return { success: true, data: stdout.trim().split('\n') };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-list', async () => {
  try {
    const { stdout } = await execAsync('brew list');
    return { success: true, data: stdout.trim().split('\n') };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-info', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew info ${packageName}`);
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-install', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew install ${packageName}`);
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-uninstall', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew uninstall ${packageName}`);
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-update', async () => {
  try {
    const { stdout } = await execAsync('brew update');
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-upgrade', async (event, packageName) => {
  try {
    const command = packageName ? `brew upgrade ${packageName}` : 'brew upgrade';
    const { stdout } = await execAsync(command);
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-doctor', async () => {
  try {
    const { stdout } = await execAsync('brew doctor');
    return { success: true, data: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
