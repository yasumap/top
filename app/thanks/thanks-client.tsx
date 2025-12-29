"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SupportEntry } from "@/lib/supabase";

type SurveyState = {
  penName: string;
  discovery: string;
  motive: string;
  impression: string;
  note: string;
};

type SubmitState = "idle" | "submitting" | "submitted" | "skipped" | "error";

type ThanksClientProps = {
  token: string;
  entry: SupportEntry;
};

const discoveryOptions = [
  "X（旧Twitter）",
  "Instagram",
  "友人・知人の紹介",
  "学内・街で見かけた",
  "検索・記事",
  "その他",
];

const motiveOptions = [
  {
    value: "product",
    label: "プロダクトの役立ちそうな点に共感した",
  },
  {
    value: "concept",
    label: "考え方やコンセプトに惹かれた",
  },
  {
    value: "team",
    label: "つくっている人を応援したいと思った",
  },
  {
    value: "mood",
    label: "なんとなく良いな、と感じた",
  },
];

const impressionOptions = [
  "とても良い印象",
  "良い印象",
  "ふつう",
  "これからに期待",
];

const resultMessages: Record<string, string> = {
  product:
    "実用性に目がいくタイプ。必要な人に届く設計を、さらに磨いていきます。",
  concept:
    "考え方に共感してくれるタイプ。芯のあるやさしさを育てていきます。",
  team:
    "人を応援してくれるタイプ。小さな前進を丁寧に積み重ねます。",
  mood:
    "直感を大切にするタイプ。ふと立ち寄りたくなる存在を目指します。",
};

function getMotiveLabel(value: string) {
  return motiveOptions.find((option) => option.value === value)?.label ?? value;
}

export default function ThanksClient({ token, entry }: ThanksClientProps) {
  const isLocked = Boolean(entry.answered_at);
  const [survey, setSurvey] = useState<SurveyState>({
    penName: entry.pen_name ?? "",
    discovery: entry.discovery ?? "",
    motive: entry.motive ?? "",
    impression: entry.impression ?? "",
    note: entry.note ?? "",
  });
  const [status, setStatus] = useState<SubmitState>(
    isLocked ? "submitted" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const resultMessage = useMemo(() => {
    if (!survey.motive) {
      return "静かな応援が、次の一歩につながります。";
    }
    return resultMessages[survey.motive] ?? resultMessages.mood;
  }, [survey.motive]);

  const handleChange = (
    key: keyof SurveyState,
    value: string
  ): void => {
    setSurvey((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/thanks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          penName: survey.penName,
          discovery: survey.discovery,
          motive: survey.motive,
          impression: survey.impression,
          note: survey.note,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("このアンケートはすでに回答済みです。");
        }
        throw new Error("送信に失敗しました。時間をおいてお試しください。");
      }

      setStatus("submitted");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "送信に失敗しました。時間をおいてお試しください。";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const isComplete = survey.discovery && survey.motive && survey.impression;

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
          style={{ objectPosition: "left bottom" }}
        />
        <div className="absolute inset-0 bg-black/24" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 pb-24 pt-16">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            Thanks
          </p>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-tight text-[#fffaf3] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
            ご支援ありがとうございます。
          </h1>
          <p className="max-w-2xl text-[clamp(1rem,3.4vw,1.1rem)] leading-7 text-white/85 drop-shadow-[0_8px_22px_rgba(0,0,0,0.3)]">
            やすまっぷの活動は、あなたのような応援で続いています。
            1分ほどの軽いアンケートで、これからのヒントをいただけると嬉しいです。
          </p>
        </header>

        <section className="rounded-3xl border border-white/12 bg-white/10 px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur">
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <p>アンケートは任意です。途中でスキップできます。</p>
            <p>
              ペンネームは、支援者一覧としてSNS等で公開する場合があります。
            </p>
            <p>みなさんの声が、やすまっぷの小さなコミュニティになります。</p>
          </div>

          {status === "submitted" || status === "skipped" ? (
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-6">
                <p className="text-sm tracking-[0.25em] text-white/60">
                  支援タイプ
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {survey.penName
                    ? `${survey.penName}さん、ありがとうございました。`
                    : "ありがとうございました。"}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  あなたの支援タイプ
                </p>
                <p className="mt-3 text-base leading-7 text-white/80">
                  {resultMessage}
                </p>
              </div>

              {(status === "submitted" || isLocked) && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/80">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    回答内容
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="text-white/60">ペンネーム</dt>
                      <dd>{survey.penName || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">流入元</dt>
                      <dd>{survey.discovery || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">支援理由</dt>
                      <dd>
                        {survey.motive
                          ? getMotiveLabel(survey.motive)
                          : "未記入"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">全体の印象</dt>
                      <dd>{survey.impression || "未記入"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">ひとこと</dt>
                      <dd>{survey.note || "未記入"}</dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/80 px-5 py-2 text-sm font-semibold text-[#6b4b3a] transition hover:bg-white"
                >
                  トップへ戻る
                </Link>
                {status === "skipped" && !isLocked && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    アンケートに回答する
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <label className="text-base font-semibold text-white">
                    ペンネーム
                  </label>
                  <span className="text-xs text-white/60">任意</span>
                </div>
                <input
                  type="text"
                  value={survey.penName}
                  onChange={(event) =>
                    handleChange("penName", event.target.value)
                  }
                  placeholder="例：やすみん"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    どこで知りましたか？
                  </p>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {discoveryOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        survey.discovery === option
                          ? "border-white/70 bg-white/20 text-white"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="discovery"
                        value={option}
                        checked={survey.discovery === option}
                        onChange={() => handleChange("discovery", option)}
                        className="hidden"
                      />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50 bg-white/20">
                        <span
                          className={`block h-full w-full rounded-full ${
                            survey.discovery === option
                              ? "bg-white"
                              : "bg-transparent"
                          }`}
                        />
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    支援しようと思った理由に近いものは？
                  </p>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <div className="space-y-3">
                  {motiveOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        survey.motive === option.value
                          ? "border-white/70 bg-white/20 text-white"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="motive"
                        value={option.value}
                        checked={survey.motive === option.value}
                        onChange={() => handleChange("motive", option.value)}
                        className="hidden"
                      />
                      <span className="mt-1 h-2.5 w-2.5 rounded-full border border-white/50 bg-white/20">
                        <span
                          className={`block h-full w-full rounded-full ${
                            survey.motive === option.value
                              ? "bg-white"
                              : "bg-transparent"
                          }`}
                        />
                      </span>
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    全体の印象はどうでしたか？
                  </p>
                  <span className="text-xs text-white/60">必須</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {impressionOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        survey.impression === option
                          ? "border-white/70 bg-white/20 text-white"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="impression"
                        value={option}
                        checked={survey.impression === option}
                        onChange={() => handleChange("impression", option)}
                        className="hidden"
                      />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/50 bg-white/20">
                        <span
                          className={`block h-full w-full rounded-full ${
                            survey.impression === option
                              ? "bg-white"
                              : "bg-transparent"
                          }`}
                        />
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    ひとこと（任意）
                  </p>
                  <span className="text-xs text-white/60">任意</span>
                </div>
                <textarea
                  value={survey.note}
                  onChange={(event) => handleChange("note", event.target.value)}
                  rows={4}
                  placeholder="短くても嬉しいです。"
                  className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-[#ffd1a1]">{errorMessage}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={!isComplete || status === "submitting"}
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/85 px-6 py-3 text-sm font-semibold text-[#6b4b3a] shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "送信中..." : "回答を送る"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  onClick={() => setStatus("skipped")}
                >
                  今回はスキップ
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
