"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const backgroundImage =
  "/穏やかなブルーとラベンダーのグラデーション.png";

export default function Home() {
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-[#0b1520]">
      <div
        className={`absolute inset-0 -z-10 ${
          bgLoaded ? "bg-transparent" : "bg-[#d7e3f0]"
        }`}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoadingComplete={() => setBgLoaded(true)}
        />
      </div>

      <main className="relative flex min-h-screen flex-col">
        <section className="flex min-h-[72vh] flex-col items-center justify-center px-6 pt-8 pb-10">
          <header className="text-center text-sm font-medium tracking-[0.08em] text-[#0b1520]/75">
            やすまっぷ｜最寄りのベンチがすぐ見つかる
          </header>

          <h1 className="mt-10 text-center text-[clamp(2rem,7vw,3.4rem)] font-semibold leading-tight text-[#0b1520]">
            今すぐ座れる場所、知ってる？
          </h1>

          <p className="mt-4 text-center text-base leading-7 text-[#0b1520]/70 sm:text-lg">
            ワンタップで、近くの“休める場所”が見つかります。
          </p>

          <div className="mt-10 w-full max-w-md">
            <Link
              href="https://yasumappu.vercel.app/"
              aria-label="近くのベンチを探す"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#1f4f78] bg-gradient-to-br from-[#4b86c6] via-[#2c6aa7] to-[#1f4f78] px-8 py-5 text-lg font-semibold text-white shadow-[0_20px_44px_rgba(10,40,80,0.28)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(10,40,80,0.35)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4f78] focus-visible:ring-offset-2 focus-visible:ring-offset-white/60"
            >
              近くのベンチを探す
            </Link>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-[0_16px_40px_rgba(11,21,32,0.12)] backdrop-blur-sm sm:p-8">
            <h2 className="text-base font-semibold tracking-[0.16em] text-[#0b1520]/70">
              使い方
            </h2>
            <ol className="space-y-4 text-base leading-7 text-[#0b1520]/80">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1f2a] text-sm font-semibold text-white">
                  1
                </span>
                <p>
                  「近くのベンチを探す」ボタンを押すと地図が開き、最寄りのベンチが表示されます。
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1f2a] text-sm font-semibold text-white">
                  2
                </span>
                <p>右下の📍ボタンを押すと、次に近いベンチが5番目まで順に表示されます。</p>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1f2a] text-sm font-semibold text-white">
                  3
                </span>
                <p>＋ボタンからベンチがあった報告ができます。</p>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
