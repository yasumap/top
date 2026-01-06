import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "やすまっぷ｜最寄りのベンチがすぐ見つかる",
  description: "近くのベンチが、今すぐ見つかる地図です。",
  openGraph: {
    title: "やすまっぷ｜最寄りのベンチがすぐ見つかる",
    description: "近くのベンチが、今すぐ見つかる地図です。",
    type: "website",
    locale: "ja_JP",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/やすまっぷ_ロゴ案_02.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenMaru.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
