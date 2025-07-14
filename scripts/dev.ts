import { exec } from 'node:child_process';
import { server } from '@/mocks/server';

// [修正] onUnhandledRequestを'warn'に変更
server.listen({ onUnhandledRequest: 'warn' });
console.log('✅ MSW server-side mocking enabled.');

console.log('🚀 Starting Next.js with Turbopack...');
const nextProcess = exec('next dev --turbo');

nextProcess.stdout?.pipe(process.stdout);
nextProcess.stderr?.pipe(process.stderr);

nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}.`);
  server.close();
  process.exit(code ?? 1);
});
