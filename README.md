# 英会話学習アプリ（React + TypeScript + Vite）

## プロジェクト概要

React・TypeScript・Vite を用いて開発した英語学習アプリ。
「Friends」のセリフを活用し、実践的な英語表現が学習可能。

## 主な機能

- 英語と日本語の翻訳ペア表示
- ライトモード／ダークモードのテーマ切り替え
- キーボードショートカットによる操作性向上

## セットアップ方法

1. リポジトリをクローンします。
   ```
   git clone <リポジトリのURL>
   ```
2. 依存パッケージをインストールします。
   ```
   npm install
   ```
3. 開発サーバーを起動します。
   ```
   npm run dev
   ```
4. ブラウザで表示されるローカル URL にアクセスしてください。

## 利用可能な npm スクリプト一覧

- `npm run dev`  
  開発用サーバーを起動します。
- `npm run build`  
  本番用のビルドを作成します。
- `npm run preview`  
  ビルド後のアプリをローカルでプレビューします。
- `npm run lint`  
  コードの静的解析を実行します。
- `npm run deploy-dev`  
  開発環境へのデプロイを行います。
- `npm run deploy-prd`  
  本番環境へのデプロイを行います。
- `npm run login`  
  デプロイ先サービスへのログインを行います。

## データ管理

英語と日本語の翻訳ペアは `friends.json` ファイルで管理。
commit されているのは demo 用の`friends_demo.json`。

## デプロイ方法

Vercel

## プロジェクト構造

```plaintext
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── AppShell
│   │   │   ├── GlobalHotkeys.tsx
│   │   │   └── Header.tsx
│   │   └── QA
│   │       ├── Answer.tsx
│   │       ├── Controls.tsx
│   │       ├── Meta.tsx
│   │       ├── Progress.tsx
│   │       └── Prompt.tsx
│   ├── data
│   │   ├── friends.json
│   │   └── friends_demo.json
│   ├── locales
│   │   ├── en.json
│   │   └── ja.json
│   ├── main.tsx
│   ├── state
│   │   └── atoms.ts
│   ├── themes
│   │   └── theme.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```
