"use client";

import Image from "next/image";
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

const storySegments = [
  "街を歩いているとき、「少しだけ座りたいな」と思う瞬間があります。",
  "買い物帰りの重い荷物、久しぶりに履いた靴での靴擦れ、あるいはただ静かに風を感じたいとき。",
  "そんなとき、今の街で座ろうとすると、選択肢は限られています。",
  "例えば、カフェに入れば一杯500円。私たち大学生にとって、その500円は一食分のランチ代と同じくらいの重みがあります。",
  "ほんの数分だけ腰を下ろしたいだけなのに、お金を払わないと居場所がない。そんな風に感じることも少なくありません。",
  "この困りごとは、命に関わるような大きな問題ではないかもしれません。だからこそ、ずっと見過ごされ、放置されてきました。",
  "私たちは、そんな「小さくて見過ごされがちな困りごと」を、テクノロジーで解決したいと思いました。",
  "必要なときに、必要な人が迷わず一息つけるように。",
  "このプロダクトを無料で提供しているのには、理由があります。道端のベンチが誰にでも開かれているのと同じように、このアプリも「街の公共物」でありたいからです。",
  "困っている人から対価をもらうのではなく、学生もお年寄りも誰もが気兼ねなく使える「優しさ」の場所であり続けたいと考えています。",
  "その代わり、もしこの活動に「いいな」と共感してくださる方がいたら、無理のない範囲で支えていただけないでしょうか。",
  "皆さんからいただく1円は、単なる利用料ではありません。",
  "「次はあそこにベンチを増やそう」「この街をもっと歩きやすくしよう」という、温かい社会を作るための応援のバトンです。",
  "1円でも、それが大学生である私たちの活動を続ける大きな理由になります。",
  "誰かがほんの少し笑顔になれる未来を、私たちと一緒に作っていきませんか。",
];

function FadeIn({ children, delay = 0 }: FadeInProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
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
      className={`transition-all duration-700 ease-out ${
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
      <div className="absolute inset-0 -z-10">
        <Image
          src="/夕日のベンチ_LP用背景画像.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center bottom" }}
        />
        <div className="absolute inset-0 bg-black/12" />
      </div>

      <main className="relative flex min-h-screen flex-col">
        <section className="flex min-h-screen items-center px-6 py-16">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <span>街に、ひと息を</span>
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span>やすまっぷ</span>
            </div>

            <FadeIn>
              <div className="px-7 py-8">
                <h1 className="text-4xl leading-[1.25] text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl">
                  <span className="block">街角に、やさしい</span>
                  <span className="block">ベンチの地図を</span>
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#fff6eb] drop-shadow-[0_8px_22px_rgba(0,0,0,0.32)] sm:text-xl">
                  福岡の街にそっと置かれた長椅子のように、だれかが少しだけ休める場所を灯していく。
                  広告より静かに、でも確かに届く「座れる目印」を描いていきます。
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {passages.map((item, index) => (
              <FadeIn key={item.title} delay={index * 120}>
                <article className="space-y-3 rounded-3xl border border-white/10 bg-white/12 px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                  <h2 className="text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="text-base leading-7 text-white/85">
                    {item.body}
                  </p>
                </article>
              </FadeIn>
            ))}

            <div className="mt-6 space-y-5 text-lg leading-8 text-[#fff5e8] tracking-[0.01em]">
              {storySegments.map((paragraph, idx) => (
                <FadeIn key={idx} delay={passages.length * 140 + idx * 180}>
                  <p className="drop-shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
                    {paragraph}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative z-10 mt-auto px-6 pb-10">
          <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#ffd1a1]" />
              <span className="font-semibold text-white">やすまっぷ</span>
            </div>
            <div className="text-right leading-tight">
              <p className="text-white/65">現在開発中・準備中</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
