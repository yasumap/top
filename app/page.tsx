"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
};

const passages = [
  {
    title: "小さな困りごとから、生まれた地図",
    body: "ほんの数分だけ腰を下ろしたいのに、場所が見つからない。そんな日常の小さな不便が、気づかれないまま積み重なっていました。やすまっぷは、その見過ごされがちな困りごとに静かに光を当て、必要な人が迷わず一息つけるようにするための地図です。",
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
  "皆さんからいただく支援金は、単なる利用料ではありません。",
  "「次はあそこにベンチを増やそう」「この街をもっと歩きやすくしよう」という、温かい社会を作るための応援のバトンです。",
  "同じ気持ちである皆さんの温かい応援が、大学生である私たちの活動を続ける大きな理由になります。",
  "誰かがほんの少し笑顔になれる未来を、私たちと一緒に作っていきませんか。",
];

const quickActions = [
  {
    label: "近くのベンチを探してみる",
    href: "/coming-soon",
  },
  {
    label: "地図でベンチを見てみる",
    href: "/coming-soon",
  },
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
      { threshold: 0, rootMargin: "20% 0px" }
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
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className={`absolute inset-0 -z-10 ${
          bgLoaded ? "bg-transparent" : "bg-[#CBA1A4]"
        }`}
      >
        <Image
          src="/夕日のベンチ_LP用背景画像.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center bottom" }}
          onLoadingComplete={() => setBgLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/12" />
      </div>

      <main className="relative flex min-h-screen flex-col pb-28 sm:pb-24">
        <section className="flex min-h-screen items-center px-6 py-8">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <span>ひとやすみのための地図</span>
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span>やすまっぷ</span>
            </div>

            <FadeIn>
              <div className="px-7 py-8">
                <h1 className="text-4xl leading-[1.25] text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl">
                  <span className="block">みんなにやさしい</span>
                  <span className="block">ベンチの地図</span>
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#fff6eb] drop-shadow-[0_8px_22px_rgba(0,0,0,0.32)] sm:text-xl">
                  この困りごとは、命に関わるような大きな問題ではないかもしれません。
                  <br />
                  だからこそ、ずっと見過ごされ、放置されてきました。
                  <br />
                  私たちは、そんな「小さくて見過ごされがちな困りごと」を、
                  <br />
                  テクノロジーで解決したいと思いました。
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {passages.map((item, index) => (
              <FadeIn key={item.title} delay={index * 80}>
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
                <FadeIn key={idx} delay={passages.length * 100 + idx * 120}>
                  <p className="drop-shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
                    {paragraph}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20">
          <div className="mx-auto flex max-w-3xl justify-center">
            <a
              href="/coming-soon"
              title="Coming Soon"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/12 px-6 py-4 text-base font-semibold text-[#fff6eb] shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18 hover:shadow-[0_24px_55px_rgba(0,0,0,0.32)] active:translate-y-0 active:shadow-[0_12px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd1a1] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:w-auto"
            >
              <span className="text-lg">応援していただける方はこちら</span>
            </a>
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

      <div className="fixed inset-x-0 bottom-4 z-30 px-4 sm:bottom-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              title="Coming Soon"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/85 px-5 py-3 text-sm font-semibold text-[#6b4b3a] shadow-[0_16px_36px_rgba(0,0,0,0.25)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_44px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0_10px_24px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd1a1] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
