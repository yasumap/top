# yasumap LP

やすまっぷ（yasumap）の静的LPです。背景画像を主役に、1カラムで静かにストーリーを伝える構成です。

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

## Assets
- 背景画像: `public/夕日のベンチ_LP用背景画像.png`
- ファビコン: `public/椅子_ファビコン用.png` を `app/icon.png` と `app/apple-icon.png` に配置

## Development
```bash
npm install
npm run dev
```

## Notes
- 背景画像の読み込み完了まで、近い色の下地を表示して黒転びを防ぐ
