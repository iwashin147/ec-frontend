import { StatusCodes } from 'http-status-codes';

/**
 * API通信で発生したエラーに関する情報を保持するカスタムエラークラス。
 *
 * @param statusCode - HTTPステータスコード。
 * @param message - エラーメッセージ。
 * @param details - APIが返したエラーレスポンスのボディなど、詳細情報。
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: StatusCodes,
    public readonly message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API呼び出しが成功した際の結果を表す型。
 *
 * @template T - 成功時に受け取るデータの型。
 */
export type Success<T> = { ok: true; value: T };

/**
 * API呼び出しが失敗した際の結果を表す型。
 */
export type Failure = { error: ApiError; ok: false };

/**
 * API呼び出しの結果を表現する汎用的なResult型 (Discriminated Union)。
 * 呼び出し側は`ok`プロパティを確認することで、成功・失敗の判定を安全に行える。
 *
 * @template T - 成功時に受け取るデータの型。
 */
export type Result<T> = Success<T> | Failure;

/**
 * APIクライアントのインターフェース。
 * GET, POST, PUT, DELETEの基本的なHTTPメソッドを定義する。
 */
export interface ApiClient {
  delete<T>(path: string, options?: RequestInit): Promise<Result<T>>;
  get<T>(path: string, options?: RequestInit): Promise<Result<T>>;
  post<T>(
    path: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<Result<T>>;
  put<T>(
    path: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<Result<T>>;
}

/**
 * アクセストークンの自動リフレッシュ機能に関する設定。
 */
export type TokenRefreshConfig = {
  /** 現在のアクセストークンを取得するための非同期関数。 */
  getAccessToken: () => Promise<string | null>;
  /** 取得したトークンからAuthorizationヘッダーを生成する関数。 */
  getAuthorizationHeader: (token: string) => Record<string, string>;
  /** 新しいアクセストークンを取得するための非同期関数。 */
  refreshToken: () => Promise<string | null>;
  /** リフレッシュ処理をトリガーするHTTPステータスコード (通常は401)。 */
  triggerStatusCode: StatusCodes.UNAUTHORIZED;
};

/**
 * 自動リトライ機能に関する設定。
 */
export type RetryConfig = {
  /** リトライする最大回数。 */
  count: number;
  /**
   * 次のリトライまでの待ち時間 (ミリ秒) を計算する関数。
   * @param attempt - 現在の試行回数 (0から始まる)。
   * @returns 待ち時間 (ミリ秒)。
   */
  delay?: (attempt: number) => number;
  /**
   * リトライすべきか判断する関数。
   * @param error - 発生したApiError。
   * @returns リトライする場合はtrueを返す。
   */
  shouldRetry?: (error: ApiError) => boolean;
};

/**
 * APIクライアントファクトリー(`createApiClient`)の設定オブジェクト。
 */
export type ApiClientConfig = {
  /** 接続先APIのベースURL。 */
  baseUrl: string;
  /** Next.jsのfetchキャッシュに関するデフォルト設定。 */
  defaultCacheOptions?: NextFetchRequestConfig;
  /** 全てのリクエストに付与するデフォルトのヘッダー。 */
  defaultHeaders?: Record<string, string>;
  /** デフォルトの自動リトライ設定。 */
  defaultRetry?: RetryConfig;
  /** クライアントのデフォルトタイムアウト時間 (ミリ秒)。 */
  defaultTimeout?: number;
  /** HTTPエラー発生時に呼び出されるグローバルハンドラ。 */
  onHttpError?: (error: ApiError) => void | Promise<void>;
  /** リクエスト終了時に呼び出されるコールバック。ロギングなどに使用。 */
  onRequestEnd?: (
    path: string,
    duration: number,
    result: Result<unknown>,
  ) => void;
  /** リクエスト開始時に呼び出されるコールバック。ロギングなどに使用。 */
  onRequestStart?: (path: string) => void;
  /** アクセストークンの自動リフレッシュ機能に関する設定。 */
  tokenRefresh?: TokenRefreshConfig;
};
