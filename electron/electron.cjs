const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const cors = require("cors");
const os = require('os');
const fs = require("fs");
const { spawn, execSync } = require("child_process");
const extract = require('extract-zip');
const tar = require('tar');
const WebSocket = require('ws');
const log = require('electron-log');

log.initialize();

// Configuration Constants
const AppConfig = {
  IS_DEV: process.env.IS_DEV === "true",
  SOCKETS_PORT: 3037,
  APP_DATA_PATH: app.getPath('userData'),
  SERVER_APP_PID_FILE: path.join(app.getPath('userData'), 'serverApp.pid'),
  PLATFORM: os.platform(),
  APP_URL: 'http://localhost:8000',
  RESOURCE_ZIP_PATH: path.join(process.resourcesPath, 'duft_resources.zip'),
  USER_HOME_PATH: path.join(os.homedir()),
  EXTRACT_PATH: path.join(os.homedir(), 'duft_resources'),
  TAR_PATH: path.join(os.homedir(), 'duft_resources', 'duft-server', 'portable-venv.tar.gz'),
  PYTHON_INTERPRETER_PATH: os.platform() === 'win32' ?
    path.join(os.homedir(), 'duft_resources', 'duft-server', 'portable-venv', 'python.exe') :
    path.join(os.homedir(), 'duft_resources', 'duft-server', 'portable-venv', 'bin', 'python'),
  PUBLIC_DIR_PATH: path.join(__dirname, "../public"),
};

// Global Variables
let serverApp = null;
let mainWindow = null;
let wsServer = null;

// Helper Functions
const logError = (...messages) => {
  log.error(...messages);
  console.error(...messages);
};

const getProcessDetailsCommand = (processId) => {
  return AppConfig.PLATFORM === 'win32'
    ? `tasklist /FI "PID eq ${processId}" /FO CSV /NH`
    : `ps -p ${processId} -o args=`;
};

// WebSocket Server
const startWebSocketServer = () => {
  wsServer = new WebSocket.Server({ port: AppConfig.SOCKETS_PORT });

  wsServer.on('connection', (ws) => {
    console.log('WebSocket connection established..');

    ws.on('message', (message) => {
      if (message === 'restart') {
        app.relaunch();
        app.exit(0);
      }
    });
  });
};

// Extraction Functions
const extractAndTrackProgress = async (resourceZipPath, extractPath) => {
  try {
    const { totalFiles } = await scanZipForProgress(resourceZipPath);
    await extract(resourceZipPath, { dir: extractPath }, (entry, index) => {
      const progress = Math.round((index / totalFiles) * 50); // Step 1 progress (0-50%)
      sendProgressUpdate(progress, `Step 1/2: Initializing...`);
    });

    // Handle nested directories if needed
    await handleNestedExtraction(extractPath);

    // Proceed to extract the tar.gz file
    await extractPortableVenv();
    sendProgressUpdate(100, `Setup complete`);
  } catch (err) {
    logError('Error during extraction:', err);
  }
};

const scanZipForProgress = (zipPath) => {
  return new Promise((resolve) => {
    const zip = new require('adm-zip')(zipPath);
    const totalFiles = zip.getEntries().length;
    resolve({ totalFiles });
  });
};

const extractPortableVenv = async () => {
  try {
    const extractPath = path.join(AppConfig.EXTRACT_PATH, 'duft-server', 'portable-venv');

    // Ensure the directory for extraction exists
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    let totalSize = 0;
    let processedSize = 0;

    // Calculate total size of all entries in the tar file
    await tar.t({
      file: AppConfig.TAR_PATH,
      onentry: (entry) => {
        totalSize += entry.size;
      }
    });

    // Extract the tar.gz file with progress tracking
    await tar.x({
      file: AppConfig.TAR_PATH,
      cwd: extractPath,
      onentry: (entry) => {
        processedSize += entry.size;
        const progress = Math.round((processedSize * 50 / totalSize) + 50);
        sendProgressUpdate(progress, `Step 2/2: Finalizing...`);
      }
    });

  } catch (err) {
    logError('Error during portable-venv extraction:', err);
  }
};

const sendProgressUpdate = (progress, message) => {
  if (wsServer) {
    wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ progress, message }));
      }
    });
  }
};

const handleNestedExtraction = async (extractPath) => {
  const extractedContent = fs.readdirSync(extractPath);
  if (extractedContent.length === 1 && fs.statSync(path.join(extractPath, extractedContent[0])).isDirectory()) {
    const nestedDir = path.join(extractPath, extractedContent[0]);
    const items = fs.readdirSync(nestedDir);

    // Move nested directory contents up one level
    for (const item of items) {
      fs.renameSync(path.join(nestedDir, item), path.join(extractPath, item));
    }

    // Remove the empty nested directory
    fs.rmdirSync(nestedDir);
  }
};


// Python Process Functions
const startServerApp = (scriptPath, interpreterPath) => {
  if (fs.existsSync(interpreterPath)) {
    serverApp = startPythonProcessUsingSpawn(scriptPath, interpreterPath);
  } else {
    logError(`Python interpreter not found: ${interpreterPath}`);
    mainWindow.webContents.send("python-script-error", `Python interpreter not found: ${interpreterPath}`);
  }
};

const startPythonProcessUsingSpawn = (scriptPath, interpreterPath) => {
  const pythonProcess = spawn(interpreterPath, [scriptPath,  'runserver', '8000']);
  fs.writeFileSync(AppConfig.SERVER_APP_PID_FILE, pythonProcess.pid.toString());

  pythonProcess.stdout.on('data', (data) => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send("streamed-realtime-response", { message: data.toString() });
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    logError(`Python stderr: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    log.log(`Server app exited with code ${code}`);
    removeServerProcessIdentity();
    serverApp = null;
  });

  pythonProcess.on('error', (err) => {
    logError('Failed to start subprocess:', err);
  });

  return pythonProcess;
};

const isServerAppRunning = (expectedScriptPath) => {
  try {
    if (fs.existsSync(AppConfig.SERVER_APP_PID_FILE)) {
      const processId = fs.readFileSync(AppConfig.SERVER_APP_PID_FILE, 'utf8').trim();
      const processInfo = execSync(getProcessDetailsCommand(processId)).toString().trim();
      return processInfo.includes(expectedScriptPath);
    }
  } catch (err) {
    logError('Error checking if server app is running:', err);
  }
  return false;
};

const stopServerApp = () => {
  if (serverApp) {
    serverApp.kill('SIGTERM');
    serverApp = null;
  }
  removeServerProcessIdentity();
};

const removeServerProcessIdentity = () => {
  if (fs.existsSync(AppConfig.SERVER_APP_PID_FILE)) {
    fs.unlinkSync(AppConfig.SERVER_APP_PID_FILE);
  }
};

// Electron App Functions
const createMainWindow = () => {
  return new BrowserWindow({
    width: 1080,
    height: 720,
    autoHideMenuBar: true,
    resizable: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
};

const setupWindowOpenHandler = (window) => {
  window.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
};

const setupDidFinishLoadHandler = (window) => {
  window.webContents.on('did-finish-load', async () => {});
};

const createWindow = async () => {
  mainWindow = createMainWindow();
  setupWindowOpenHandler(mainWindow);
  setupDidFinishLoadHandler(mainWindow);
};

// App Event Handlers
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

app.on("ready", async () => {
  await initializeApplication();
});

app.on('before-quit', () => {
  stopServerApp();
  if (wsServer) wsServer.close();
});


// Initialize Application
const initializeApplication = async () => {
  const pythonInterpreterPath = AppConfig.PYTHON_INTERPRETER_PATH;
  if (!fs.existsSync(pythonInterpreterPath)) {
    startWebSocketServer();
    await handleInitialSetup();
  } else {
    await startServerAndCreateWindow(pythonInterpreterPath);
  }
};

const handleInitialSetup = async () => {
  mainWindow = createMainWindow();
  mainWindow.loadFile(path.join(AppConfig.PUBLIC_DIR_PATH,'setup.html'));

  mainWindow.webContents.on('did-finish-load', async () => {
    if (!fs.existsSync(AppConfig.EXTRACT_PATH)) {
      fs.mkdirSync(AppConfig.EXTRACT_PATH, { recursive: true });

      try {
        await extractAndTrackProgress(AppConfig.RESOURCE_ZIP_PATH, AppConfig.EXTRACT_PATH);
      } catch (err) {
        logError('Error during initialization:', err);
        mainWindow.webContents.send("initialization-error", err.message);
      }
    }
  });
};

const startServerAndCreateWindow = async (pythonInterpreterPath) => {
  // Start the Express server
  mainWindow = createMainWindow();

  // Check if the server app is running, if not, start it
  if (!isServerAppRunning(path.join(AppConfig.EXTRACT_PATH, 'duft-server', 'manage.py'))) {
    startServerApp(path.join(AppConfig.EXTRACT_PATH, 'duft-server', 'manage.py'), pythonInterpreterPath);
  }

  // Create and load the main window with the appropriate URL
  mainWindow.loadURL(AppConfig.APP_URL);
};
