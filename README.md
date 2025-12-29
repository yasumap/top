# yasumap LP / Thanks

やすまっぷ（yasumap）の静的LPと、支援者向けThanks + アンケートページです。背景画像を主役に、1カラムで静かにストーリーを伝える構成です。

## Tech
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Design/Behavior
- 背景画像を全面に表示し、強いオーバーレイは使わない
- 文字は白基調で、余白と読みやすさを重視
- IntersectionObserver でフェードイン/アウト
- 高速スクロールでもメッセージが出るよう発火範囲を広げる

## Content Notes
- ヒーローは2行のキャッチ + 説明文
- 上段の説明ブロックは1つに集約
- 指定文言に合わせて改行を入れている

## Pages
- `/` LPトップ
- `/thanks` 支援者向けThanksページ（トークン必須）
- `/thanks/preview` トークン不要のプレビュー
- `/thanks/preview?done=1` 送信後画面のプレビュー
- `/admin/tokens` トークン発行ページ（Basic認証）

## Assets
- 背景画像: `public/夕日のベンチ_LP用背景画像.png`
- ファビコン: `public/椅子_ファビコン用.png` を `app/icon.png` と `app/apple-icon.png` に配置

## Development
```bash
npm install
npm run dev
```

## Environment Variables
`.env.local` に設定します。

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
BASIC_AUTH_USER=
BASIC_AUTH_PASSWORD=
```

## Thanks / Survey
- トークン付きURLでのみ閲覧可能（例: `/thanks?t=xxxxx`）
- 1トークンにつき1回回答、回答後もページ閲覧と回答内容表示
- アンケート構成
  - ご支援いただいた理由（複数回答 + その他任意）
  - やすまっぷを使ってみた印象（選択式）
  - 自由記述（任意）
- スキップ時はお礼メッセージのみ表示

## Token Admin
- `/admin/tokens` でトークンを発行
- Basic認証で保護（`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`）
- 生成したトークンを支援者へ手動送付

## Notes
- 背景画像の読み込み完了まで、近い色の下地を表示して黒転びを防ぐ
