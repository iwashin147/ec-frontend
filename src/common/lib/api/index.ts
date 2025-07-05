// src/lib/api/index.ts

import { createApiClient } from '@/common/lib/api/client';
import type { ApiClient } from '@/common/lib/api/apiTypes';

// 環境変数からベースURLを取得
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// アプリケーション全体で使うAPIクライアントのインスタンスを作成
export const apiClient: ApiClient = createApiClient({
  baseUrl,
  // デフォルトヘッダーなどをここに設定可能
  defaultHeaders: {
    'X-App-Version': '1.0.0',
  },
  // リクエストのロギング用フックを設定
  onRequestStart: (path) => {
    console.log(`[API] Request Start: ${path}`);
  },
  onRequestEnd: (path, duration, result) => {
    if (result.ok) {
      console.log(`[API] Request Success: ${path} (${duration}ms)`);
    } else {
      console.error(
        `[API] Request Failure: ${path} (${duration}ms)`,
        result.error,
      );
    }
  },
  // 将来的にAuth.jsと連携したトークンリフレッシュ機能をここに追加
  // tokenRefresh: { ... }
});
