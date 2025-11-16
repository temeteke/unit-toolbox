# unit-toolbox

異なる単位系（SI、ヤード・ポンド、日本の伝統単位など）をまとめて扱う単位変換ツールです。

## プロジェクト概要

単位変換アプリ「unit-toolbox」は、さまざまな単位系を統合的に扱える Web アプリケーションです。GitHub Pages でホストされた静的サイトとして、PWA 対応によりオフライン利用やホーム画面への追加が可能です。

### 対応カテゴリ

1. 長さ
2. 面積
3. 体積
4. 質量
5. 温度
6. 速度
7. データ量
8. エネルギー
9. 圧力

### 技術スタック

- TypeScript
- Next.js + React
- 完全静的エクスポート (`output: 'export'`)

## 開発

### 必要な環境

- Node.js 20.x 以上
- npm

### セットアップ

依存関係をインストール:

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

静的ファイルを生成するには、以下のコマンドを実行します:

```bash
npm run build
```

ビルドが完了すると、`out/` ディレクトリに静的ファイルが生成されます。

## デプロイ

### GitHub Pages への自動デプロイ

このプロジェクトは GitHub Actions を使用して、`main` ブランチへの push 時に自動的に GitHub Pages へデプロイされます。

#### 初回設定

1. GitHub リポジトリの設定画面を開く
2. **Settings** → **Pages** に移動
3. **Source** を **「GitHub Actions」** に設定

これで、`main` ブランチに push するたびに自動的にデプロイが実行されます。

公開 URL: `https://<ユーザー名>.github.io/unit-toolbox/`

#### 手動デプロイ

手動でデプロイしたい場合は、以下の手順で実行できます:

1. GitHub リポジトリの **Actions** タブを開く
2. 左側のワークフロー一覧から **「Deploy unit-toolbox to GitHub Pages」** を選択
3. 右上の **「Run workflow」** ボタンをクリック
4. ブランチを選択して **「Run workflow」** を実行

### ローカルでのビルド確認

ローカル環境でビルド結果を確認したい場合:

```bash
npm run build
```

ビルドされたファイルは `out/` ディレクトリに出力されます。

## プロジェクト構成

```
unit-toolbox/
├── app/              # Next.js App Router ページ
│   ├── layout.tsx    # ルートレイアウト
│   └── page.tsx      # トップページ
├── public/           # 静的ファイル
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # GitHub Pages デプロイワークフロー
├── next.config.mjs   # Next.js 設定（静的エクスポート + basePath）
├── tsconfig.json     # TypeScript 設定
└── package.json      # プロジェクト依存関係
```

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルドを実行（静的ファイル生成）
- `npm run lint` - ESLint によるコードチェック

## ライセンス

MIT
