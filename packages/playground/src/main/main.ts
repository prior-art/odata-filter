import { app, BrowserWindow, clipboard, dialog, ipcMain } from 'electron';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const isDevelopment = !app.isPackaged;

const createWindow = async (): Promise<void> => {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(import.meta.dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDevelopment) {
    await window.loadURL(process.env.PLAYGROUND_URL ?? 'http://localhost:5173');
  } else {
    await window.loadFile(path.join(app.getAppPath(), 'dist/renderer/index.html'));
  }
};

ipcMain.handle('clipboard:write', (_event, text: string) => {
  clipboard.writeText(text);
});

ipcMain.handle('file:save', async (_event, defaultName: string, content: string) => {
  const result = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: [{ name: 'OData Filter Playground', extensions: ['json'] }],
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  await writeFile(result.filePath, content, 'utf8');
  return result.filePath;
});

ipcMain.handle('file:open', async (_event, title: string, extensions: string[]) => {
  const result = await dialog.showOpenDialog({
    title,
    properties: ['openFile'],
    filters: [{ name: title, extensions }],
  });

  if (result.canceled || !result.filePaths[0]) {
    return null;
  }

  return readFile(result.filePaths[0], 'utf8');
});

ipcMain.handle('odata:parse', async (_event, tokens: any[]) => {
  try {
    const { parse } = await import('@odata-filter/core');
    return parse(tokens);
  } catch (error) {
    return { error: (error as Error).message };
  }
});

ipcMain.handle('odata:tokenize', async (_event, filter: string) => {
  try {
    const { tokenize } = await import('@odata-filter/core');
    return tokenize(filter);
  } catch (error) {
    return { error: (error as Error).message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow();
  }
});
