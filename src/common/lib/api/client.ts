import { StatusCodes } from 'http-status-codes';
import {
  ApiClient,
  ApiClientConfig,
  ApiError,
  Failure,
  Result,
  RetryConfig,
} from '@/common/lib/api/apiTypes';

/**
 * リクエストのリトライを示すために使用されるHTTPヘッダーの名前。
 * トークンリフレッシュ時の無限ループを防ぐために利用されます。
 */
const IS_RETRY_HEADER = 'X-Is-Retry';

/**
 * 指定された時間（ミリ秒）だけ処理を一時停止する非同期ヘルパー関数。
 *
 * @param ms - 待機する時間（ミリ秒）。
 * @returns 指定された時間が経過した後に解決されるPromise。
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * カスタムAPIクライアントのインスタンスを生成するファクトリー関数。
 * リクエストのインターセプト、エラーハンドリング、認証トークンのリフレッシュ、リトライロジック、およびタイムアウトをサポートします。
 *
 * @param config - クライアントの動作を定義する設定オブジェクト。
 * @param config.baseUrl - APIリクエストのベースURL。
 * @param [config.defaultHeaders={}] - すべてのリクエストにデフォルトで適用されるヘッダー。
 * @param [config.defaultCacheOptions={}] - デフォルトのキャッシュオプション。`fetch` APIの`next`オプションに渡されます。
 * @param [config.tokenRefresh] - 認証トークンの取得およびリフレッシュに関するロジックを提供するオブジェクト。
 * @param [config.onRequestStart] - リクエストが開始される前に呼び出されるコールバック関数。
 * @param [config.onRequestEnd] - リクエストが完了した後に呼び出されるコールバック関数。
 * @param [config.onHttpError] - HTTPエラーが発生したときに呼び出されるコールバック関数。
 * @param [config.defaultTimeout] - リクエストのデフォルトのタイムアウト時間（ミリ秒）。
 * @param [config.defaultRetry] - リクエストのリトライに関するデフォルト設定。
 * @returns ApiClientのインターフェースを実装したオブジェクト。これには、HTTPメソッド（get, post, put, delete）に対応する関数が含まれます。
 */
export function createApiClient({
  baseUrl,
  defaultHeaders = {},
  defaultCacheOptions = {},
  tokenRefresh,
  onRequestStart,
  onRequestEnd,
  onHttpError,
  defaultTimeout,
  defaultRetry,
}: ApiClientConfig): ApiClient {
  /** 現在トークンをリフレッシュ中かどうかを示すフラグ。 */
  let isRefreshingToken = false;
  /** トークンリフレッシュ操作のPromise。これにより、複数のリクエストが同時にトークンリフレッシュをトリガーするのを防ぎます。 */
  let tokenRefreshPromise: Promise<string | null> | null = null;

  /**
   * `Response` オブジェクトを処理し、`Result` 型に変換する内部関数。
   * HTTPステータスコードに基づいて成功または失敗の結果を返します。
   *
   * @template T - 期待されるレスポンスボディの型。
   * @param response - 処理する`Response`オブジェクト。
   * @returns 成功した場合は`{ ok: true, value: T }`、失敗した場合は`{ ok: false, error: ApiError }`を含むPromise。
   */
  const handleResponse = async <T>(response: Response): Promise<Result<T>> => {
    if (!response.ok) {
      let details;
      try {
        details = await response.json();
      } catch {
        details = await response.text();
      }
      const error = new ApiError(
        response.status,
        `HTTP error! status: ${response.status}`,
        details
      );
      await onHttpError?.(error);
      return { ok: false, error };
    }
    if (response.status === StatusCodes.NO_CONTENT)
      return { ok: true, value: null as T };
    return { ok: true, value: await response.json() };
  };

  /**
   * `fetch`操作中に発生したJavaScriptのエラー（ネットワークエラー、AbortErrorなど）を処理し、`Failure`型に変換する内部関数。
   *
   * @param error - 捕捉されたエラーオブジェクト。
   * @param path - リクエストが試行されたパス。
   * @returns エラー情報を含む`Failure`オブジェクト。
   */
  const handleCaughtError = async (error: unknown): Promise<Failure> => {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        ok: false,
        error: new ApiError(
          StatusCodes.REQUEST_TIMEOUT,
          'Request Aborted',
          error
        ),
      };
    }
    const apiError =
      error instanceof Error
        ? new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
            error.stack
          )
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An unknown network error occurred'
          );
    await onHttpError?.(apiError);
    return { ok: false, error: apiError };
  };

  /**
   * 実際に`fetch`リクエストを実行し、リトライロジックやトークンリフレッシュ処理を含むコアロジック。
   *
   * @template T - 期待されるレスポンスボディの型。
   * @param path - リクエストのパス（`baseUrl`に続く部分）。
   * @param options - `fetch` APIに渡される`RequestInit`オプション。
   * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
   */
  const executeRequest = async <T>(
    path: string,
    options: RequestInit
  ): Promise<Result<T>> => {
    const retryConfig: Required<RetryConfig> = {
      count: defaultRetry?.count ?? 0,
      shouldRetry: defaultRetry?.shouldRetry ?? ((e) => e.statusCode >= 500),
      delay: defaultRetry?.delay ?? ((attempt) => Math.pow(2, attempt) * 100),
    };

    for (let attempt = 0; attempt <= retryConfig.count; attempt++) {
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;
      // タイムアウトが設定されており、かつ`options.signal`が指定されていない場合、タイムアウトを設定
      if (defaultTimeout && !options.signal) {
        timeoutId = setTimeout(() => controller.abort(), defaultTimeout);
      }

      try {
        const accessToken = tokenRefresh
          ? await tokenRefresh.getAccessToken()
          : null;
        const authHeader =
          accessToken && tokenRefresh
            ? tokenRefresh.getAuthorizationHeader(accessToken)
            : {};

        // デフォルトヘッダー、認証ヘッダー、およびオプションのヘッダーを結合し、Headersオブジェクトを構築
        const mergedHeaders = new Headers({
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...authHeader,
          // `options.headers`が`Headers`オブジェクトの場合、それをプレーンなオブジェクトに変換して結合
          ...(options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : options.headers),
        });

        const mergedOptions: RequestInit = {
          ...options,
          signal: options.signal || controller.signal, // シグナルが指定されていなければ、タイムアウト用のコントローラーのシグナルを使用
          headers: mergedHeaders, // 結合されたHeadersオブジェクトをセット
          next: { ...defaultCacheOptions, ...(options.next || {}) }, // キャッシュオプションを結合
        };
        const response = await fetch(`${baseUrl}${path}`, mergedOptions);

        // 認証エラー (401 Unauthorized) かつトークンリフレッシュが有効で、かつリトライヘッダーがない場合
        if (
          response.status === StatusCodes.UNAUTHORIZED &&
          tokenRefresh &&
          !mergedHeaders.get(IS_RETRY_HEADER) // 'X-Is-Retry' ヘッダーが存在しないかチェック
        ) {
          // トークンリフレッシュがまだ行われていない場合
          if (!isRefreshingToken) {
            isRefreshingToken = true;
            // トークンリフレッシュを実行し、Promiseを保持。完了時にフラグとPromiseをリセット。
            tokenRefreshPromise = tokenRefresh.refreshToken().finally(() => {
              isRefreshingToken = false;
              tokenRefreshPromise = null;
            });
          }
          // トークンリフレッシュが成功した場合、リトライヘッダーを追加してリクエストを再実行
          if (await tokenRefreshPromise) {
            return executeRequest<T>(path, {
              ...options,
              headers: { ...options.headers, [IS_RETRY_HEADER]: 'true' }, // リトライヘッダーを追加
            });
          }
        }

        const result = await handleResponse<T>(response);
        if (result.ok) return result; // リクエストが成功した場合は結果を返す
        // リトライ条件を満たさない、または最大リトライ回数に達した場合は結果を返す
        if (
          !retryConfig.shouldRetry(result.error) ||
          attempt === retryConfig.count
        )
          return result;
        await wait(retryConfig.delay(attempt)); // 次のリトライまで待機
      } catch (error) {
        const result = await handleCaughtError(error);
        // リトライ条件を満たさない、または最大リトライ回数に達した場合は結果を返す
        if (
          !retryConfig.shouldRetry(result.error) ||
          attempt === retryConfig.count
        )
          return result;
        await wait(retryConfig.delay(attempt)); // 次のリトライまで待機
      } finally {
        if (timeoutId) clearTimeout(timeoutId); // タイムアウトがあればクリア
      }
    }
    // 全てのリトライが失敗した場合
    return {
      ok: false,
      error: new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Retry logic failed unexpectedly'
      ),
    };
  };

  /**
   * 全てのリクエストロジックを統括し、リクエストの開始/終了フックを呼び出すメイン関数。
   *
   * @template T - 期待されるレスポンスボディの型。
   * @param path - リクエストのパス。
   * @param options - `fetch` APIに渡される`RequestInit`オプション。
   * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
   */
  const request = async <T>(
    path: string,
    options: RequestInit
  ): Promise<Result<T>> => {
    const startTime = Date.now();
    onRequestStart?.(path); // リクエスト開始フックを呼び出す
    const result = await executeRequest<T>(path, options);
    const duration = Date.now() - startTime;
    onRequestEnd?.(path, duration, result); // リクエスト終了フックを呼び出す
    return result;
  };

  // ApiClientインターフェースの実装を返す
  return {
    /**
     * GETリクエストを実行します。
     *
     * @template T - 期待されるレスポンスボディの型。
     * @param path - リクエストのパス。
     * @param [options] - `RequestInit`オプション。
     * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
     */
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    /**
     * POSTリクエストを実行します。
     *
     * @template T - 期待されるレスポンスボディの型。
     * @param path - リクエストのパス。
     * @param body - リクエストボディとして送信するデータ。JSON文字列に変換されます。
     * @param [options] - `RequestInit`オプション。
     * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
     */
    post: (path, body, options) =>
      request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
    /**
     * PUTリクエストを実行します。
     *
     * @template T - 期待されるレスポンスボディの型。
     * @param path - リクエストのパス。
     * @param body - リクエストボディとして送信するデータ。JSON文字列に変換されます。
     * @param [options] - `RequestInit`オプション。
     * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
     */
    put: (path, body, options) =>
      request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    /**
     * DELETEリクエストを実行します。
     *
     * @template T - 期待されるレスポンスボディの型。
     * @param path - リクエストのパス。
     * @param [options] - `RequestInit`オプション。
     * @returns APIレスポンスまたはエラーを含む`Result`オブジェクト。
     */
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}
