# フォトフレームアプリ 仕様書

## 概要

ローカルの写真をブラウザ上で管理・閲覧できる Web アプリ。フレーム装飾、アルバム整理、スライドショー機能を持つ。

- **URL**: https://kiso-12.github.io/photo-frame-app/
- **リポジトリ**: https://github.com/kiso-12/photo-frame-app

---

## 技術スタック

| 分類 | 技術 |
|---|---|
| UI | React 19 + TypeScript |
| ビルド | Vite 8 (Rolldown) |
| スタイル | Tailwind CSS 3 + PostCSS |
| D&D | @dnd-kit/core, @dnd-kit/sortable |
| データ保存 | IndexedDB（写真）/ localStorage（アルバム） |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 機能一覧

### 写真管理
- ローカルファイル（複数選択可）または URL から写真を追加
- 写真の削除
- ドラッグ＆ドロップで並び替え
- アルバムへの振り分け

### アルバム
- アルバムの作成・削除
- アルバムで写真をフィルタリング表示

### フレーム編集
- プリセット: なし / クラシック / モダン / ポラロイド / シャドウ
- カスタム: 色・太さ（0〜30px）・影

### スライドショー
- 自動再生（1〜10秒間隔）
- トランジション: フェード / スライド / ズーム
- シャッフル
- フルスクリーン
- キーボード操作（← → Esc）

---

## データ構造

```ts
interface Photo {
  id: string
  albumId: string       // '' = 未分類
  src: string           // base64 or URL
  type: 'file' | 'url'
  name: string
  order: number
  frame: FrameSettings
}

interface FrameSettings {
  preset: 'none' | 'classic' | 'modern' | 'polaroid' | 'shadow'
  color: string         // カスタム枠の色 (HEX)
  width: number         // カスタム枠の太さ (px)
  shadow: boolean       // カスタム影
}

interface Album {
  id: string
  name: string
  createdAt: string     // ISO 8601
}
```

---

## データ保存

| データ | 保存先 | 備考 |
|---|---|---|
| 写真（src・メタデータ） | IndexedDB (`photo-frame-db`) | 容量制限なし |
| アルバム一覧 | localStorage (`albums`) | 軽量なため |

> **注意**: データはそのブラウザ・デバイスにのみ存在する。「閲覧データを削除」で消える。

---

## ファイル構成

```
src/
├── App.tsx                  # ルートコンポーネント
├── types.ts                 # 型定義
├── components/
│   ├── AlbumList.tsx        # アルバムサイドバー
│   ├── PhotoGrid.tsx        # 写真グリッド（D&D対応）
│   ├── PhotoUploader.tsx    # 写真追加モーダル
│   ├── PhotoViewer.tsx      # 写真詳細・フレーム編集
│   ├── FrameEditor.tsx      # フレーム設定UI
│   └── Slideshow.tsx        # スライドショー
├── hooks/
│   ├── usePhotos.ts         # IndexedDB CRUD
│   ├── useAlbums.ts         # localStorage CRUD
│   ├── useLocalStorage.ts   # localStorage ラッパー
│   └── useSlideshow.ts      # スライドショー状態管理
└── utils/
    └── frameToCSS.ts        # FrameSettings → CSSProperties 変換
```

---

## デプロイ

`master` ブランチへのプッシュで GitHub Actions が自動実行される。

```
push → tsc -b && vite build → gh-pages ブランチへデプロイ
```

手動デプロイ: `npm run deploy`
