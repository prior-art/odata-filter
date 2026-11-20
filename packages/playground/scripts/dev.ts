import { spawn } from 'node:child_process';
import { createServer } from 'vite';

const buildMain = spawn('npx', ['tsc', '-p', 'tsconfig.main.json'], {
  stdio: 'inherit',
});

await new Promise<void>((resolve, reject) => {
  buildMain.on('exit', (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(`Main-process build exited with code ${code}`));
  });
});

const server = await createServer({
  server: { host: '127.0.0.1', port: 5173 },
});

await server.listen();

const electron = spawn('npx', ['electron', '.'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PLAYGROUND_URL: 'http://127.0.0.1:5173',
  },
});

electron.on('exit', () => {
  void server.close();
});
