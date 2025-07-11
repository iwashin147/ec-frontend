# ec-frontend

## 🚀 プロジェクト概要

このプロジェクトは、**Next.js** で構築されたECプラットフォームのフロントエンドアプリケーションです。商品の閲覧、カート管理、ユーザー認証、購入手続きなど、リッチでレスポンシブかつユーザーフレンドリーなインターフェースを提供します。

## ✨ 機能一覧

- **商品閲覧**: 商品リストを簡単にナビゲートし、詳細を表示できます。
- **ショッピングカート管理**: カート内の商品を簡単に追加、削除、更新できます。
- **ユーザー認証**: NextAuth.js を利用した安全なサインアップ、ログイン、セッション管理を提供します。
- **レスポンシブデザイン**: **Tailwind CSS** を使用し、モバイルからデスクトップまで様々な画面サイズに最適化されています。
- **多言語対応 (i18n)**: グローバルなユーザーエクスペリエンスのために複数の言語をサポートします。
- **ダークモード**: 視認性向上のため、ライトテーマとダークテーマを切り替えられます。
- **フォーム処理**: React Hook Form と Zod を使用した堅牢で検証済みのフォーム入力が可能です。
- **状態管理**: 効率的なデータ処理とUI更新を実現します。
- **アニメーション**: Framer Motion による滑らかなUIトランジションを提供します。
- **アクセシビリティ**: Radix UI コンポーネントを活用し、アクセシビリティに配慮した設計です。

## 🛠️ 技術スタック

このプロジェクトは、モダンで堅牢な以下の技術スタックを活用しています。

- **フレームワーク**: [Next.js](https://nextjs.org/) (v15.x)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **UIコンポーネント**: [Radix UI](https://www.radix-ui.com/)
- **認証**: [NextAuth.js](https://next-auth.js.org/) (v5.x beta)
- **国際化**: [next-intl](https://next-intl-docs.vercel.app/)
- **フォーム管理**: [React Hook Form](https://react-hook-form.com/) と検証のための [Zod](https://zod.dev/)
- **アニメーション**: [Framer Motion](https://www.framer.com/motion/)
- **テーブル管理**: [@tanstack/react-table](https://tanstack.com/table/latest)
- **ユーティリティライブラリ**: `lodash-es`, `clsx`, `nanoid`, `date-fns`
- **SEO**: [next-seo](https://github.com/garmeeh/next-seo)
- **テーマ管理**: [next-themes](https://github.com/pacocoursey/next-themes)
- **トースト通知**: [Sonner](https://sonner.emilkowal.ski/)
- **アイコン**: [Lucide React](https://lucide.dev/icons/)

---

## ⚙️ 開発環境のセットアップ

プロジェクトをローカルでセットアップし、実行するための手順です。

### 前提条件

お手持ちのマシンに以下がインストールされていることを確認してください。

- **Node.js**: v20.x 以上 (推奨)
- **pnpm**: まだインストールされていない場合は、以下のコマンドでインストールできます。
  ```bash
  npm install -g pnpm
  ```

### インストール

1.  **リポジトリをクローンします:**

    ```bash
    git clone [https://github.com/iwashin147/ec-frontend.git](https://github.com/iwashin147/ec-frontend.git)
    cd ec-frontend
    ```

2.  **依存関係をインストールします:**
    ```bash
    pnpm install
    ```

### 環境変数

プロジェクトのルートに `.env.example` (もし提供されていれば) を参考に `.env.local` ファイルを作成し、必要な環境変数を記述してください。NextAuth.js の典型的なセットアップでは、少なくとも以下が必要です。

```env
NEXTAUTH_SECRET=YOUR_RANDOM_SECRET_STRING
NEXTAUTH_URL=http://localhost:3000
```

_(強力なシークレット文字列は `openssl rand -base64 32` などのツールで生成できます。)_

### 開発サーバーの起動

Turbopack を使用して開発サーバーを起動し、高速なコンパイルを行います。

```bash
pnpm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

---

## 📦 ビルドとデプロイ

### プロダクション用ビルド

アプリケーションをプロダクション用にビルドするには、以下を実行します。

```bash
pnpm run build
```

このコマンドは、`.next` ディレクトリに最適化されたプロダクションビルドを作成します。

### プロダクションモードでの実行

ビルド後にローカルでプロダクションサーバーを起動するには、以下を実行します。

```bash
pnpm run start
```

## 📏 コード品質

### リンティング

リンティングエラーをチェックするには、以下を実行します。

```bash
pnpm run lint
```

リンティングエラーを自動的に修正するには、以下を実行します。

```bash
pnpm run lint:fix
```

### フォーマット

Prettier を使用してコードベースをフォーマットするには、以下を実行します。

```bash
pnpm run format
```

---

## 🧪 テスト

このプロジェクトには、コードの品質と機能性を保証するためのユニットテストとエンドツーエンドテストが含まれています。

### ユニットテスト

ユニットテストは [Vitest](https://vitest.dev/) を使用して書かれています。
ユニットテストを実行するには、以下を実行します。

```bash
pnpm test
```

### エンドツーエンドテスト

エンドツーエンドテストは [Playwright](https://playwright.dev/) を使用して書かれています。
Playwright テストを実行するには、以下を実行します。

```bash
npx playwright test
```
