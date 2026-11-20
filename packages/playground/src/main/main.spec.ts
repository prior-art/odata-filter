import { beforeEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  app: {
    isPackaged: false,
    whenReady: vi.fn(() => Promise.resolve()),
    on: vi.fn(),
    quit: vi.fn(),
    getAppPath: vi.fn(() => '/app'),
  },
  BrowserWindow: vi.fn(),
  clipboard: { writeText: vi.fn() },
  dialog: {
    showSaveDialog: vi.fn(),
    showOpenDialog: vi.fn(),
  },
  ipcMain: { handle: vi.fn() },
  readFile: vi.fn(),
  writeFile: vi.fn(),
  parse: vi.fn(),
  tokenize: vi.fn(),
}));

vi.mock('electron', () => ({
  app: mocks.app,
  BrowserWindow: mocks.BrowserWindow,
  clipboard: mocks.clipboard,
  dialog: mocks.dialog,
  ipcMain: mocks.ipcMain,
}));

vi.mock('node:fs/promises', () => ({
  readFile: mocks.readFile,
  writeFile: mocks.writeFile,
}));

vi.mock('@odata-filter/core', () => ({
  parse: mocks.parse,
  tokenize: mocks.tokenize,
}));

const handlers = new Map<string, (...args: any[]) => unknown>();
let loadURL: ReturnType<typeof vi.fn>;
let loadFile: ReturnType<typeof vi.fn>;

const importMain = async (): Promise<void> => {
  vi.resetModules();
  mocks.ipcMain.handle.mockImplementation((name, handler) => {
    handlers.set(name, handler);
  });
  loadURL = vi.fn(() => Promise.resolve());
  loadFile = vi.fn(() => Promise.resolve());
  mocks.BrowserWindow.mockImplementation(class {
    loadURL = loadURL;
    loadFile = loadFile;
  });
  await import('./main');
  await Promise.resolve();
};

const invoke = (name: string, ...args: unknown[]): unknown =>
  handlers.get(name)?.({}, ...args);

describe('main process', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    handlers.clear();
    mocks.app.isPackaged = false;
    delete process.env.PLAYGROUND_URL;
  });

  test('creates a development window and uses a configured URL', async () => {
    process.env.PLAYGROUND_URL = 'http://localhost:4173';
    await importMain();

    expect(mocks.BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
      width: 1280,
      height: 820,
      minWidth: 960,
      minHeight: 640,
      webPreferences: {
        preload: expect.stringContaining('preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    }));
    expect(loadURL).toHaveBeenCalledWith('http://localhost:4173');
  });

  test('uses the default development URL when none is configured', async () => {
    await importMain();
    expect(loadURL).toHaveBeenCalledWith('http://localhost:5173');
  });

  test('loads the packaged renderer and quits when all windows close', async () => {
    mocks.app.isPackaged = true;
    await importMain();

    expect(loadFile).toHaveBeenCalledWith('/app/dist/renderer/index.html');
    const closed = mocks.app.on.mock.calls.find(([event]) => event === 'window-all-closed')?.[1];
    closed?.();
    expect(mocks.app.quit).toHaveBeenCalledOnce();
  });

  test('does not quit on macOS and creates a window on activate only when needed', async () => {
    await importMain();
    const closed = mocks.app.on.mock.calls.find(([event]) => event === 'window-all-closed')?.[1];
    const activate = mocks.app.on.mock.calls.find(([event]) => event === 'activate')?.[1];
    const originalProcess = process;

    vi.stubGlobal('process', { ...process, platform: 'darwin' });
    closed?.();
    vi.stubGlobal('process', originalProcess);
    expect(mocks.app.quit).not.toHaveBeenCalled();

    mocks.BrowserWindow.getAllWindows = vi.fn(() => [{}]);
    activate?.();
    expect(mocks.BrowserWindow).toHaveBeenCalledOnce();

    mocks.BrowserWindow.getAllWindows.mockReturnValue([]);
    activate?.();
    await Promise.resolve();
    expect(mocks.BrowserWindow).toHaveBeenCalledTimes(2);
  });

  test('handles clipboard writes and save cancellation or success', async () => {
    await importMain();
    mocks.dialog.showSaveDialog
      .mockResolvedValueOnce({ canceled: true, filePath: undefined })
      .mockResolvedValueOnce({ canceled: false, filePath: undefined })
      .mockResolvedValueOnce({ canceled: false, filePath: '/tmp/filter.json' });

    invoke('clipboard:write', 'text');
    expect(mocks.clipboard.writeText).toHaveBeenCalledWith('text');
    expect(await invoke('file:save', 'filter.json', '{}')).toBeNull();
    expect(await invoke('file:save', 'filter.json', '{}')).toBeNull();
    expect(await invoke('file:save', 'filter.json', '{}')).toBe('/tmp/filter.json');
    expect(mocks.writeFile).toHaveBeenCalledWith('/tmp/filter.json', '{}', 'utf8');
    expect(mocks.dialog.showSaveDialog).toHaveBeenCalledWith({
      defaultPath: 'filter.json',
      filters: [{ name: 'OData Filter Playground', extensions: ['json'] }],
    });
  });

  test('handles open cancellation, empty selection, and file contents', async () => {
    await importMain();
    mocks.dialog.showOpenDialog
      .mockResolvedValueOnce({ canceled: true, filePaths: [] })
      .mockResolvedValueOnce({ canceled: false, filePaths: [] })
      .mockResolvedValueOnce({ canceled: false, filePaths: ['/tmp/schema.json'] });
    mocks.readFile.mockResolvedValue('{"name":"Ada"}');

    expect(await invoke('file:open', 'Load schema', ['json'])).toBeNull();
    expect(await invoke('file:open', 'Load schema', ['json'])).toBeNull();
    expect(await invoke('file:open', 'Load schema', ['json'])).toBe('{"name":"Ada"}');
    expect(mocks.readFile).toHaveBeenCalledWith('/tmp/schema.json', 'utf8');
    expect(mocks.dialog.showOpenDialog).toHaveBeenCalledWith({
      title: 'Load schema',
      properties: ['openFile'],
      filters: [{ name: 'Load schema', extensions: ['json'] }],
    });
  });

  test('returns parser and tokenizer results or errors', async () => {
    await importMain();
    mocks.parse.mockReturnValue({ type: 'expression' });
    mocks.tokenize.mockReturnValue([{ type: 'identifier' }]);

    expect(await invoke('odata:parse', [])).toEqual({ type: 'expression' });
    expect(await invoke('odata:tokenize', 'age eq 1')).toEqual([{ type: 'identifier' }]);

    mocks.parse.mockImplementation(() => {
      throw new Error('parse failed');
    });
    mocks.tokenize.mockImplementation(() => {
      throw new Error('tokenize failed');
    });
    expect(await invoke('odata:parse', [])).toEqual({ error: 'parse failed' });
    expect(await invoke('odata:tokenize', 'invalid')).toEqual({ error: 'tokenize failed' });
  });
});
