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
  title: "やすまっぷ | 街に、ひと息を",
  description:
    "街のどこかで少しだけ座れる場所をそっと示す、やすまっぷ。無料で広がる、街の一部のような取り組みです。",
  icons: {
    icon: "/椅子_ファビコン用.png",
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
