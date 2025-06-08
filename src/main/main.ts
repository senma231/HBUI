const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const os = require('os');

const execAsync = promisify(exec);

// Tag storage management
const getTagsFilePath = () => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'package-tags.json');
};

const loadTagsFromFile = () => {
  try {
    const tagsFilePath = getTagsFilePath();
    if (fs.existsSync(tagsFilePath)) {
      const data = fs.readFileSync(tagsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tags:', error);
  }
  return { tags: [], packageTags: {} };
};

const saveTagsToFile = (data) => {
  try {
    const tagsFilePath = getTagsFilePath();
    fs.writeFileSync(tagsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving tags:', error);
    throw error;
  }
};

const generateTagId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper functions for package information parsing
const parsePackageInfo = (infoOutput, packageName) => {
  const lines = infoOutput.split('\n');
  const packageInfo = {
    name: packageName,
    version: '',
    description: '',
    homepage: '',
    dependencies: [],
    type: 'formula',
    installed: false,
    outdated: false,
    pinned: false
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.includes('==> Cask ')) {
      packageInfo.type = 'cask';
    } else if (trimmedLine.includes('==> Formula ')) {
      packageInfo.type = 'formula';
    }

    if (trimmedLine.startsWith('Description:')) {
      packageInfo.description = trimmedLine.replace('Description:', '').trim();
    } else if (trimmedLine.startsWith('Homepage:')) {
      packageInfo.homepage = trimmedLine.replace('Homepage:', '').trim();
    } else if (trimmedLine.includes('Installed')) {
      packageInfo.installed = true;
      // Extract version from installed line
      const versionMatch = trimmedLine.match(/(\d+\.\d+[\.\d]*)/);
      if (versionMatch) {
        packageInfo.version = versionMatch[1];
      }
    } else if (trimmedLine.includes('Dependencies:')) {
      const depsLine = trimmedLine.replace('Dependencies:', '').trim();
      if (depsLine && depsLine !== 'None') {
        packageInfo.dependencies = depsLine.split(',').map(dep => dep.trim());
      }
    }
  }

  return packageInfo;
};

const parsePackageList = async (listOutput, type = 'formula') => {
  const packages = listOutput.trim().split('\n').filter(pkg => pkg.trim() !== '');
  const packageInfos = [];

  for (const pkg of packages) {
    try {
      const { stdout: infoOutput } = await execAsync(`brew info ${pkg}`);
      const packageInfo = parsePackageInfo(infoOutput, pkg);
      packageInfo.type = type;
      packageInfo.installed = true;
      packageInfos.push(packageInfo);
    } catch (error) {
      // If brew info fails, create basic package info
      packageInfos.push({
        name: pkg,
        type: type,
        installed: true,
        description: '',
        homepage: '',
        dependencies: [],
        version: '',
        outdated: false,
        pinned: false
      });
    }
  }

  return packageInfos;
};

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
ipcMain.handle('brew-search', async (event, query, options: any = {}) => {
  try {
    let searchCommand = 'brew search';

    if (options.type === 'formula') {
      searchCommand += ' --formulae';
    } else if (options.type === 'cask') {
      searchCommand += ' --casks';
    }

    searchCommand += ` ${query}`;

    const { stdout } = await execAsync(searchCommand);
    const packageNames = stdout.trim().split('\n').filter(name => name.trim() !== '');

    // Get detailed info for each package if requested
    if (options.includeDescriptions && packageNames.length > 0) {
      const packageInfos = [];
      for (const name of packageNames.slice(0, 20)) { // Limit to first 20 for performance
        try {
          const { stdout: infoOutput } = await execAsync(`brew info ${name}`);
          const packageInfo = parsePackageInfo(infoOutput, name);
          packageInfos.push(packageInfo);
        } catch (error) {
          packageInfos.push({
            name: name,
            type: options.type || 'formula',
            installed: false,
            description: '',
            homepage: '',
            dependencies: [],
            version: '',
            outdated: false,
            pinned: false
          });
        }
      }
      return { success: true, data: packageInfos };
    }

    // Return simple package list
    const simplePackages = packageNames.map(name => ({
      name: name,
      type: options.type || 'formula',
      installed: false,
      description: '',
      homepage: '',
      dependencies: [],
      version: '',
      outdated: false,
      pinned: false
    }));

    return { success: true, data: simplePackages };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-list', async () => {
  try {
    const { stdout } = await execAsync('brew list');
    const packageInfos = await parsePackageList(stdout, 'formula');
    return { success: true, data: packageInfos };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('brew-info', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew info ${packageName}`);
    const packageInfo = parsePackageInfo(stdout, packageName);
    return { success: true, data: packageInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Enhanced package information handler
ipcMain.handle('get-package-details', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew info ${packageName}`);
    const packageInfo = parsePackageInfo(stdout, packageName);

    // Get additional information
    try {
      const { stdout: depsOutput } = await execAsync(`brew deps ${packageName}`);
      packageInfo.dependencies = depsOutput.trim().split('\n').filter(dep => dep.trim() !== '');
    } catch (error) {
      // Dependencies command failed, keep empty array
    }

    return { success: true, data: packageInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get package dependencies
ipcMain.handle('brew-deps', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew deps ${packageName}`);
    const dependencies = stdout.trim().split('\n').filter(dep => dep.trim() !== '');
    return { success: true, data: dependencies };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get packages that depend on this package
ipcMain.handle('brew-uses', async (event, packageName) => {
  try {
    const { stdout } = await execAsync(`brew uses ${packageName} --installed`);
    const dependents = stdout.trim().split('\n').filter(dep => dep.trim() !== '');
    return { success: true, data: dependents };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get outdated packages
ipcMain.handle('brew-outdated', async () => {
  try {
    const { stdout } = await execAsync('brew outdated');
    const outdatedPackages = stdout.trim().split('\n').filter(pkg => pkg.trim() !== '');
    const packageInfos = [];

    for (const pkg of outdatedPackages) {
      try {
        const { stdout: infoOutput } = await execAsync(`brew info ${pkg}`);
        const packageInfo = parsePackageInfo(infoOutput, pkg);
        packageInfo.outdated = true;
        packageInfos.push(packageInfo);
      } catch (error) {
        packageInfos.push({
          name: pkg,
          type: 'formula',
          installed: true,
          outdated: true,
          description: '',
          homepage: '',
          dependencies: [],
          version: '',
          pinned: false
        });
      }
    }

    return { success: true, data: packageInfos };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get Homebrew services
ipcMain.handle('brew-services', async () => {
  try {
    const { stdout } = await execAsync('brew services list');
    const lines = stdout.trim().split('\n').slice(1); // Skip header
    const services = lines.map(line => {
      const parts = line.split(/\s+/);
      return {
        name: parts[0],
        status: parts[1],
        user: parts[2] || '',
        plist: parts[3] || ''
      };
    });
    return { success: true, data: services };
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

// Tag management IPC handlers
ipcMain.handle('get-all-tags', async () => {
  try {
    const data = loadTagsFromFile();
    return { success: true, data: data.tags };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-tag', async (event, tagData) => {
  try {
    const data = loadTagsFromFile();
    const newTag = {
      id: generateTagId(),
      name: tagData.name,
      color: tagData.color,
      description: tagData.description
    };

    data.tags.push(newTag);
    saveTagsToFile(data);

    return { success: true, data: newTag };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-tag', async (event, tagId) => {
  try {
    const data = loadTagsFromFile();
    data.tags = data.tags.filter(tag => tag.id !== tagId);

    // Remove tag from all packages
    for (const packageName in data.packageTags) {
      data.packageTags[packageName] = data.packageTags[packageName].filter(id => id !== tagId);
      if (data.packageTags[packageName].length === 0) {
        delete data.packageTags[packageName];
      }
    }

    saveTagsToFile(data);
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-package-tags', async (event, packageName) => {
  try {
    const data = loadTagsFromFile();
    const packageTagIds = data.packageTags[packageName] || [];
    const packageTags = data.tags.filter(tag => packageTagIds.includes(tag.id));
    return { success: true, data: packageTags };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('add-package-tag', async (event, packageName, tag) => {
  try {
    const data = loadTagsFromFile();

    if (!data.packageTags[packageName]) {
      data.packageTags[packageName] = [];
    }

    if (!data.packageTags[packageName].includes(tag.id)) {
      data.packageTags[packageName].push(tag.id);
      saveTagsToFile(data);
    }

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('remove-package-tag', async (event, packageName, tagId) => {
  try {
    const data = loadTagsFromFile();

    if (data.packageTags[packageName]) {
      data.packageTags[packageName] = data.packageTags[packageName].filter(id => id !== tagId);
      if (data.packageTags[packageName].length === 0) {
        delete data.packageTags[packageName];
      }
      saveTagsToFile(data);
    }

    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
