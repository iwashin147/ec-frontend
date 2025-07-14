// グローバル変数の型を宣言
declare global {
  var mswServerStarted: boolean | undefined;
}

export async function register() {
  // 安全装置①: 開発モードでのみ実行
  if (process.env.NODE_ENV === 'development') {
    // 安全装置②: Node.jsランタイムでのみ実行（Edgeランタイムでは実行しない）
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // 安全装置③: ホットリロードで重複実行されるのを防ぐ
      if (global.mswServerStarted) {
        return;
      }

      const { server } = await import('@/mocks/server');
      server.listen({ onUnhandledRequest: 'warn' });
      global.mswServerStarted = true;
      console.log('✅ MSW instrumentation hook enabled for Node.js.');
    }
  }
}
