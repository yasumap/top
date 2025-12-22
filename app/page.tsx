"use client";

import { useEffect, useRef, useState } from "react";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
};

const passages = [
  {
    title: "ふと、腰を下ろしたいとき",
    body: "買い物の途中、子どもを連れて歩くとき、雨上がりに広い空を見上げたいとき。あと5分だけ座れたら、という瞬間が街にはいくつもあります。",
  },
  {
    title: "街の一部としてひらく",
    body: "やすまっぷは、そうした小さな困りごとを減らすために生まれた試みです。夕暮れに染まる道ばたに、そっとベンチの場所を示す。看板よりも静かに、風景に溶け込むように。",
  },
  {
    title: "無料で、やわらかく",
    body: "お金を介さず、だれでも気軽に座れる場所を知ってもらうこと。それを続けるための地図づくりと整備を、無料のまま保ちたいと考えています。",
  },
  {
    title: "支援という応援のかたち",
    body: "「いいな」と思ってもらえたとき、そっと支えてくれる仕組みを用意する予定です。決済機能はまだありませんが、応援の気持ちはしっかり受け止められるよう準備を進めています。",
  },
];

function FadeIn({ children, delay = 0 }: FadeInProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2f1c3d]/80 via-[#f08a6a]/35 to-[#1a0f26]/90" />
        <div className="absolute left-1/2 top-[-120px] h-96 w-96 -translate-x-1/2 rounded-full bg-[#ffd9a0]/30 blur-3xl" />
        <div className="absolute left-8 top-36 h-48 w-48 rounded-full bg-[#f08a6a]/25 blur-3xl" />
        <div className="absolute right-12 top-24 h-56 w-56 rounded-full bg-[#ffd1a1]/25 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen flex-col">
        <section className="flex min-h-screen items-center px-6 py-16">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <span>夕暮れの街に、ひと息を</span>
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span>やすまっぷ</span>
            </div>

            <FadeIn>
              <h1 className="text-4xl leading-[1.25] sm:text-5xl md:text-6xl">
                夕焼けの街角に、やさしいベンチの地図を。
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85 sm:text-xl">
                福岡の街にそっと置かれた長椅子のように、だれかが少しだけ休める場所を灯していく。
                広告より静かに、でも確かに届く「座れる目印」を描いていきます。
              </p>
            </FadeIn>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52">
              <div className="absolute inset-x-8 bottom-6 h-24 rounded-[40px] bg-white/5 backdrop-blur-md" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120b1e] via-[#1e132c]/80 to-transparent" />
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {passages.map((item, index) => (
              <FadeIn key={item.title} delay={index * 120}>
                <article className="space-y-3 rounded-3xl border border-white/10 bg-white/6 px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
                  <h2 className="text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="text-base leading-7 text-white/85">
                    {item.body}
                  </p>
                </article>
              </FadeIn>
            ))}

            <FadeIn delay={passages.length * 140}>
              <div className="mt-4 rounded-3xl border border-white/15 bg-gradient-to-r from-white/8 via-white/6 to-white/8 px-6 py-7 text-center backdrop-blur">
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                  今は静かに準備中
                </p>
                <p className="mt-3 text-lg leading-8 text-white">
                  地図づくりやベンチの整備状況は、少しずつお知らせしていきます。
                  ひと息つきたくなったら、思い出してもらえると嬉しいです。
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <footer className="relative z-10 mt-auto px-6 pb-10">
          <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#ffd1a1]" />
              <span className="font-semibold text-white">やすまっぷ</span>
            </div>
            <div className="text-right leading-tight">
              <p>福岡エンジニアカタパルト Phase4</p>
              <p className="text-white/65">現在開発中・準備中</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
