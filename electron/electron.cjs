const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const cors = require("cors");
const os = require('os');
const fs = require("fs");
const { spawn, execSync } = require("child_process");
const extractArchive = require('7zip-min');
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
  RESOURCE_7ZIP_PATH: path.join(process.resourcesPath, 'duft_resources.7z'),
  USER_HOME_PATH: path.join(os.homedir()),
  EXTRACT_PATH: path.join(os.homedir(), 'duft_resources'),
  SEVEN_ZIP_PATH: path.join(os.homedir(), 'duft_resources', 'duft-server', 'portable-venv.7z'),
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

const extractAndTrackProgress = async (resource7zPath, extractPath) => {
  try {

    // Step 1: Get total file count for progress tracking
    const { totalFiles } = await scan7zForProgress(resource7zPath);

    // Ensure extractPath exists
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    // Step 2: Extract and track progress
    await new Promise((resolve, reject) => {
      let extractedFiles = 0;

      const progressInterval = setInterval(() => {
        const progress = Math.min(Math.round((extractedFiles / totalFiles) * 50), 50);
        sendProgressUpdate(progress, `Step 1/2: Initializing...`);
      }, 100);

      extractArchive.unpack(resource7zPath, extractPath, err =>{
        clearInterval(progressInterval);
        if (err) {
          logError('Error during extraction:', err);
          return reject(err);
        }
        extractedFiles = totalFiles;
        resolve();
      })

      // Set up watcher with error handling
      let watcher;
      try {
        watcher = fs.watch(extractPath, { recursive: true }, () => {
          extractedFiles++;
        });

        watcher.on('error', (watchErr) => {
          watcher.close();
        });
      } catch (err) {
        logError('Failed to watch directory:', extractPath, err.message);
      }
    });

    // Step 3: Handle nested extractions if needed
    await handleNestedExtraction(extractPath);

    // Step 4: Extract portable virtual environment
    await extractPortableVenv();

    // Step 5: Send completion update
    sendProgressUpdate(100, `Setup complete`);
  } catch (err) {
    logError('Error during extraction:', err);
  }
};

const scan7zForProgress = (sevenZipPath) => {
  return new Promise((resolve, reject) => {
    const { list } = require('7zip-min');
    list(sevenZipPath, (err, result) => {
      if (err) {
        logError('Error scanning .7z file:', err);
        return reject(err);
      }
      const totalFiles = result.length;
      resolve({ totalFiles });
    });
  });
};

const extractPortableVenv = async () => {
  try {
    const destinationDirectoryPath = path.dirname(AppConfig.SEVEN_ZIP_PATH);

    // Ensure the directory for extraction exists
    if (!fs.existsSync(destinationDirectoryPath)) {
      fs.mkdirSync(destinationDirectoryPath, { recursive: true });
    }

    // Ensure the .7z file exists
    if (!fs.existsSync(AppConfig.SEVEN_ZIP_PATH)) {
      throw new Error(`7z file not found: ${AppConfig.SEVEN_ZIP_PATH}`);
    }

    let totalSize = 0;
    let processedSize = 0;

    // Calculate the total size of the .7z file for progress tracking
    totalSize = fs.statSync(AppConfig.SEVEN_ZIP_PATH).size;

    // Track extraction progress
    await new Promise(async (resolve, reject) => {
      const progressInterval = setInterval(() => {
        const progress = Math.round(processedSize / totalSize) + 50; // 50%-100% for Step 2
        sendProgressUpdate(progress, `Step 2/2: Finalizing...`);
      }, 100);

      // Extract the .7z file
      extractArchive.unpack(AppConfig.SEVEN_ZIP_PATH, AppConfig.USER_HOME_PATH, async err => {
        clearInterval(progressInterval);
        if (err) {
          logError('Error during portable-venv extraction:', err);
          return reject(err);
        }

        await handleNestedExtraction(destinationDirectoryPath);
        resolve();
      });
    });

    // Notify completion
    sendProgressUpdate(100, `Setup complete`);
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
        await extractAndTrackProgress(AppConfig.RESOURCE_7ZIP_PATH, AppConfig.EXTRACT_PATH);
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
